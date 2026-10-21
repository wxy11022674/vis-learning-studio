/* Linked reading, executable examples and SVG views for every course section. */
(function(){
  'use strict';
  const M=window.LinkedLessonModels;
  const step=(title,body,...terms)=>({title,body,terms:[title,...terms]});
  const range=(id,label,min,max,value,unit='',group=1,increment=1)=>({id,label,type:'range',min,max,value,unit,group,increment});
  const select=(id,label,options,value,group=1)=>({id,label,type:'select',options,value,group});
  const check=(id,label,value,group=1)=>({id,label,type:'checkbox',value,group});
  const palettes=[['green','自然绿'],['blue','静谧蓝']];
  const curves=[['linear','线性连接'],['step','后阶梯'],['smooth','单调三次插值']];
  const colorTypes=[['categorical','定性 · 无序类别'],['sequential','顺序 · 从少到多'],['diverging','发散 · 偏离中心'],['rainbow','彩虹 · 错误对照']];
  const configs={
    '1-0':{model:'cleanData',title:'从原始字符串到可用数据',steps:[
      step('原始记录','先看输入：数字、空字符串与非法文本混在同一列。','字符串','数据来源'),
      step('类型与缺失','转换数字后检查有效性；空值不能直接当成 0。','数据类型','缺失值'),
      step('清洗后绘图','调节下限，观察筛选后哪些记录进入视图。','绘图','分布')],controls:[check('clean','排除空值与非法文本',true,1),range('minimum','身高下限',150,180,150,'cm',2)],try:'先关闭清洗，找出两条无效记录；再开启清洗，拖动身高下限。',note:'8 条合成记录；横条以 140 cm 为参照，仅用于演示清洗结果。'},
    '1-1':{model:'dikw',title:'给一个数字逐层补充意义',steps:[
      step('数据与语义','观察同一个 172，从孤立数字到附带单位与人群的记录。','数值','语义'),
      step('选择理解层次','切换层次，查看对应的解释；这是一种思考框架。','DIKW','信息'),
      step('组织知识','图形组织四层关系，解释仍需要背景和领域知识。','领域知识','智慧')],controls:[select('level','当前层次',[[0,'数据'],[1,'信息'],[2,'知识'],[3,'智慧']],1,1),check('context','补充情境与解释',true,0)],try:'在“数据”和“信息”间切换，再关闭情境，看看同一个数值还能说明什么。',note:'DIKW 示意图；层次位置不代表可测量的数量。'},
    '1-2':{model:'attributes',title:'一个字段，怎样变成视觉线索',steps:[
      step('区分数据属性','专业是无序类别；人数有有意义的零点。','名义尺度','比率尺度','类别'),
      step('位置与长度','同一组人数可以映射为点的位置，也可以映射为条的长度。','位置','长度'),
      step('数值与基线','保留数值标签和共同基线，帮助核对视觉比较。','共同基线','精确数量')],controls:[select('channel','数量的编码通道',[['length','条形长度'],['position','点的位置']],'length',1),check('color','用颜色区分专业',true,0)],try:'切换点图与条形图；关闭类别色后，观察文字标签怎样帮助识别。',note:'4 个专业的合成人数；图形不代表真实招生数据。'},
    '1-3':{model:'transformData',title:'筛选、分组，再计算统计量',steps:[
      step('筛选记录','filter 决定进入分析的样本，改变下限会改变统计对象。','filter','map'),
      step('按专业分组','把同一专业的身高放在一组，保留分组关系。','group','分组'),
      step('汇总与映射','选择人数或平均身高；条形长度按当前统计量归一化。','rollup','reduce','均值')],controls:[range('minimum','保留身高不低于',150,180,160,'cm',0),select('stat','分组统计量',[['count','人数'],['mean','平均身高']],'count',2)],try:'先看人数，再切换平均身高；提高筛选下限，核对下方数据表中的样本。',note:'8 条合成学生记录。不同统计量使用各自归一化的长度，不能直接比较两次的条长。'},
    '1-4':{model:'dataJoin',title:'数据变化后，哪些元素需要更新',steps:[
      step('enter · 新增','新集合里有、旧集合里没有的 id，需要创建图元。','enter','新增'),
      step('update · 保留','同时出现在两个集合里的 id，保留并更新。','update','稳定的 id'),
      step('exit · 移除','旧集合里有、新集合里没有的 id，需要移除。','exit','移除')],controls:[range('add','加入新 id 的数量',0,3,2,'个',0),check('keepA','新数据继续保留 A',false,2)],try:'把新增数量调到 0，再保留 A，观察三个集合如何变化。',note:'用稳定 id 计算集合关系，展示 Data-Join 的核心逻辑；不依赖 D3。'},
    '2-0':{model:'pipeline',title:'看清一条数据到图形的链路',steps:[
      step('数据变换','按人数阈值筛选原始记录，决定视图里有哪些专业。','数据变换','筛选'),
      step('视觉映射','把人数除以数据域上限，再换算成条形长度。','视觉映射','数据属性'),
      step('视图变换','只改变显示缩放，不修改原始人数。','视图变换','缩放')],controls:[range('minimum','专业人数下限',0,80,0,'人',0,2),range('scale','显示缩放',0.6,1.3,1,'倍',2,0.1)],try:'先提高人数阈值，再调整缩放。对比哪一种操作改变了数据集合。',note:'4 组合成人数；此例用长度缩放示意视图变换。'},
    '2-1':{model:'hierarchy',title:'从学生表组织出学院与专业',steps:[
      step('明细数据','每一行记录学院、专业和人数，叶节点对应专业。','学院 → 专业','学生表'),
      step('多层聚合','按学院分组，汇总子专业人数形成中间节点。','聚合','总人数'),
      step('钻取与收起','展开专业看细节，收起后保留学院层次与总量。','钻取','细粒度')],controls:[check('collapsed','收起专业，只看学院',false,2),range('spacing','层级间距',85,140,110,'px',2,5)],try:'收起专业节点，核对学院人数是否仍等于原来子专业人数之和。',note:'合成分类树；学院与专业仅为教学分组。'},
    '2-2':{model:'hierarchy',title:'结构不变，布局坐标可以改变',steps:[
      step('输入层级','学院、专业与人数构成树的输入，布局变化不改变这些记录。','嵌套数据','children'),
      step('节点结构','按学院构造包含 children 和总人数的节点。','d3.hierarchy','结构关系'),
      step('坐标与绘制','调整层间距，边和节点会按新坐标重新绘制。','坐标','间距','SVG 绘制')],controls:[range('spacing','层级间距',85,140,100,'px',2,5),check('collapsed','折叠叶节点',false,1)],try:'拖动层级间距。观察数据表保持不变，而节点坐标和连线一起变化。',note:'简化的两级树坐标计算，帮助理解“结构 → 布局 → 绘制”；不冒充完整 d3.tree 算法。'},
    '2-3':{model:'eventPath',title:'沿嵌套节点追踪事件路径',steps:[
      step('点击目标','选择内层或外层节点，确定事件最先作用的目标。','目标','子元素'),
      step('传播路径','捕获沿外到内，冒泡沿内到外；路径取决于目标深度。','捕获','冒泡','事件委托'),
      step('明确节点身份','保留节点标签，区分列表、学院与专业。','树形列表','状态')],controls:[select('target','点击目标',[[0,'课程列表'],[1,'信息学院'],[2,'计算机专业']],2,0),select('phase','观察阶段',[['bubble','冒泡 · 内 → 外'],['capture','捕获 · 外 → 内']],'bubble',1)],try:'直接点击图中的嵌套矩形，再切换捕获与冒泡，核对路径的顺序。',note:'根据目标计算的 DOM 事件路径示意，不是浏览器事件日志。'},
    '3-0':{model:'colorSpace',title:'拆开色相、饱和度与明度',steps:[
      step('HSL 参数','固定色相与饱和度，改变每个样本的明度。','HSL','色相','饱和度'),
      step('生成色带','同一个 H、S 配上不同 L，生成一组 CSS 颜色。','RGB','明度'),
      step('图元着色','色块与圆点复用相同颜色，检查参数到图元的关系。','显示器','颜色')],controls:[range('hue','色相 H',0,360,155,'°',0),range('saturation','饱和度 S',0,100,45,'%',0)],try:'把饱和度降到 0，再拖动色相；观察为什么灰色不随色相变化。',note:'这里演示 HSL；HSL 的 L 不等于 CIE Lab 的感知明度。'},
    '3-1':{model:'colorMap',title:'数据语义，决定怎样使用颜色',steps:[
      step('数据语义','先分清无序类别、递增数量，以及偏离中心的正负值。','无序类别','从少到多'),
      step('颜色编码','根据语义选定性、顺序或发散色带，建立数据与颜色的对应。','定性色带','顺序色带','发散色带'),
      step('应用到图元','图例和条形复用同一颜色映射；标签用于核对数值。','明暗变化','图例')],controls:[select('type','色带语义',colorTypes.slice(0,3),'sequential',1),select('palette','顺序色带',palettes,'green',1)],try:'点击“颜色编码”，看代码和色块同时高亮；再切换发散色带，观察零点两侧。',note:'合成样本；发散示例的条长表示绝对值，正负号由标签与色带共同说明。'},
    '3-2':{model:'labSlice',title:'在 Lab 切片里看见显示色域',steps:[
      step('固定 L*','在选定明度下，遍历 a*、b* 两条对立色轴。','Lab 切片','明度'),
      step('颜色转换','以 D65 为参考白，把 Lab 转为 XYZ，再转为 sRGB。','转换','插值'),
      step('检查色域','RGB 通道超出范围时无法原样显示；可把这些采样标为灰色。','色域','sRGB','截断')],controls:[range('lightness','Lab 明度 L*',25,85,60,'',0,5),check('gamut','用灰格标出 sRGB 色域外采样',true,2)],try:'拖动 L*，比较可显示区域。取消灰格后，观察色域外颜色被裁切的结果。',note:'D65 参考白，9 × 9 个离散采样；色域外使用通道裁切，不是完整色域映射算法。'},
    '3-3':{model:'harmony',title:'用色相角构造五种搭配关系',steps:[
      step('选择搭配规则','不同色系对应不同角度偏移；单色通过明度区分。','单色','邻近色','互补色','分裂互补','三角色系'),
      step('颜色编码','把基准色相与偏移相加，得到每个样本的 HSL 颜色。','色相关系','明度'),
      step('读懂色相位置','角度决定方向；单色样本沿同一方向排开以便观察。','色相','对比')],controls:[select('scheme','色系规则',[['mono','单色'],['analogous','邻近色'],['complementary','互补色'],['split','分裂互补'],['triadic','三角色系']],'triadic',0),range('hue','基准色相',0,360,150,'°',1)],try:'固定基准色相，依次切换五种规则，核对数据表里的角度差。',note:'色相环位置示意；搭配规则还需要结合数据语义与实际背景。'},
    '3-4':{model:'researchPalette',title:'让经典配色可检查、可复用',steps:[
      step('类别标签','A–F 是六个无序类别，不能从颜色推断数量大小。','类别数','类别'),
      step('配色方案','切换 Okabe–Ito、Paul Tol 与教学配色，对比区分效果。','Okabe–Ito','Paul Tol','配色'),
      step('图例与色值','保留文字标签与色值，让颜色的含义可以核对。','标签','图例','可读性')],controls:[select('palette','六类配色',[['okabe','Okabe–Ito · 取六色'],['tol','Paul Tol bright · 六色'],['muted','低饱和教学配色']],'okabe',1),check('labels','显示十六进制色值',true,2)],try:'切换方案，检查同一个类别使用了哪个色值，再关闭色值观察可读性。',note:'配色集合的六色示例；配色名称不能替代整张图的可访问性检查。'},
    '3-5':{model:'colorMap',title:'把彩虹色与有序色带放在一起检验',steps:[
      step('连续数值','八个样本从低到高排列，数值顺序始终可核对。','连续数据','数量顺序'),
      step('颜色编码','切换彩虹与顺序色带，观察颜色是否清楚地表达递增。','彩虹色','颜色','明度'),
      step('核对图例','图例与条形共享映射，避免同一颜色在两处表达不同含义。','图例','歧义')],controls:[select('type','对照色带',[['rainbow','彩虹色 · 错误对照'],['sequential','顺序色带 · 改进方案']],'rainbow',1),select('palette','改进方案配色',palettes,'green',1)],try:'先观察彩虹色中最显眼的区域，再换顺序色带；数值没有改变。',note:'这是连续数据用色的对照案例，不把装饰性偏好当成数量编码。'},
    '3-6':{model:'emphasis',title:'用克制的颜色建立注意力顺序',steps:[
      step('上下文','非焦点系列降低饱和度，但仍保留可读形状。','背景','次要系列','低饱和'),
      step('焦点编码','选定一个焦点，控制其色相与饱和度。','鲜艳','关键数据','注意力'),
      step('完整标签','焦点之外的类别也保留标签，便于继续比较。','对比','小字')],controls:[range('hue','色相',0,360,155,'°',1),range('saturation','焦点饱和度',20,90,60,'%',1,5),select('focus','焦点类别',Array.from({length:6},(_,i)=>[i,`第 ${i+1} 组`]),3,1)],try:'直接点击其他条形更换焦点，再调整饱和度，观察突出程度。',note:'六组固定合成数值；参数改变视觉强调，不改变数据。'},
    '3-7':{model:'redundant',title:'让颜色之外也有识别线索',steps:[
      step('系列身份','每条线代表一个系列，文字标签提供稳定身份。','文字标签','信息丢失'),
      step('颜色与线型','灰度下颜色差异减少，线型可以继续区分系列。','灰度预览','线型','色相'),
      step('冗余编码','在颜色之外叠加端点与线型，降低只靠色相识别的负担。','冗余编码','点形')],controls:[check('gray','切换到灰度预览',false,1),check('redundant','启用线型、端点与文字标签',true,2)],try:'先打开灰度，再关闭冗余编码，比较追踪同一条线的难度。',note:'灰度预览只检查明暗，不等同于色觉缺陷模拟。'},
    '4-0':{model:'coordinates',title:'从数据坐标走到屏幕坐标',steps:[
      step('数据域与范围','输入在数据域内，输出落在指定像素范围。','数据域','屏幕范围'),
      step('比例尺映射','线性归一化后乘以绘图区宽度；宽度变了，数据不变。','比例尺','线性转换'),
      step('SVG 的 Y 方向','屏幕 y 默认向下；反转后，数值越大位置越高。','y 轴','range')],fixed:{scale:'linear'},controls:[range('width','绘图区宽度',220,360,320,'px',1,10),check('invert','反转 Y：数值越大位置越高',true,2)],try:'取消 Y 反转，再调整宽度；核对数据值与像素坐标的区别。',note:'固定样本 20、40、60、80；表格显示实际计算出的像素坐标。'},
    '4-1':{model:'coordinates',title:'相同距离，究竟代表什么',steps:[
      step('明确尺度','线性示例用等差数列，对数示例用等比数列。','线性轴','对数轴'),
      step('坐标变换','对数先变换数值，再归一化；这里所有输入严格大于零。','相同比例','数量级'),
      step('检查方向','保留 Y 方向与刻度标签，避免只凭点距猜尺度。','差值','标注')],controls:[select('scale','尺度类型',[['linear','线性 · 等差样本'],['log','对数 · 等比样本']],'log',1),range('width','绘图区宽度',220,360,320,'px',1,10),check('invert','Y 轴向上增大',true,2)],try:'切换尺度时，同时看刻度值与数据表，解释为什么点距近似相等。',note:'切换尺度时也切换为对应的等差 / 等比教学样本，样本值在图和表中明确展示。'},
    '4-2':{model:'curves',title:'采样点相同，连接方式可以不同',steps:[
      step('原始样本','六个点才是观测，橙色点的值可以调节。','原始采样点','观测'),
      step('连接与插值','直线、后阶梯、单调三次插值表达不同假设。','线性连接','阶梯线','平滑插值'),
      step('屏幕坐标','按绘图区高度换算 Y 坐标，横轴标明样本编号。','采样间隔','曲线形状')],controls:[select('curve','连接方式',curves,'linear',1),range('middle','第 3 个采样值',20,90,41,'',0)],fixed:{height:180},try:'切换连接方式，检查曲线是否经过同样的点；再拖动第 3 个值。',note:'这是插值演示，不是统计拟合；连接线上的中间位置不是新增观测。'},
    '4-3':{model:'curves',title:'比例改变后，为什么趋势看起来更陡',steps:[
      step('原始数值','六个样本固定，调整高度不会更改它们。','原始数值','数据范围'),
      step('连接关系','相邻样本仍按同样方式连接，首尾差保持不变。','趋势','局部斜率'),
      step('绘图比例','绘图区越高，同一个数值差占据的垂直像素越多。','拉高','屏幕上的斜率','比例')],fixed:{middle:41,curve:'linear'},controls:[range('height','绘图区高度',140,260,180,'px',2,10)],initial:2,try:'拖动高度，同时看图和数据表。尝试解释“看起来更陡”与“增长更多”的区别。',note:'画布随高度改变，保持相同水平像素比例；原始数据与首尾差不变。'},
    '4-4':{model:'contours',title:'从网格阈值提取一条等值边界',steps:[
      step('标量网格','每个网格采样有一个场值，背景明暗表示大小。','二维网格','样本'),
      step('阈值与交点','比较单元四角与阈值，在穿过的边上做线性插值。','阈值','16 种','交点'),
      step('连接等值线','按照单元配置连接交点，得到边界线段。','等值线','Marching Squares')],controls:[range('threshold','等值阈值',20,80,50,'',1,5),check('intersections','显示边上的插值交点',true,1)],try:'提高阈值，观察边界向中心收缩；关闭交点后，网格与等值线仍然保留。',note:'径向合成标量场；此例不含歧义单元，完整应用还需要处理鞍点等情况。'},
    '5-0':{model:'timeAggregation',title:'同一段时间，用不同粒度观察',steps:[
      step('时间记录','连续 90 天，每条记录包含 UTC 日期与观测值。','采样粒度','观测范围'),
      step('时间分组','按天、固定七天块或自然月分组，并计算均值。','时间分解','年、月','汇总'),
      step('趋势图形','用时间位置连接聚合结果，观察细节如何被概括。','尺度','模式')],controls:[select('grain','聚合粒度',[['day','每天'],['week','每 7 天一组'],['month','自然月']],'day',1)],try:'从每天切换到每月，比较观测点数量与波动；聚合后的值是均值。',note:'2026 年 1–3 月的 90 天合成数据；“7 天一组”从 1 月 1 日起算，不是自然周。'},
    '5-1':{model:'missingTime',title:'缺失值应该怎样画在线上',steps:[
      step('检查观测','12 个月中有两个缺失月；缺失与真实的 0 含义不同。','观测','缺失'),
      step('连接规则','可以断线、跨越，或补零对照；不同处理会暗示不同事实。','断开连接','补成 0','折线图'),
      step('时间标签','保留全年月份位置，缺失月份也有自己的时间位置。','横轴','时间')],controls:[select('missing','缺失值处理',[['gap','保留缺口 · 推荐'],['connect','跨缺失连接 · 需说明'],['zero','补零 · 错误对照']],'gap',1)],try:'对比断线与补零，找出补零后新出现的两个假谷底。',note:'等间隔月度合成数据；第 3、7 月缺失。'},
    '5-2':{model:'calendar',title:'把日期排进日历，再用颜色编码',steps:[
      step('日历位置','周映射到列，星期映射到行；每个格子代表一天。','周映射到列','星期映射到行','日期'),
      step('颜色编码','把当天数值映射到顺序色阶；灰格表示低于当前阈值。','颜色','数值','格子'),
      step('颜色图例','五级色阶与数据范围保持对应，配色变化不改动日期与数值。','图例','筛选')],controls:[select('palette','顺序色带',palettes,'green',1),range('threshold','只突出不低于',0,80,0,'次',1,5)],try:'提高阈值，查看高值集中在哪些天；悬停格子可读日期与具体值。',note:'2026 年前 56 天的合成数据；灰格是筛选结果，仍有原始观测。'},
    '5-3':{model:'spiral',title:'让连续周期沿螺旋展开',steps:[
      step('时间转角度','一个周期转一圈，同周期位置具有相同方向。','角度','周期位置'),
      step('半径随时间增长','按 r = a + bθ 逐渐向外，避免多圈完全重叠。','半径','阿基米德螺旋','r = a + bθ'),
      step('定位观测点','把极坐标转换为平面位置，颜色仅区分相邻圈次。','螺旋布局','方向')],controls:[select('period','每圈的时间长度',[[7,'7 天'],[14,'14 天'],[28,'28 天']],14,0),range('spacing','半径增长系数 b',2,7,4,'',1)],try:'切换每圈天数，观察同一天的位置变化；再改变 b 比较内外圈的疏密。',note:'84 个连续日期点；画面统一缩放适应画布，颜色不表示观测量。'},
    '5-4':{model:'storyline',title:'沿时间追踪人物的相遇与分离',steps:[
      step('人物与场景','横轴按场景顺序展开，每条线有固定的角色身份。','人物','时间'),
      step('轨迹与关系','同场景相遇时轨迹靠近，改变焦点只强调选定角色。','相遇','轨迹','分离'),
      step('事件定位','虚线框标出相遇场景；纵向位置不表示数量高低。','场景','纵向位置','群组')],controls:[select('meeting','相遇场景',Array.from({length:5},(_,i)=>[i,`场景 ${i+1}`]),2,2),select('person','强调角色',[[0,'角色 A'],[1,'角色 B'],[2,'角色 C']],0,1)],try:'移动相遇场景，再直接点击某条轨迹，追踪这一角色的变化。',note:'三个虚构角色的简化故事线；不是电影原始事件数据或自动布局算法。'}
  };
  const states=new Map();
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const defaults=c=>Object.assign({},c.fixed,...c.controls.map(x=>({[x.id]:x.value})));
  function getState(key){if(!states.has(key)){const c=configs[key];states.set(key,{p:defaults(c),active:c.initial??1});}return states.get(key);}
  function control(c,key,p){
    const id=`ll-${key}-${c.id}`,label=`${esc(c.label)}${c.type==='range'?`<output for="${id}" data-ll-output="${c.id}">${esc(p[c.id])}${esc(c.unit)}</output>`:''}`;
    if(c.type==='checkbox')return `<label class="ll-check" for="${id}"><input id="${id}" type="checkbox" data-ll-control="${c.id}" ${p[c.id]?'checked':''}><span>${esc(c.label)}</span></label>`;
    return `<div class="ll-control"><label for="${id}">${label}</label>${c.type==='range'?`<input id="${id}" data-ll-control="${c.id}" type="range" min="${c.min}" max="${c.max}" step="${c.increment}" value="${p[c.id]}">`:`<select id="${id}" data-ll-control="${c.id}">${c.options.map(([v,t])=>`<option value="${esc(v)}" ${String(p[c.id])===String(v)?'selected':''}>${esc(t)}</option>`).join('')}</select>`}</div>`;
  }
  function view(chapter,index){
    const key=`${chapter}-${index}`,c=configs[key];if(!c)return '';
    const s=getState(key);
    return `<section class="linked-lesson" data-ll-key="${key}" aria-labelledby="ll-title-${key}">
      <header class="ll-header"><div><span class="ll-eyebrow">读一段 · 看代码 · 动手改</span><h2 id="ll-title-${key}">${esc(c.title)}</h2></div><span class="ll-live"><i></i>实时联动</span></header>
      <p class="ll-instruction">① 点击知识点看对应代码与图形　② 调整参数验证理解</p>
      <div class="ll-concepts" role="group" aria-label="选择要理解的知识点">${c.steps.map((x,i)=>`<button type="button" class="ll-concept" data-ll-step="${i}" aria-pressed="${s.active===i}"><span class="ll-concept-top"><small>0${i+1}</small><strong>${esc(x.title)}</strong><span aria-hidden="true">↗</span></span><span class="ll-concept-body">${esc(x.body)}</span></button>`).join('')}</div>
      <div class="ll-workbench">
        <div class="ll-code-panel"><div class="ll-panel-heading"><span><b>代码</b> <small>实际运行的 JavaScript</small></span><button type="button" data-ll-copy>复制</button></div><p class="ll-code-focus"></p><div class="ll-code-scroll" tabindex="0" role="region" aria-label="可滚动的示例源代码"><ol class="ll-code-lines"></ol></div></div>
        <div class="ll-visual-panel"><div class="ll-panel-heading"><span><b>图形</b> <small>点击图形也能反查讲解</small></span><span class="ll-data-label">教学示例</span></div><div class="ll-chart"></div><div class="ll-graph-legend" role="group" aria-label="图形中的知识点">${c.steps.map((x,i)=>`<button type="button" data-ll-step="${i}" aria-pressed="${s.active===i}"><i></i>${esc(x.title)}</button>`).join('')}</div><div class="ll-controls">${c.controls.map(x=>control(x,key,s.p)).join('')}</div></div>
      </div>
      <div class="ll-feedback" role="status" aria-live="polite" aria-atomic="true"></div>
      <div class="ll-task"><span>试一试</span><p>${esc(c.try)}</p><button type="button" data-ll-reset>重置参数 ↺</button></div>
      <details class="ll-details"><summary>查看当前数据与计算结果</summary><div class="ll-table-wrap"></div></details><p class="ll-note">${esc(c.note)}</p>
    </section>`;
  }
  function source(key){
    const c=configs[key],s=getState(key),lines=[{text:'// 当前参数：控件变化时，这里的值会同步更新',group:-1},{text:'const p = {',group:-1}];
    Object.entries(s.p).forEach(([name,value],i,a)=>lines.push({text:`  ${name}: ${JSON.stringify(value)}${i<a.length-1?',':''}`,group:c.controls.find(x=>x.id===name)?.group??0}));
    lines.push({text:'};',group:-1},{text:'',group:-1});
    let group=-1;
    for(let line of M[c.model].toString().split('\n')){
      const marker=line.match(/\/\*@([012])\*\//);if(marker)group=Number(marker[1]);
      line=line.replace(/\/\*@[012]\*\/ ?/g,'').replace(/^ {2}/,'').trimEnd();
      lines.push({text:line,group,compute:true});
    }
    lines.push({text:'',group:-1},{text:`const result = ${c.model}(p);`,group:2},{text:'// result.marks → 图形；result.table → 下方数据表',group:2});
    return lines;
  }
  function highlightCode(text){
    return text.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b(?:const|let|return|function|if|else|for|of|true|false|null|new)\b)/g).map((part,i)=>i%2?`<span class="${/^["'`]/.test(part)?'ll-token-string':'ll-token-key'}">${esc(part)}</span>`:esc(part)).join('');
  }
  function renderCode(root,key){root.querySelector('.ll-code-lines').innerHTML=source(key).map((line,i)=>`<li class="ll-code-line" data-ll-step="${line.group}" ${line.compute?'data-ll-compute="true"':''} data-line="${i+1}"><span class="ll-line-number" aria-hidden="true">${i+1}</span><code>${highlightCode(line.text)||' '}</code></li>`).join('');}
  function renderGraph(root,key){
    const c=configs[key],model=M[c.model](getState(key).p),allowed=new Set(['rect','circle','line','path','text','polygon']);
    const marks=model.marks.map(m=>{if(!allowed.has(m.tag))return '';const attrs=Object.entries(m.attrs).map(([k,v])=>`${k}="${esc(v)}"`).join(' ');const choose=m.choose?` data-ll-choose="${esc(m.choose.id)}" data-ll-value="${esc(m.choose.value)}" role="button" tabindex="0" aria-label="${esc(m.tip||'选择图元')}"`:'';return `<g class="ll-mark" data-ll-step="${m.group}"${choose}>${m.tip?`<title>${esc(m.tip)}</title>`:''}<${m.tag} ${attrs}>${m.tag==='text'?esc(m.text??''):''}</${m.tag}></g>`;}).join('');
    root.querySelector('.ll-chart').innerHTML=`<svg viewBox="0 0 ${model.width||460} ${model.height}" style="--ll-plot-height:${model.height}px" role="group" aria-label="${esc(c.title)}，点击图元选择关联知识点"><title>${esc(c.title)}</title>${marks}</svg>`;
    root.querySelector('.ll-feedback').textContent=model.summary;
    const [head,...rows]=model.table;
    root.querySelector('.ll-table-wrap').innerHTML=`<table><caption class="ll-sr-only">${esc(c.title)}：当前数据与计算结果</caption><thead><tr>${head.map(x=>`<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  function activate(root,key,index,seek=false){
    if(index<0||index>2)return;
    const c=configs[key],s=getState(key);s.active=index;
    root.querySelectorAll('[data-ll-step]').forEach(el=>{const chosen=Number(el.dataset.llStep)===index;el.classList.toggle('ll-selected',chosen);if(el.tagName==='BUTTON')el.setAttribute('aria-pressed',String(chosen));});
    const selectedLines=[...root.querySelectorAll('.ll-code-line.ll-selected')].map(x=>x.dataset.line);
    root.querySelector('.ll-code-focus').textContent=`正在理解：${c.steps[index].title} · 高亮 ${selectedLines.length} 行代码`;
    if(seek){const line=root.querySelector('.ll-code-line.ll-selected[data-ll-compute]'),scroller=root.querySelector('.ll-code-scroll');if(line)scroller.scrollTop=Math.max(0,line.offsetTop-20);}
    document.querySelectorAll(`.linked-term[data-ll-key="${key}"]`).forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.llStep)===index)));
  }
  function mountAll(parent){parent.querySelectorAll('.linked-lesson').forEach(root=>{const key=root.dataset.llKey;renderCode(root,key);renderGraph(root,key);activate(root,key,getState(key).active,true);});}
  function annotate(text,chapter,index){
    const key=`${chapter}-${index}`,c=configs[key];if(!c)return esc(text);
    const terms=c.steps.flatMap((x,i)=>x.terms.map(term=>({term,step:i}))).filter(x=>x.term.length>1).sort((a,b)=>b.term.length-a.term.length);
    let result='',at=0;
    while(at<text.length){let found=null;for(const x of terms){const pos=text.indexOf(x.term,at);if(pos>=0&&(!found||pos<found.pos))found={...x,pos};}if(!found){result+=esc(text.slice(at));break;}result+=esc(text.slice(at,found.pos))+`<button type="button" class="linked-term" data-ll-key="${key}" data-ll-step="${found.step}" aria-pressed="false" title="联动查看：${esc(c.steps[found.step].title)}">${esc(found.term)}</button>`;at=found.pos+found.term.length;}
    return result;
  }
  function updateControl(root,key,id,value){
    const c=configs[key],control=c.controls.find(x=>x.id===id);if(!control)return;
    if(control.type==='range'){value=Number(value);if(!Number.isFinite(value))return;value=Math.max(control.min,Math.min(control.max,control.min+Math.round((value-control.min)/control.increment)*control.increment));value=Number(value.toFixed(4));}
    if(control.type==='select'){const option=control.options.find(x=>String(x[0])===String(value));if(!option)return;value=option[0];}
    if(control.type==='checkbox')value=Boolean(value);
    const s=getState(key),previousStep=s.active;s.p[id]=value;
    const input=root.querySelector(`[data-ll-control="${id}"]`);if(control.type==='checkbox')input.checked=value;else input.value=String(value);
    const output=root.querySelector(`[data-ll-output="${id}"]`);if(output)output.textContent=String(value)+control.unit;
    const oldScroll=root.querySelector('.ll-code-scroll').scrollTop;
    renderCode(root,key);renderGraph(root,key);activate(root,key,control.group,previousStep!==control.group);
    if(previousStep===control.group)root.querySelector('.ll-code-scroll').scrollTop=oldScroll;
  }
  async function copySource(button,key){
    const text=source(key).map(x=>x.text).join('\n');
    try{await navigator.clipboard.writeText(text);button.textContent='已复制';}catch{const input=document.createElement('textarea');input.value=text;input.className='ll-copy-fallback';document.body.appendChild(input);input.select();const ok=document.execCommand?.('copy');input.remove();button.textContent=ok?'已复制':'请选中代码复制';}
    setTimeout(()=>{if(button.isConnected)button.textContent='复制';},2200);
  }
  document.addEventListener('click',event=>{
    const el=event.target.closest('[data-ll-step],[data-ll-reset],[data-ll-copy]');if(!el)return;
    const root=el.closest('.linked-lesson')||document.querySelector(`.linked-lesson[data-ll-key="${el.dataset.llKey}"]`);if(!root)return;
    const key=root.dataset.llKey;
    if(el.hasAttribute('data-ll-reset')){states.delete(key);const replacement=document.createElement('div');replacement.innerHTML=view(...key.split('-'));const next=replacement.firstElementChild;root.replaceWith(next);mountAll(document.querySelector('#main')||document.body);next.querySelector('.ll-feedback').textContent='已重置参数。'+next.querySelector('.ll-feedback').textContent;next.querySelector('[data-ll-reset]').focus({preventScroll:true});return;}
    if(el.hasAttribute('data-ll-copy')){copySource(el,key);return;}
    if(el.hasAttribute('data-ll-choose')){updateControl(root,key,el.dataset.llChoose,el.dataset.llValue);return;}
    activate(root,key,Number(el.dataset.llStep),true);
    if(el.classList.contains('linked-term'))root.scrollIntoView({block:'start',behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  });
  document.addEventListener('input',event=>{const el=event.target;if(el.matches('[data-ll-control]')&&el.type==='range'){const root=el.closest('.linked-lesson');updateControl(root,root.dataset.llKey,el.dataset.llControl,el.value);}});
  document.addEventListener('change',event=>{const el=event.target;if(el.matches('[data-ll-control]')&&el.type!=='range'){const root=el.closest('.linked-lesson');updateControl(root,root.dataset.llKey,el.dataset.llControl,el.type==='checkbox'?el.checked:el.value);}});
  document.addEventListener('keydown',event=>{const el=event.target.closest('[data-ll-choose]');if(el&&['Enter',' '].includes(event.key)){event.preventDefault();el.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
  window.LinkedLessons={view,mountAll,annotate,configs,source};
})();

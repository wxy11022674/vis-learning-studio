/* 新编导学内容；章节结构来自 cinger007/vis，原课件可由每章的资料链接访问。 */
window.VIS_COURSE = [
  {
    id: 1, title: '数据', en: 'Understanding data', color: 'green', icon: 'database', time: 45,
    desc: '读懂数据的语言，为每一次视觉表达打好基础。', tags: ['数据属性', 'DIKW', 'Data-Join'], lab: 'encoding',
    sections: [
      { title: '数据生成与清洗', minutes: 8, intro: '一张可靠的图表，从一份可信的数据开始。',
        goal: '区分真实数据与合成数据，完成字段映射、数值转换和缺失值检查。',
        paragraphs: ['CSV 文件中的数字最初往往是字符串。绘图前应先统一字段名，再显式转换数据类型；把缺失值直接当作 0，可能会改变均值和分布。', '原课程以新生数据为案例。AI 合成数据适合练习代码，却不能直接用于描述真实学生群体。报告里应写明数据来源、生成方式与适用范围。'],
        example: '把“身高”字段映射为 height，用 Number 转换，并把空字符串与非法数字过滤掉。先检查，再计算。',
        takeaway: '可视化不会自动修复数据质量，错误数据只会被画得更清楚。',
        code: 'const clean = rows\n  .map(d => ({\n    major: d["专业"],\n    height: d["身高"].trim() === ""\n      ? NaN : Number(d["身高"])\n  }))\n  .filter(d => Number.isFinite(d.height));' },
      { title: '数据定义与 DIKW', minutes: 7, intro: '从一个数值，到一个可以解释的发现。',
        goal: '理解数据、信息、知识与智慧之间的区别。',
        paragraphs: ['“172”只是一个数值；“某位新生的身高为 172 cm”补充了语义；把一组新生的身高画成分布图，能进一步帮助我们辨认集中趋势与离群值。', 'DIKW 是一种组织思考的框架：Data（数据）、Information（信息）、Knowledge（知识）、Wisdom（智慧）。图表帮助组织信息和发现模式，但模式的解释仍需要领域知识。'],
        example: '看到某专业平均身高更高，先检查人数与分组方式，再讨论原因。图表中的相关关系不等于因果关系。',
        takeaway: '为数据补充上下文，让读者知道“这是什么”与“为什么值得看”。',
        code: 'const values = students.map(d => d.height);\nconst mean = values.reduce((a, b) => a + b, 0)\n  / values.length;\n// 数值 + 单位 + 人群 + 来源，才构成可解释的信息。' },
      { title: '数据属性与测量尺度', minutes: 10, intro: '先认识数据类型，再选择视觉通道。',
        goal: '识别名义、顺序、区间、比率四类尺度，并选择合适编码。',
        paragraphs: ['名义尺度只表示类别，如专业；顺序尺度还包含次序，如满意度等级。区间尺度中差值有意义，但零点并不表示数量不存在，例如摄氏温度。比率尺度具有有意义的零点，例如身高和人数。', '同一字段可以通过位置、长度、颜色或面积来表达。比较精确数量时，共同基线上的位置和长度通常更容易读；类别用色相区分，连续数量则适合有顺序的明度变化。'],
        example: '专业 → 不同色相；满意度 → 有序色带；人数 → 从零开始的条形长度。不要给无序类别强加深浅顺序。',
        takeaway: '视觉编码应保留数据本来的比较关系。',
        code: '// 以下为 D3 示例，原课程中可查看完整运行版本。\nconst category = d3.scaleOrdinal()\n  .domain(["计算机", "地理", "数学"])\n  .range(["#397d69", "#6491b5", "#d6a45e"]);\nconst count = d3.scaleLinear()\n  .domain([0, 100]).range([0, 400]);' },
      { title: '数据变换与聚合', minutes: 10, intro: '把原始记录变成能够回答问题的数据。',
        goal: '理解 map、filter、reduce，以及分组与聚合的作用。',
        paragraphs: ['map 将每条记录转换为新记录，filter 保留符合条件的记录，reduce 将记录归并为结果。变换的顺序会影响分析对象，因此应明确每一步改变了什么。', 'group 保留每组的原始记录；rollup 进一步把每组汇总为人数、总和或均值。统计均值时还应关注分组人数，人数很小的一组可能不稳定。'],
        example: '问题是“各专业有多少新生？”时，先按专业分组，再计数；问题变成“平均身高是多少？”时，只需替换聚合函数。',
        takeaway: '聚合让结构更清晰，也会隐藏组内差异。',
        code: 'const countByMajor = d3.rollup(\n  students,\n  group => group.length,\n  d => d.major\n);\nconst summary = Array.from(countByMajor,\n  ([major, count]) => ({ major, count }));' },
      { title: 'D3 选择器与 Data-Join', minutes: 10, intro: '让数据和画面里的元素一一对应。',
        goal: '理解 enter、update、exit，并用稳定的 key 保持元素身份。',
        paragraphs: ['当数据变化时，有些图元需要新增（enter），有些保留并更新（update），有些需要移除（exit）。Data-Join 把这三种情况统一到数据驱动的更新流程中。', '默认按索引匹配元素；一旦数据排序，元素可能被误认为另一条记录。用唯一且稳定的 id 作为 key，可以保持对象身份，让更新和动画具有连续性。'],
        example: '原来有 A、B、C 三个条形，新数据变成 B、C、D。以 id 匹配时，A 退出，B/C 更新，D 进入。',
        takeaway: 'key 描述“它是谁”，位置和颜色描述“它现在是什么样”。',
        code: 'svg.selectAll("circle")\n  .data(points, d => d.id)\n  .join(\n    enter => enter.append("circle"),\n    update => update,\n    exit => exit.remove()\n  )\n  .attr("cx", d => x(d.value))\n  .attr("r", 5);' }
    ]
  },
  {
    id: 2, title: '数据可视化流程', en: 'The visualization pipeline', color: 'blue', icon: 'workflow', time: 40,
    desc: '从原始数据到交互视图，串起可视化的完整链路。', tags: ['Card 模型', '树布局', '事件机制'], lab: 'encoding',
    sections: [
      { title: '数据可视化流程', minutes: 10, intro: '一次可视化，是一系列有目的的转换。', goal: '用 Card 数据流模型解释数据变换、视觉映射与视图变换。',
        paragraphs: ['数据变换把原始数据组织为可分析的数据表；视觉映射把数据属性映射成位置、形状、颜色等视觉结构；视图变换控制最终看到的范围和视角。', '交互让这条链路成为循环：筛选改变数据集合，切换编码改变视觉映射，缩放和平移改变视图。区分操作作用于哪一层，有助于定位错误。'],
        example: '新生 CSV → 按专业统计人数 → 映射为条形长度 → 调整显示范围。依次对应数据变换、视觉映射、视图变换。', takeaway: '先定义要回答的问题，再选择数据与图形。', code: 'const selected = rows.filter(d => d.year === 2026);\nconst grouped = summarize(selected); // 数据变换\nconst marks = grouped.map(d => ({\n  x: x(d.count), y: y(d.major) // 视觉映射\n}));\n// viewBox、缩放与平移控制视图变换。' },
      { title: '分类树与多层聚合', minutes: 10, intro: '把平面的记录整理成层级结构。', goal: '理解多层分组、汇总，以及 OLAP 的切片与钻取。',
        paragraphs: ['一张学生表可以按“学院 → 专业”建立层级。第一层聚合回答学院总人数，继续钻取可以看到各专业的组成。', '切片固定一个维度的取值；切块选取多个维度范围；钻取则从粗粒度走向细粒度。每次切换都应让用户清楚当前的统计范围。'], example: '点击“信息学院”后查看其下属专业，就是从学院层向专业层钻取。返回时应保留当前位置的上下文。', takeaway: '层级既是数据结构，也是引导阅读的结构。', code: 'const tree = d3.rollup(\n  students,\n  group => group.length,\n  d => d.college,\n  d => d.major\n);\n// Map<学院, Map<专业, 人数>>' },
      { title: '树布局与视觉映射', minutes: 10, intro: '让结构关系在空间里显现出来。', goal: '理解 hierarchy 与 tree 的分工，认识树布局的间距与方向。',
        paragraphs: ['d3.hierarchy 将嵌套数据包装为节点，保留 parent、children、depth 等结构关系；d3.tree 为这些节点计算坐标。布局计算与 SVG 绘制是两个独立步骤。', 'Reingold-Tilford 风格的整齐树布局强调子树的紧凑与层级的可读性。节点标签过长时，应调整间距或方向，避免把算法输出当作最终设计。'], example: '横向树中用纵坐标区分同层节点，用横坐标表达层级深度。连线帮助读者追踪父子关系。', takeaway: '算法负责放置，设计负责让关系容易阅读。', code: 'const root = d3.hierarchy(data);\nconst layout = d3.tree().nodeSize([32, 160]);\nlayout(root);\nconst nodes = root.descendants();\nconst links = root.links();\n// 常见横向布局：屏幕位置 = (node.y, node.x)' },
      { title: '树形列表与事件委托', minutes: 10, intro: '用少量事件，让整棵树响应操作。', goal: '理解事件冒泡、展开收起与可访问交互。',
        paragraphs: ['DOM 事件会经历捕获、目标与冒泡三个阶段。事件委托利用冒泡机制，在父容器上处理子元素的点击，尤其适合动态新增的节点。', '树形列表的展开按钮应明确显示状态，并设置 aria-expanded。交互不仅是鼠标点击，还要支持键盘与焦点定位。'], example: '点击专业名不一定要展开；把展开行为绑定到明确的按钮上，避免文本选择与展开操作互相冲突。', takeaway: '交互状态应该既看得见，也能被辅助技术读取。', code: 'container.addEventListener("click", event => {\n  const button = event.target.closest("[data-node]");\n  if (!button) return;\n  const open = button.getAttribute("aria-expanded")\n    === "true";\n  button.setAttribute("aria-expanded", String(!open));\n});' }
    ]
  },
  {
    id: 3, title: '色彩专题', en: 'The language of color', color: 'purple', icon: 'palette', time: 65,
    desc: '让颜色传递信息，也让每一位读者都能看懂。', tags: ['颜色空间', 'Colormap', '色觉友好'], lab: 'color',
    sections: [
      { title: '颜色模型基础', minutes: 8, intro: '同一种颜色，可以有不同的描述方式。', goal: '区分 RGB、HSL、HSV 与 CIE Lab 的用途。', paragraphs: ['RGB 用红绿蓝通道描述显示器的加色混合；HSL 用色相、饱和度和亮度方便人工调整；HSV 也采用色相和饱和度，但明度定义不同。', 'CIE Lab 用 L* 表示明度，a*、b* 表示对立色轴，旨在更接近感知上的差异。即便如此，数值距离与感知距离也并非在所有区域都完全一致。'], example: '在 HSL 中保持同样的 L 数值，并不意味着不同色相看起来一样亮。设计连续色带时应检查感知明度。', takeaway: '便于编辑的颜色空间，不一定是便于感知比较的空间。', code: 'const cssColor = "hsl(155, 35%, 38%)";\nconst rgb = d3.rgb(cssColor);\nconst lab = d3.lab(rgb);\nconsole.log(lab.l, lab.a, lab.b);' },
      { title: '三类 Colormap 的选择', minutes: 9, intro: '色带的结构，要和数据的含义一致。', goal: '按类别、连续数量与中心偏差选择色带。', paragraphs: ['定性色带用相互区分的色相表示无序类别；顺序色带用有序的明暗变化表示从少到多；发散色带从一个有意义的中心向两侧变化。', '彩虹色带的亮度不单调，容易制造虚假的视觉边界。连续数据通常应优先考虑感知顺序更清楚的方案。'], example: '专业类别 → 定性；降水量 → 顺序；相对基准的温度偏差 → 以 0 为中心的发散。', takeaway: '先问数据有没有顺序、有没有中心，再决定配色。', code: 'const sequential = d3.scaleSequential()\n  .domain([0, 100]).interpolator(d3.interpolateViridis);\nconst diverging = d3.scaleDiverging()\n  .domain([-10, 0, 10])\n  .interpolator(d3.interpolateRdBu);' },
      { title: 'CIE Lab 与色域', minutes: 8, intro: '数学上描述的颜色，不一定都能被屏幕显示。', goal: '理解颜色空间与设备色域的区别。', paragraphs: ['色域是某个设备或标准能够表现的颜色集合。同一个 Lab 切片中，有些颜色超出了 sRGB 显示范围，转换时可能发生截断或映射。', '比较配色时，应在实际目标设备和背景上检查效果。用超出目标色域的颜色做均匀插值，最终显示可能出现不均匀的变化。'], example: '为网页设计时以 sRGB 为实用参考；为印刷设计时还需要检查输出设备与纸张的色彩表现。', takeaway: '颜色的数值、显示范围与实际观感，需要一起考虑。', code: 'const lab = d3.lab(65, 35, -25);\nconst rgb = d3.rgb(lab);\nconsole.log(rgb.displayable()); // 是否在 RGB 显示范围内\nconst css = rgb.formatHex();' },
      { title: '五大色系搭配', minutes: 8, intro: '用色彩关系建立秩序，而不是堆满颜色。', goal: '理解单色、邻近、互补、分裂互补与三角色系。', paragraphs: ['单色与邻近色适合营造统一感；互补色能产生明显对比；分裂互补和三角色系在区分多组对象时提供更多选择。', '色相关系只是起点。还要同时控制明度、饱和度、背景对比和颜色数量。装饰性搭配不能替代对数据语义的判断。'], example: '给一个关键系列使用高饱和强调色，其他系列用较低饱和度；保留文字标签，避免只能靠颜色认出关键数据。', takeaway: '统一、区分和强调，是三种不同的配色任务。', code: 'const hue = 150;\nconst analogous = [hue - 30, hue, hue + 30];\nconst complementary = [hue, (hue + 180) % 360];\nconst colors = analogous.map(h => `hsl(${h}, 40%, 45%)`);' },
      { title: '经典科研配色', minutes: 8, intro: '从经过实践的方案出发，再适配你的图表。', goal: '认识 Okabe–Ito、Paul Tol 与 ColorBrewer 的使用场景。', paragraphs: ['Okabe–Ito 和 Paul Tol 提供了兼顾区分与色觉差异的常用配色思路；ColorBrewer 按数据类型、类别数等条件组织方案。', '“使用了某个配色”并不等于整张图自动可访问。线条宽度、点的大小、背景、图例与标签同样影响可读性。'], example: '多条折线除颜色外再搭配实线、虚线与端点形状；在系列末尾直接标注名称，减轻来回对照图例的负担。', takeaway: '成熟方案是起点，实际图表的可读性才是终点。', code: 'const okabeIto = [\n  "#E69F00", "#56B4E9", "#009E73", "#F0E442",\n  "#0072B2", "#D55E00", "#CC79A7", "#000000"\n];\nconst color = d3.scaleOrdinal(okabeIto);' },
      { title: '配色对错案例', minutes: 8, intro: '辨认那些看起来漂亮、读起来困难的图表。', goal: '识别彩虹伪边界、过多类别、语义冲突和低对比。', paragraphs: ['连续数据用无序彩虹色会弱化数量顺序；十几种相似颜色会让图例难以匹配；同一种颜色表达不同含义会制造歧义。', '把“收入增加”画成红色是否合理，取决于读者与情境。采用约定颜色时，应保持一致并给出清楚的图例。'], example: '把“城市”用定性色相区分，把“空气污染程度”用顺序明度表达。不要让读者从无序色相中猜数值大小。', takeaway: '任何配色都应该能回答：颜色变化在这里意味着什么？', code: '// 错误思路：连续数量 → 无序类别颜色\n// 更合适：连续数量 → 单调的明度或感知色带\nconst color = d3.scaleSequential(d3.interpolateBlues)\n  .domain([0, maxValue]);' },
      { title: '鲜艳与低饱和的平衡', minutes: 8, intro: '让少量强调，获得足够的注意力。', goal: '通过饱和度与面积关系建立视觉层级。', paragraphs: ['如果所有元素都很鲜艳，就没有元素真正突出。背景、辅助网格和次要系列可以减弱，让读者的注意力落在关键数据上。', '低饱和颜色不等于浅到看不见。细线、小点和小字仍需要足够对比；重要信息不能只靠细微的颜色差异。'], example: '三组数据中，使用一组深绿作为焦点，另外两组用灰蓝与灰绿；用标题说明为什么突出这组。', takeaway: '强调是一种相对关系，而不只是把颜色调得更亮。', code: 'const palette = {\n  focus: "#26745e",\n  context: "#a6bcb3",\n  grid: "#e7ebe6",\n  text: "#283d36"\n};' },
      { title: '色觉友好与冗余编码', minutes: 8, intro: '让颜色成为帮助，而不是阅读门槛。', goal: '理解色觉差异，使用形状、文字和线型补充颜色。', paragraphs: ['部分读者难以区分某些颜色组合。仅用红绿表示对错、仅用不同色相区分细线，都可能造成信息丢失。', '使用文字标签、图案、点形或线型形成冗余编码。灰度预览有助于检查明暗层级，但不能替代针对具体色觉缺陷的模拟和用户测试。'], example: '正确答案除了绿色，还应显示“回答正确”和勾形标记；图表除颜色外，还应保留类别名称。', takeaway: '去掉颜色之后，图表的核心信息仍应尽量保留。', code: '// 用线型提供第二条识别线索。\nconst dash = d3.scaleOrdinal()\n  .domain(["A", "B", "C"])\n  .range([null, "6 3", "2 3"]);\nline.attr("stroke-dasharray", d => dash(d.group));' }
    ]
  },
  {
    id: 4, title: '低维数据可视化', en: 'Seeing in dimensions', color: 'orange', icon: 'chart', time: 45,
    desc: '理解坐标、曲线与等值线，让数量关系准确显现。', tags: ['坐标变换', '曲线拟合', '等值线'], lab: 'curve',
    sections: [
      { title: '数据转换与尺度', minutes: 8, intro: '把数据域中的值，放到屏幕的范围里。', goal: '区分数据空间、视觉空间与屏幕空间。', paragraphs: ['原始数值位于数据域中，比例尺把它映射到屏幕范围。例如把 0–100 分映射到 0–500 像素，得到的是一个线性转换。', 'SVG 的 y 轴默认向下增加。为了让数值越大位置越高，通常把 y 的 range 写成 [height, 0]，并在图形外预留坐标轴边距。'], example: '数据 60 在 [0,100] → [0,500] 的线性映射中对应 300 px。改变图表宽度，只需改变 range。', takeaway: 'domain 说明数据范围，range 说明绘图范围。', code: 'const x = d3.scaleLinear()\n  .domain([0, 100]).range([0, 500]);\nconst y = d3.scaleLinear()\n  .domain([0, 100]).range([300, 0]);\nconsole.log(x(60)); // 300' },
      { title: '坐标轴变换', minutes: 9, intro: '改变坐标尺度，也会改变读者对差异的感知。', goal: '理解线性、对数与极坐标的差异。', paragraphs: ['线性轴上相同距离代表相同差值；对数轴上相同距离代表相同比例。跨多个数量级的数据可以考虑对数轴，但要清楚标注，且普通对数尺度不能表示 0 和负值。', '极坐标把角度与半径映射成平面位置，常用于周期数据。角度是否等间隔、半径是否代表数量，都需要在图例中说明。'], example: '10→100 与 100→1000 在以 10 为底的对数轴上距离相等，因为都增长了十倍。', takeaway: '坐标轴不是装饰，它定义了“距离”的含义。', code: 'const log = d3.scaleLog()\n  .domain([1, 1000]).range([0, 600]);\nconst px = r * Math.cos(theta);\nconst py = r * Math.sin(theta);' },
      { title: '曲线拟合与插值', minutes: 10, intro: '让线条连接观测，同时尊重观测。', goal: '区分线性、阶梯、平滑插值与统计拟合。', paragraphs: ['线性连接用直线连结相邻观测；阶梯线适合表示在某一时点发生跳变并保持的值；平滑插值让曲线更连续，但也可能暗示采样间隔内并不存在的变化。', '插值通常经过给定样本，统计拟合则尝试建模总体趋势。两者用途不同。部分平滑方法还可能发生过冲，因此应保留原始采样点并检查曲线形状。'], example: '银行利率的阶段调整更适合阶梯线；月度离散观测可先用折线。选择方法时先考虑数据生成机制。', takeaway: '曲线越平滑，不代表信息越真实。', code: 'const line = d3.line()\n  .x(d => x(d.month))\n  .y(d => y(d.value))\n  .curve(d3.curveMonotoneX);\n// 仍应显示原始观测点，帮助识别采样位置。' },
      { title: '倾角感知与图表比例', minutes: 8, intro: '同一组数据，可以看起来平缓，也可以看起来陡峭。', goal: '理解图表宽高比对趋势感知的影响。', paragraphs: ['在数据范围不变时，拉高绘图区会放大屏幕上的斜率，拉宽则会压低斜率。趋势看起来变化了，但原始数值没有改变。', 'Cleveland 的 banking to 45° 思路旨在改善对局部斜率变化的辨认，并不是要求所有折线都画成 45°。比较多张图时，更应保持尺度与比例的一致。'], example: '在实验室拖动“图表高度”，观察折线斜率如何变化，同时检查下方数值是否保持不变。', takeaway: '比较趋势时，要同时看坐标范围、刻度与宽高比。', code: 'const width = 640;\nconst height = 280; // 调整它，数据不变\nsvg.attr("viewBox", `0 0 ${width} ${height}`);\n// 比较多图时统一 domain 和绘图区比例。' },
      { title: '等值线与 Marching Squares', minutes: 10, intro: '把二维空间中的标量场，转换成等值边界。', goal: '理解阈值、网格单元与等值线的形成。', paragraphs: ['等值线连接数值相同的位置，常见于地形高度、温度或密度分布。等值线间距反映场值随空间变化的快慢，而不是额外的一组样本。', 'Marching Squares 在二维网格中比较四个顶点与阈值的关系，形成 16 种二值配置，再连接穿过单元边的交点；部分歧义配置需要一致的处理规则。'], example: '将阈值设为 20，算法寻找网格场中从小于 20 跨到大于 20 的位置，并拼接成边界。', takeaway: '等值线依赖采样、插值和阈值，不能脱离这些条件解读。', code: 'const contours = d3.contours()\n  .size([gridWidth, gridHeight])\n  .thresholds([10, 20, 30, 40]);\nconst geometry = contours(values);\n// values 是按行排列的网格标量值。' }
    ]
  },
  {
    id: 5, title: '时序数据可视化', en: 'Patterns through time', color: 'teal', icon: 'calendar', time: 45,
    desc: '发现趋势、周期与事件之间藏着的时间故事。', tags: ['时间属性', '日历热图', 'Storyline'], lab: 'calendar',
    sections: [
      { title: '时间属性与时间分解', minutes: 8, intro: '时间既可以线性延伸，也可以周期循环。', goal: '从时间范围、粒度、线性与周期等角度描述时序数据。', paragraphs: ['描述时序数据时，先明确观测范围、采样粒度与时间语义。一个日期可能表示一个瞬间，也可能代表整天的汇总；两者不能混用。', '将时间分解为年、月、星期或小时，有助于发现不同尺度的模式。还要留意时区、缺失日期与不等间隔采样，避免把时间间隔画错。'], example: '分析日内高峰用小时粒度；分析季节变化用月份；比较不同日期的工作日模式可按星期重新对齐。', takeaway: '先说清每个时间点代表什么，再选择时间布局。', code: '// 用明确的 UTC 日期避免时区歧义。\nconst date = new Date("2026-10-21T00:00:00Z");\nconst year = date.getUTCFullYear();\nconst month = date.getUTCMonth() + 1;\nconst weekday = date.getUTCDay();' },
      { title: '标准时间可视化', minutes: 9, intro: '折线图擅长讲述连续的变化。', goal: '按真实时间间隔排布观测，并正确处理缺失。', paragraphs: ['折线图通常用横轴表示时间，纵轴表示数量，适合读趋势、波动与局部转折。若采样不等间隔，横坐标应根据实际时间计算，而不是简单按数组下标等距排列。', '没有观测不代表数值为 0。缺失位置可以断开连接，并在说明中写明原因；把缺失补成 0 会产生虚假的谷底。'], example: '只有周一与周五的观测时，两个点相距四天。不要让它们看起来与相邻两天的观测一样近。', takeaway: '空白也是信息，缺失值需要明确表达。', code: 'const x = d3.scaleUtc()\n  .domain(d3.extent(data, d => d.date))\n  .range([0, width]);\nconst line = d3.line()\n  .defined(d => d.value != null)\n  .x(d => x(d.date)).y(d => y(d.value));' },
      { title: '日历热图', minutes: 9, intro: '把一年压缩为一张可以阅读的时间纹理。', goal: '理解日期到周列、星期行与颜色的映射。', paragraphs: ['日历热图通常把周映射到列，把星期映射到行，每个格子表示一天，颜色表达数值。它适合寻找工作日与周末差异、连续高值区间和季节模式。', '颜色不适合读取非常精确的差值。应提供图例、日期与数值提示，并明确没有数据、零值与超出筛选范围的格子分别是什么。'], example: '在实验中调高筛选阈值，观察高值是否集中在某些月份。演示数据为固定生成的合成数据，不代表真实活动。', takeaway: '日历布局强调周期结构，精确比较仍需要数值辅助。', code: 'const day = date.getUTCDay();\nconst week = Math.floor((dayIndex + startDay) / 7);\nrect.attr("x", week * cell)\n  .attr("y", day * cell)\n  .attr("fill", color(value));' },
      { title: '周期时间与螺旋布局', minutes: 9, intro: '在同一张图里，同时保留周期和时间推进。', goal: '理解阿基米德螺旋中的角度和半径。', paragraphs: ['圆形布局用角度表达周期位置，但多年的数据会重叠。螺旋布局让半径随着时间增长，把连续周期一圈圈展开。', '阿基米德螺旋可以写成 r = a + bθ。若每转一圈代表一年，同一月份会落在近似相同的方向上；跨圈比较时也要留意半径变化带来的长度差异。'], example: '把 12 个月映射为一整圈的角度，年份的推进使半径逐渐增加，可以观察同一季节在不同年份的变化。', takeaway: '周期对齐带来发现，也会带来空间编码上的取舍。', code: 'const theta = 2 * Math.PI * (t / period);\nconst r = 30 + 4 * theta;\nconst x = cx + r * Math.cos(theta);\nconst y = cy + r * Math.sin(theta);' },
      { title: 'Storyline 故事线', minutes: 10, intro: '让人物、事件与相遇关系沿时间展开。', goal: '理解故事线中的时间、实体与分组关系。', paragraphs: ['Storyline 用横轴表示时间，每条线代表一个人物或实体；人物在同一事件或场景中相遇时，线条在纵向位置上靠近。原课程以《侏罗纪公园》作为案例。', '阅读重点是相遇、分离与群组变化。线条交叉过多会增加追踪负担，因此布局通常需要减少交叉并保持角色轨迹稳定。'], example: '两个人物进入同一场景，线条靠近；离开后再次分开。纵向位置主要组织关系，不应被误读为数量高低。', takeaway: '故事线的纵向距离表达组织关系，通常不是数值量。', code: 'const path = d3.line()\n  .x(d => x(d.time))\n  .y(d => y(d.lane))\n  .curve(d3.curveCatmullRom.alpha(0.5));\n// lane 是布局分配的轨道，而不是人物的数值属性。' }
    ]
  }
];

window.VIS_QUIZ = [
  {chapter:1,q:'“专业名称”属于哪一种测量尺度？',options:['名义尺度','顺序尺度','区间尺度','比率尺度'],answer:0,why:'专业名称用于区分类别，本身没有大小和先后顺序，因此属于名义尺度。',section:2},
  {chapter:1,q:'CSV 中的空字符串表示缺失身高，最合适的处理是？',options:['直接转换为 0','标记缺失并明确过滤或处理策略','替换为最大身高','保留字符串直接求均值'],answer:1,why:'缺失值不是 0。先标记缺失，再说明过滤或填补方式，才能避免人为改变分布。',section:0},
  {chapter:1,q:'Data-Join 中，已无对应数据的图元属于哪种状态？',options:['enter','update','exit','merge'],answer:2,why:'exit 对应旧图元中没有匹配新数据的部分，通常需要移除。',section:4},
  {chapter:2,q:'将“专业人数”转换为“条形长度”，属于哪一步？',options:['数据采集','数据清洗','视觉映射','文件压缩'],answer:2,why:'视觉映射将数据属性映射为位置、长度、颜色等视觉属性。',section:0},
  {chapter:2,q:'d3.hierarchy 与 d3.tree 的分工是什么？',options:['前者构建层级节点，后者计算布局坐标','前者绘制 SVG，后者下载数据','两者都只负责颜色','两者没有区别'],answer:0,why:'hierarchy 表示层级关系，tree 根据层级结构计算坐标，最终绘制还要另行完成。',section:2},
  {chapter:2,q:'事件委托主要利用了什么机制？',options:['CSS 继承','浏览器缓存','事件冒泡','随机采样'],answer:2,why:'子节点触发的事件可以冒泡到父容器，因此父容器能统一处理动态子节点的交互。',section:3},
  {chapter:3,q:'展示相对于 0 的正负温差，优先选择什么色带？',options:['无序定性色带','以 0 为中心的发散色带','任意彩虹色带','所有值都用同色'],answer:1,why:'温差有一个有意义的中心 0，发散色带能表达中心两侧的方向与偏离程度。',section:1},
  {chapter:3,q:'哪个做法更有利于色觉友好？',options:['只用红绿区分对错','给每个点加随机颜色','同时使用颜色、形状与文字标签','完全删除图例'],answer:2,why:'冗余编码让信息不依赖单一颜色差异，也帮助灰度阅读和小尺寸阅读。',section:7},
  {chapter:3,q:'灰度预览可以用来做什么？',options:['完整模拟所有色觉缺陷','检查明暗层级是否清晰','保证任意设备颜色一致','证明配色完全无障碍'],answer:1,why:'灰度预览帮助检查明暗层级，但不能替代针对色觉缺陷的模拟与实际测试。',section:7},
  {chapter:4,q:'数据不变时，增大折线图的高度通常会怎样？',options:['原始数值增大','屏幕上折线的斜率看起来更大','采样点自动增多','均值发生变化'],answer:1,why:'改变绘图比例会改变屏幕上的斜率感知，原始数据与统计结果不变。',section:3},
  {chapter:4,q:'普通对数尺度为什么不能直接显示 0？',options:['0 的对数没有有限实数值','屏幕像素不够','SVG 不支持圆点','必须先按颜色排序'],answer:0,why:'对数尺度需要合法的定义域。0 的对数没有有限实数值，跨零数据需要选择别的尺度。',section:1},
  {chapter:4,q:'对于按时间跳变并保持不变的利率，应优先考虑？',options:['任意平滑曲线','阶梯线','饼图','随机散点'],answer:1,why:'阶梯线能表达数值在调整时点跳变、在其余时段保持不变的语义。',section:2},
  {chapter:5,q:'时序数据中没有观测的日期，应当怎样表达？',options:['一律补成 0','不加说明地连过去','明确标记缺失或断开线条','换成最大值'],answer:2,why:'缺失与零值不同，明确表达缺失可以避免制造不存在的谷底或连续变化。',section:1},
  {chapter:5,q:'标准日历热图中，每个小格通常代表什么？',options:['一个类别','一天','一个任意编号','一种配色'],answer:1,why:'日历热图把一天映射为一个格子，用位置表现日期，用颜色表现当日数量。',section:2},
  {chapter:5,q:'Storyline 中的纵向位置通常表示什么？',options:['人物身高','事件金额','人物之间的组织或场景关系','气温高低'],answer:2,why:'纵向位置用于组织人物轨道与相遇关系，通常不是可以直接比较的数值量。',section:4}
];

window.VIS_RESOURCES = [
  {name:'原课程 · 讲解、代码与演示',desc:'老师提供的五章完整课程内容与案例。',type:'课程资料',url:'https://cinger007.github.io/vis/'},
  {name:'原课程 GitHub 仓库',desc:'原始教学网站的页面、示例与数据文件。',type:'课程资料',url:'https://github.com/cinger007/vis'},
  {name:'D3 官方文档',desc:'比例尺、数据变换、布局与 SVG 形状的 API 参考。',type:'开发文档',url:'https://d3js.org/'},
  {name:'MDN · SVG 入门',desc:'理解 SVG 坐标系统、形状、文本与路径。',type:'开发文档',url:'https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial'},
  {name:'ColorBrewer',desc:'根据定性、顺序和发散数据语义选择配色。',type:'配色工具',url:'https://colorbrewer2.org/'},
  {name:'Observable · D3 示例',desc:'浏览可视化实例，学习从数据到图形的实现过程。',type:'案例灵感',url:'https://observablehq.com/@d3/gallery'}
];

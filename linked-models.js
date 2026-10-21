/* Pure lesson computations. The exact functions below are also displayed in the code pane. */
(function (root) {
  "use strict";
  function cleanData(p) {
    /*@0*/ const raw = ["168", "175", "", "182", "abc", "160", "171", "177"];
    const numbers = raw.map((v) => (v.trim() === "" ? null : Number(v)));
    /*@1*/ const rows = numbers.map((v, i) => ({
      id: i,
      value: v,
      valid: Number.isFinite(v) && v !== null,
    }));
    const visible = rows.filter(
      (d) => (!p.clean || d.valid) && (!d.valid || d.value >= p.minimum),
    );
    /*@2*/ const marks = visible.flatMap((d, i) => [
      {
        tag: "rect",
        group: 2,
        attrs: {
          x: 55,
          y: 35 + i * 28,
          width: d.valid ? (d.value - 140) * 6 : 6,
          height: 16,
          fill: d.valid ? "#4e9380" : "#c9b8a3",
        },
        tip: `记录 ${d.id + 1}：${d.valid ? d.value : "缺失 / 非法"}`,
      },
      {
        tag: "text",
        group: 0,
        attrs: { x: 10, y: 47 + i * 28 },
        text: `${d.id + 1}. ${raw[d.id] || "空值"}`,
      },
      {
        tag: "text",
        group: 1,
        attrs: { x: 340, y: 47 + i * 28 },
        text: d.valid ? String(d.value) : "无效",
      },
    ]);
    return {
      marks,
      height: 290,
      summary: `显示 ${visible.length} / ${rows.length} 条；有效身高 ${visible.filter((d) => d.valid).length} 条。横轴以 140 cm 为参照，展示有效值差异。`,
      table: [
        ["原值", "转换结果", "是否合法"],
        ...rows.map((d) => [
          raw[d.id] || "空字符串",
          String(d.value),
          d.valid ? "是" : "否",
        ]),
      ],
    };
  }
  function dikw(p) {
    /*@0*/ const levels = ["数据", "信息", "知识", "智慧"];
    const examples = [
      "172",
      "某位新生身高为 172 cm",
      "比较样本分布，识别集中趋势",
      "结合人群与目的作出判断",
    ];
    /*@1*/ const chosen = Number(p.level);
    const context = p.context
      ? examples[chosen]
      : "缺少单位、人群与来源，难以解释数值";
    /*@2*/ const marks = levels.map((name, i) => ({
      tag: "polygon",
      group: i === chosen ? 1 : 2,
      attrs: {
        points: `${35 + i * 43},${254 - i * 54} ${425 - i * 43},${254 - i * 54} ${382 - i * 43},${207 - i * 54} ${78 + i * 43},${207 - i * 54}`,
        fill:
          i === chosen ? "#488e79" : ["#dbe8df", "#b9d2bf", "#8db59a", "#739b80"][i],
      },
    }));
    levels.forEach((name, i) =>
      marks.push({
        tag: "text",
        group: 0,
        attrs: {
          x: 230,
          y: 235 - i * 54,
          "text-anchor": "middle",
          fill: i === chosen ? "#fff" : "#365d4d",
        },
        text: name,
      }),
    );
    return {
      marks,
      height: 290,
      summary: `${levels[chosen]}：${context}`,
      table: [["层次", "示例"], ...levels.map((name, i) => [name, examples[i]])],
    };
  }
  function attributes(p) {
    /*@0*/ const data = [
      { name: "计算机", value: 72 },
      { name: "地理", value: 45 },
      { name: "数学", value: 61 },
      { name: "环境", value: 38 },
    ];
    const colors = {
      计算机: "#4d907e",
      地理: "#739bb7",
      数学: "#b6a06e",
      环境: "#a28dad",
    };
    /*@1*/ const marks = data.flatMap((d, i) => [
      {
        tag: p.channel === "length" ? "rect" : "circle",
        group: 1,
        attrs:
          p.channel === "length"
            ? {
                x: 65,
                y: 40 + i * 48,
                width: d.value * 3.7,
                height: 25,
                fill: p.color ? colors[d.name] : "#708e84",
              }
            : {
                cx: 65 + d.value * 3.7,
                cy: 52 + i * 48,
                r: 9,
                fill: p.color ? colors[d.name] : "#708e84",
              },
        tip: `${d.name}：${d.value} 人`,
      },
      { tag: "text", group: 0, attrs: { x: 8, y: 57 + i * 48 }, text: d.name },
      {
        tag: "text",
        group: 2,
        attrs: { x: 78 + d.value * 3.7, y: 57 + i * 48 },
        text: `${d.value} 人`,
      },
    ]);
    /*@2*/ marks.push({
      tag: "line",
      group: 2,
      attrs: { x1: 65, y1: 27, x2: 65, y2: 228, stroke: "#9eafa3" },
    });
    return {
      marks,
      height: 270,
      summary: `${p.channel === "length" ? "长度" : "位置"}表示人数；${p.color ? "色相区分专业类别。" : "关闭类别颜色，文字标签仍保留。"}`,
      table: [["专业", "人数"], ...data.map((d) => [d.name, d.value])],
    };
  }
  function transformData(p) {
    /*@0*/ const raw = [
      ["计算机", 168],
      ["地理", 175],
      ["计算机", 182],
      ["数学", 160],
      ["地理", 171],
      ["数学", 177],
      ["计算机", 165],
      ["环境", 173],
    ];
    const filtered = raw.filter((d) => d[1] >= p.minimum);
    /*@1*/ const groups = {};
    for (const [major, height] of filtered) (groups[major] ??= []).push(height);
    const summary = Object.entries(groups).map(([major, values]) => ({
      major,
      value:
        p.stat === "count"
          ? values.length
          : values.reduce((a, b) => a + b, 0) / values.length,
    }));
    /*@2*/ const max = Math.max(1, ...summary.map((d) => d.value));
    const marks = summary.flatMap((d, i) => [
      {
        tag: "rect",
        group: 2,
        attrs: {
          x: 70,
          y: 45 + i * 43,
          width: (d.value / max) * 280,
          height: 24,
          fill: "#619c83",
        },
        tip: `${d.major}：${d.value.toFixed(1)}`,
      },
      { tag: "text", group: 1, attrs: { x: 8, y: 61 + i * 43 }, text: d.major },
      {
        tag: "text",
        group: 2,
        attrs: { x: 82 + (d.value / max) * 280, y: 61 + i * 43 },
        text: d.value.toFixed(p.stat === "count" ? 0 : 1),
      },
    ]);
    marks.push({
      tag: "text",
      group: 0,
      attrs: { x: 70, y: 24 },
      text: `筛选后 ${filtered.length} 条记录`,
    });
    return {
      marks,
      height: 260,
      summary: `筛选身高 ≥ ${p.minimum} cm，按专业聚合${p.stat === "count" ? "人数" : "平均身高"}。`,
      table: [["专业", "身高 cm"], ...filtered],
    };
  }
  function dataJoin(p) {
    /*@0*/ const old = ["A", "B", "C"];
    const next = [
      ...(p.keepA ? ["A"] : []),
      "B",
      "C",
      ...["D", "E", "F"].slice(0, p.add),
    ];
    /*@0*/ const enter = next.filter((id) => !old.includes(id));
    /*@1*/ const update = next.filter((id) => old.includes(id));
    /*@2*/ const exit = old.filter((id) => !next.includes(id));
    const groups = [
      ["enter", enter, "#98c5a4", 0],
      ["update", update, "#8daec7", 1],
      ["exit", exit, "#d6ac90", 2],
    ];
    const marks = groups.flatMap(([name, items, fill, group], row) => [
      { tag: "text", group, attrs: { x: 14, y: 54 + row * 75 }, text: name },
      ...items.flatMap((id, col) => [
        {
          tag: "rect",
          group,
          attrs: {
            x: 105 + col * 54,
            y: 32 + row * 75,
            width: 40,
            height: 37,
            rx: 6,
            fill,
          },
          tip: `${name}: ${id}`,
        },
        {
          tag: "text",
          group,
          attrs: { x: 125 + col * 54, y: 56 + row * 75, "text-anchor": "middle" },
          text: id,
        },
      ]),
    ]);
    return {
      marks,
      height: 280,
      summary: `旧数据 ${old.join(", ")} → 新数据 ${next.join(", ")}；稳定 id 保持元素身份。`,
      table: [
        ["状态", "id"],
        ["enter", enter.join(", ") || "无"],
        ["update", update.join(", ") || "无"],
        ["exit", exit.join(", ") || "无"],
      ],
    };
  }
  function pipeline(p) {
    /*@0*/ const raw = [
      ["计算机", 86],
      ["地理", 62],
      ["数学", 74],
      ["环境", 48],
    ];
    const selected = raw.filter((d) => d[1] >= p.minimum);
    /*@1*/ const total = selected.reduce((sum, d) => sum + d[1], 0);
    const mapped = selected.map(([name, value]) => ({
      name,
      value,
      width: (value / 100) * 250,
    }));
    /*@2*/ const marks = mapped.flatMap((d, i) => [
      {
        tag: "rect",
        group: 2,
        attrs: {
          x: 95,
          y: 40 + i * 43,
          width: d.width * p.scale,
          height: 24,
          fill: "#699c86",
        },
        tip: `${d.name}：${d.value}`,
      },
      { tag: "text", group: 1, attrs: { x: 12, y: 57 + i * 43 }, text: d.name },
      {
        tag: "text",
        group: 0,
        attrs: { x: 107 + d.width * p.scale, y: 57 + i * 43 },
        text: String(d.value),
      },
    ]);
    return {
      marks,
      height: 260,
      summary: `原始 4 组 → 筛选 ${selected.length} 组 → 总计 ${total} 人 → 视图缩放 ${p.scale.toFixed(1)} 倍。`,
      table: [
        ["阶段", "结果"],
        ["数据变换", `${selected.length} 个专业`],
        ["视觉映射", "人数 → 条形长度"],
        ["视图变换", `${p.scale.toFixed(1)} 倍`],
      ],
    };
  }
  function hierarchy(p) {
    /*@0*/ const rows = [
      ["信息", "计算机", 32],
      ["信息", "地理", 21],
      ["理学", "数学", 28],
      ["理学", "环境", 19],
    ];
    const groups = {};
    for (const [college, major, count] of rows)
      (groups[college] ??= []).push({ major, count });
    /*@1*/ const tree = Object.entries(groups).map(([name, children]) => ({
      name,
      children,
      total: children.reduce((n, d) => n + d.count, 0),
    }));
    /*@2*/ const marks = [
      {
        tag: "text",
        group: 0,
        attrs: { x: 18, y: 278 },
        text: "明细：4 个专业，共 100 人",
      },
      {
        tag: "circle",
        group: 2,
        attrs: { cx: 45, cy: 145, r: 12, fill: "#508b78" },
        tip: "全部 100 人",
      },
    ];
    tree.forEach((branch, i) => {
      const y = 78 + i * 134,
        x = 45 + p.spacing;
      marks.push(
        {
          tag: "line",
          group: 2,
          attrs: { x1: 57, y1: 145, x2: x - 10, y2: y, stroke: "#a4bcb1" },
        },
        {
          tag: "circle",
          group: 1,
          attrs: { cx: x, cy: y, r: 10, fill: "#94b9a2" },
          tip: `${branch.name}：${branch.total} 人`,
        },
        {
          tag: "text",
          group: 1,
          attrs: { x: x - 18, y: y - 18 },
          text: `${branch.name} ${branch.total}`,
        },
      );
      if (!p.collapsed)
        branch.children.forEach((leaf, j) => {
          const ly = y - 27 + j * 54,
            lx = x + p.spacing;
          marks.push(
            {
              tag: "line",
              group: 2,
              attrs: { x1: x + 10, y1: y, x2: lx - 8, y2: ly, stroke: "#c0d1c5" },
            },
            {
              tag: "circle",
              group: 0,
              attrs: { cx: lx, cy: ly, r: 8, fill: "#b4c9a8" },
              tip: `${leaf.major}：${leaf.count} 人`,
            },
            {
              tag: "text",
              group: 0,
              attrs: { x: lx + 14, y: ly + 4 },
              text: `${leaf.major} ${leaf.count}`,
            },
          );
        });
    });
    return {
      marks,
      height: 290,
      summary: `学院 → 专业两级分类；层间距 ${p.spacing}px；${p.collapsed ? "收起专业节点" : "展开全部专业"}。`,
      table: [["学院", "专业", "人数"], ...rows],
    };
  }
  function eventPath(p) {
    /*@0*/ const nodes = ["课程列表", "信息学院", "计算机专业"];
    const target = Number(p.target);
    /*@1*/ const path = nodes.slice(0, target + 1);
    const order = p.phase === "capture" ? path : [...path].reverse();
    /*@2*/ const marks = nodes.flatMap((name, i) => [
      {
        tag: "rect",
        group: i === target ? 0 : 1,
        attrs: {
          x: 35 + i * 35,
          y: 30 + i * 43,
          width: 360 - i * 70,
          height: 200 - i * 70,
          rx: 8,
          fill: ["#eef4ed", "#d4e4d4", "#a8c9af"][i],
          stroke: i === target ? "#4f8465" : "#b6cbbb",
        },
        choose: { id: "target", value: i },
        tip: `点击 ${name}`,
      },
      {
        tag: "text",
        group: 2,
        attrs: { x: 50 + i * 35, y: 53 + i * 43 },
        text: name,
      },
    ]);
    return {
      marks,
      height: 275,
      summary: `点击目标：${nodes[target]}；${p.phase === "capture" ? "捕获" : "冒泡"}路径：${order.join(" → ")}。图中可点击切换目标。`,
      table: [["顺序", "节点"], ...order.map((name, i) => [i + 1, name])],
    };
  }
  function colorSpace(p) {
    /*@0*/ const hue = p.hue,
      saturation = p.saturation;
    /*@1*/ const palette = Array.from({ length: 7 }, (_, i) => ({
      light: 20 + i * 10,
      color: `hsl(${hue}, ${saturation}%, ${20 + i * 10}%)`,
    }));
    /*@2*/ const marks = palette.flatMap((d, i) => [
      {
        tag: "rect",
        group: 1,
        attrs: {
          x: 25 + i * 59,
          y: 65,
          width: 51,
          height: 100,
          rx: 7,
          fill: d.color,
        },
        tip: d.color,
      },
      {
        tag: "text",
        group: 0,
        attrs: { x: 50 + i * 59, y: 190, "text-anchor": "middle" },
        text: `L ${d.light}%`,
      },
      {
        tag: "circle",
        group: 2,
        attrs: { cx: 50 + i * 59, cy: 222, r: 8, fill: d.color },
      },
    ]);
    return {
      marks,
      height: 270,
      summary: `H=${hue}°，S=${saturation}%；HSL 的 L 相同不保证跨色相的感知亮度相同。`,
      table: [["明度", "CSS 颜色"], ...palette.map((d) => [d.light + "%", d.color])],
    };
  }
  function colorMap(p) {
    /*@0*/ const values =
      p.type === "diverging"
        ? [-40, -25, -10, -2, 2, 10, 25, 40]
        : [10, 22, 34, 46, 58, 70, 82, 94];
    const green = [
      "#edf3df",
      "#dde8c8",
      "#c9dcad",
      "#b0ca8b",
      "#98b571",
      "#7c9d58",
      "#628347",
      "#426537",
    ];
    const blue = [
      "#edf3f7",
      "#d6e5f0",
      "#bbd3e6",
      "#94b9d5",
      "#6a9bbb",
      "#4d7f9e",
      "#36637e",
      "#244c65",
    ];
    /*@1*/ const categorical = [
      "#397e68",
      "#6793b6",
      "#c49d59",
      "#9b88ae",
      "#c28373",
      "#86aa78",
      "#818fa8",
      "#b5ac70",
    ];
    const diverging = [
      "#326987",
      "#5e95b0",
      "#a6c9d6",
      "#e0edf0",
      "#f3ebd4",
      "#e0c58e",
      "#c29152",
      "#985b35",
    ];
    const colors =
      p.type === "categorical"
        ? categorical
        : p.type === "diverging"
          ? diverging
          : p.type === "rainbow"
            ? values.map((_, i) => `hsl(${240 - (i * 240) / 7},80%,50%)`)
            : p.palette === "blue"
              ? blue
              : green;
    /*@2*/ const marks = colors.flatMap((fill, i) => [
      {
        tag: "rect",
        group: 1,
        attrs: { x: 18 + i * 54, y: 30, width: 49, height: 70, rx: 4, fill },
        tip: `${p.type === "categorical" ? String.fromCharCode(65 + i) : values[i]} → ${fill}`,
      },
      {
        tag: "text",
        group: 0,
        attrs: { x: 42 + i * 54, y: 122, "text-anchor": "middle" },
        text:
          p.type === "categorical" ? String.fromCharCode(65 + i) : String(values[i]),
      },
      {
        tag: "rect",
        group: 2,
        attrs: {
          x: 26 + i * 54,
          y: 225 - Math.abs(values[i]) * 1.1,
          width: 31,
          height: Math.abs(values[i]) * 1.1,
          rx: 3,
          fill,
        },
      },
    ]);
    return {
      marks,
      height: 260,
      summary: `${{ categorical: "定性：无序类别", sequential: "顺序：从低到高", diverging: "发散：偏离零点", rainbow: "彩虹错误示例：感知明度并不单调" }[p.type]}；图例数值和色块一一对应。`,
      table: [
        ["标签", "值", "颜色"],
        ...values.map((v, i) => [
          p.type === "categorical" ? String.fromCharCode(65 + i) : i + 1,
          v,
          colors[i],
        ]),
      ],
    };
  }
  function labSlice(p) {
    /*@0*/ const L = p.lightness;
    /*@1*/ function convert(a, b) {
      const fy = (L + 16) / 116,
        fx = fy + a / 500,
        fz = fy - b / 200,
        inv = (t) => (t > 6 / 29 ? t ** 3 : 3 * (6 / 29) ** 2 * (t - 4 / 29));
      const x = 0.95047 * inv(fx),
        y = inv(fy),
        z = 1.08883 * inv(fz);
      const linear = [
        3.2404542 * x - 1.5371385 * y - 0.4985314 * z,
        -0.969266 * x + 1.8760108 * y + 0.041556 * z,
        0.0556434 * x - 0.2040259 * y + 1.0572252 * z,
      ];
      /*@2*/ const inside = linear.every((v) => v >= 0 && v <= 1);
      /*@1*/ const rgb = linear.map((v) =>
        Math.round(
          255 *
            Math.max(
              0,
              Math.min(
                1,
                v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055,
              ),
            ),
        ),
      );
      return { inside, color: `rgb(${rgb.join(",")})` };
    }
    /*@1*/ const cells = [];
    for (let row = 0; row < 9; row++)
      for (let col = 0; col < 9; col++) {
        const a = (col - 4) * 20,
          b = (4 - row) * 20;
        cells.push({ a, b, ...convert(a, b), x: 78 + col * 30, y: 20 + row * 26 });
      }
    /*@2*/ const marks = cells.map((d) => ({
      tag: "rect",
      group: d.inside ? 1 : 2,
      attrs: {
        x: d.x,
        y: d.y,
        width: 27,
        height: 23,
        rx: 2,
        fill: p.gamut && !d.inside ? "#eef0eb" : d.color,
        stroke: !d.inside ? "#d0d7cc" : "none",
      },
      tip: `L*=${L}, a*=${d.a}, b*=${d.b}；${d.inside ? "在 sRGB 内" : "超出 sRGB，显示为裁切颜色"}`,
    }));
    marks.push(
      { tag: "text", group: 0, attrs: { x: 14, y: 35 }, text: `L* ${L}` },
      {
        tag: "text",
        group: 1,
        attrs: { x: 205, y: 275, "text-anchor": "middle" },
        text: "a* −80 → 80；纵向 b* 80 → −80",
      },
    );
    return {
      marks,
      height: 300,
      summary: `D65 参考白的 Lab 切片；${cells.filter((d) => d.inside).length} / 81 个采样色在 sRGB 内。${p.gamut ? "灰格为色域外采样。" : "色域外颜色经过 RGB 通道裁切。"}`,
      table: [
        ["L*", "a*", "b*", "sRGB 内"],
        ...cells
          .filter((_, i) => i % 9 === 4)
          .map((d) => [L, d.a, d.b, d.inside ? "是" : "否"]),
      ],
    };
  }
  function harmony(p) {
    /*@0*/ const rules = {
      mono: [0, 0, 0],
      analogous: [-30, 0, 30],
      complementary: [0, 180],
      split: [0, 150, 210],
      triadic: [0, 120, 240],
    };
    const offsets = rules[p.scheme];
    /*@1*/ const colors = offsets.map((offset, i) => ({
      hue: (p.hue + offset + 360) % 360,
      light: p.scheme === "mono" ? 30 + i * 20 : 48,
    }));
    /*@2*/ const marks = colors.flatMap((d, i) => {
      const angle = (d.hue * Math.PI) / 180,
        radius = p.scheme === "mono" ? 20 + i * 35 : 90,
        x = 225 + radius * Math.cos(angle),
        y = 135 + radius * Math.sin(angle);
      return [
        {
          tag: "line",
          group: 0,
          attrs: { x1: 225, y1: 135, x2: x, y2: y, stroke: "#ced9d0" },
        },
        {
          tag: "circle",
          group: 1,
          attrs: { cx: x, cy: y, r: 27, fill: `hsl(${d.hue},55%,${d.light}%)` },
          tip: `H=${d.hue}° L=${d.light}%`,
        },
        {
          tag: "text",
          group: 2,
          attrs: { x: 26 + i * 90, y: 276 },
          text: `${d.hue}°`,
        },
      ];
    });
    marks.unshift({
      tag: "circle",
      group: 2,
      attrs: {
        cx: 225,
        cy: 135,
        r: 90,
        fill: "none",
        stroke: "#d4dfd4",
        "stroke-dasharray": "3 5",
      },
    });
    return {
      marks,
      height: 300,
      summary: `基准色相 ${p.hue}°；在色相环上按规则选择 ${colors.length} 个颜色。`,
      table: [["色相角", "明度"], ...colors.map((d) => [d.hue + "°", d.light + "%"])],
    };
  }
  function researchPalette(p) {
    /*@0*/ const names = ["A", "B", "C", "D", "E", "F"];
    const palettes = {
      okabe: ["#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00"],
      tol: ["#4477AA", "#EE6677", "#228833", "#CCBB44", "#66CCEE", "#AA3377"],
      muted: ["#397e68", "#6793b6", "#c49d59", "#9b88ae", "#c28373", "#86aa78"],
    };
    /*@1*/ const colors = palettes[p.palette];
    /*@2*/ const marks = names.flatMap((name, i) => [
      {
        tag: "rect",
        group: 1,
        attrs: {
          x: 27 + i * 69,
          y: 45,
          width: 53,
          height: 120,
          rx: 6,
          fill: colors[i],
        },
        tip: `类别 ${name}：${colors[i]}`,
      },
      {
        tag: "text",
        group: 0,
        attrs: { x: 53 + i * 69, y: 191, "text-anchor": "middle" },
        text: name,
      },
      {
        tag: "text",
        group: 2,
        attrs: { x: 53 + i * 69, y: 224, "text-anchor": "middle", "font-size": 10 },
        text: p.labels ? colors[i] : "",
      },
    ]);
    return {
      marks,
      height: 270,
      summary: `${p.palette === "okabe" ? "Okabe–Ito" : p.palette === "tol" ? "Paul Tol bright" : "低饱和教学配色"}：颜色用于区分类别，不表示数量大小。`,
      table: [["类别", "色值"], ...names.map((n, i) => [n, colors[i]])],
    };
  }
  function emphasis(p) {
    /*@0*/ const values = [42, 68, 57, 81, 63, 49];
    const context = `hsl(${p.hue},18%,74%)`;
    /*@1*/ const focus = `hsl(${p.hue},${p.saturation}%,40%)`;
    /*@2*/ const marks = values.flatMap((value, i) => [
      {
        tag: "rect",
        group: i === p.focus ? 1 : 0,
        attrs: {
          x: 33 + i * 68,
          y: 218 - value * 1.8,
          width: 41,
          height: value * 1.8,
          rx: 4,
          fill: i === p.focus ? focus : context,
        },
        choose: { id: "focus", value: i },
        tip: `类别 ${i + 1}：${value}`,
      },
      {
        tag: "text",
        group: 2,
        attrs: { x: 53 + i * 68, y: 244, "text-anchor": "middle" },
        text: `组${i + 1}`,
      },
    ]);
    return {
      marks,
      height: 275,
      summary: `第 ${p.focus + 1} 组为焦点，饱和度 ${p.saturation}%；点击条形可以更换焦点。`,
      table: [
        ["类别", "数值", "角色"],
        ...values.map((v, i) => [i + 1, v, i === p.focus ? "焦点" : "上下文"]),
      ],
    };
  }
  function redundant(p) {
    /*@0*/ const series = [
        [34, 52, 47, 65, 58],
        [51, 42, 62, 50, 73],
        [25, 36, 31, 48, 42],
      ],
      names = ["系列 A", "系列 B", "系列 C"];
    /*@1*/ const colors = p.gray
      ? ["#6d6d6d", "#9b9b9b", "#777777"]
      : ["#397e68", "#6793b6", "#c49d59"];
    /*@1*/ const paths = series.map((values) =>
      values
        .map((v, i) => `${i ? "L" : "M"}${50 + i * 77},${230 - v * 2.2}`)
        .join(" "),
    );
    /*@2*/ const marks = paths.flatMap((d, i) => [
      {
        tag: "path",
        group: 1,
        attrs: {
          d,
          fill: "none",
          stroke: colors[i],
          "stroke-width": 3,
          "stroke-dasharray": p.redundant ? ["none", "7 4", "2 4"][i] : "none",
        },
        tip: names[i],
      },
      {
        tag: i === 1 && p.redundant ? "rect" : "circle",
        group: 2,
        attrs:
          i === 1 && p.redundant
            ? {
                x: 353,
                y: 226 - series[i][4] * 2.2,
                width: 9,
                height: 9,
                fill: colors[i],
              }
            : {
                cx: 358,
                cy: 230 - series[i][4] * 2.2,
                r: p.redundant ? 6 : 4,
                fill: colors[i],
              },
      },
      {
        tag: "text",
        group: 0,
        attrs: { x: 50, y: 260 + i * 16, fill: colors[i] },
        text: p.redundant ? `${names[i]} · ${["实线", "虚线", "点线"][i]}` : "",
      },
    ]);
    return {
      marks,
      height: 320,
      summary: `${p.gray ? "灰度预览只检查明暗，不是色觉缺陷模拟。" : "用颜色区分三个系列。"}${p.redundant ? "同时保留线型、端点和文字线索。" : "关闭冗余编码后，识别更依赖颜色。"}`,
      table: [["系列", "观测值"], ...series.map((v, i) => [names[i], v.join(", ")])],
    };
  }
  function coordinates(p) {
    /*@0*/ const values = p.scale === "log" ? [1, 10, 100, 1000] : [20, 40, 60, 80];
    const domain = p.scale === "log" ? [1, 1000] : [0, 100];
    /*@1*/ const map = (v) =>
      p.scale === "log"
        ? (Math.log10(v) - Math.log10(domain[0])) /
          (Math.log10(domain[1]) - Math.log10(domain[0]))
        : v / 100;
    const points = values.map((v, i) => ({
      value: v,
      x: 55 + map(v) * p.width,
      /*@2*/ y: p.invert ? 220 - map(v) * 160 : 60 + map(v) * 160,
    }));
    /*@2*/ const marks = [
      {
        tag: "line",
        group: 0,
        attrs: { x1: 55, y1: 220, x2: 55 + p.width, y2: 220, stroke: "#9fb4a5" },
      },
      {
        tag: "line",
        group: 2,
        attrs: { x1: 55, y1: 45, x2: 55, y2: 220, stroke: "#9fb4a5" },
      },
      ...points.flatMap((d) => [
        {
          tag: "circle",
          group: 1,
          attrs: { cx: d.x, cy: d.y, r: 7, fill: "#558c74" },
          tip: `数据 ${d.value} → (${d.x.toFixed(1)}, ${d.y.toFixed(1)}) px`,
        },
        {
          tag: "text",
          group: 0,
          attrs: { x: d.x, y: 245, "text-anchor": "middle" },
          text: String(d.value),
        },
      ]),
    ];
    return {
      marks,
      width: Math.max(460, p.width + 95),
      height: 285,
      summary: `${p.scale === "log" ? "对数轴：相同比例对应相同距离" : "线性轴：相同差值对应相同距离"}；绘图区宽 ${p.width}px；Y 轴${p.invert ? "向上增大" : "向下增大"}。`,
      table: [
        ["数据值", "屏幕 x", "屏幕 y"],
        ...points.map((d) => [d.value, d.x.toFixed(1), d.y.toFixed(1)]),
      ],
    };
  }
  function curves(p) {
    /*@0*/ const values = [25, 48, p.middle, 73, 56, 87];
    /*@2*/ const points = values.map((v, i) => [
      45 + i * 72,
      p.height + 20 - (v / 100) * p.height,
    ]);
    /*@1*/ let path = `M${points[0].join(",")}`;
    if (p.curve === "linear")
      path = points.map((v, i) => (i ? "L" : "M") + v.join(",")).join(" ");
    if (p.curve === "step")
      for (let i = 1; i < points.length; i++)
        path += `H${points[i][0]}V${points[i][1]}`;
    if (p.curve === "smooth") {
      const slopes = points.slice(1).map((v, i) => (v[1] - points[i][1]) / 72),
        tangents = points.map((_, i) =>
          i === 0
            ? slopes[0]
            : i === points.length - 1
              ? slopes.at(-1)
              : slopes[i - 1] * slopes[i] <= 0
                ? 0
                : (slopes[i - 1] + slopes[i]) / 2,
        );
      for (let i = 0; i < slopes.length; i++) {
        if (slopes[i] === 0) {
          tangents[i] = tangents[i + 1] = 0;
          continue;
        }
        const a = tangents[i] / slopes[i],
          b = tangents[i + 1] / slopes[i],
          norm = a * a + b * b;
        if (norm > 9) {
          const t = 3 / Math.sqrt(norm);
          tangents[i] = t * a * slopes[i];
          tangents[i + 1] = t * b * slopes[i];
        }
      }
      for (let i = 0; i < points.length - 1; i++)
        path += `C${points[i][0] + 24},${points[i][1] + tangents[i] * 24} ${points[i + 1][0] - 24},${points[i + 1][1] - tangents[i + 1] * 24} ${points[i + 1]}`;
    }
    /*@2*/ const marks = [
      {
        tag: "line",
        group: 2,
        attrs: {
          x1: 45,
          y1: p.height + 20,
          x2: 405,
          y2: p.height + 20,
          stroke: "#acbdab",
        },
      },
      {
        tag: "path",
        group: 1,
        attrs: { d: path, fill: "none", stroke: "#5d9177", "stroke-width": 3 },
      },
      ...points.flatMap(([x, y], i) => [
        {
          tag: "circle",
          group: 0,
          attrs: {
            cx: x,
            cy: y,
            r: i === 2 ? 7 : 4,
            fill: i === 2 ? "#d99b6c" : "#fff",
            stroke: "#658b6a",
            "stroke-width": 2,
          },
          tip: `样本 ${i + 1}：${values[i]}`,
        },
        {
          tag: "text",
          group: 2,
          attrs: { x, y: p.height + 45, "text-anchor": "middle" },
          text: String(i + 1),
        },
      ]),
    ];
    return {
      marks,
      height: p.height + 75,
      summary: `6 个样本；连接方式：${{ linear: "线性", step: "后阶梯", smooth: "单调三次插值" }[p.curve]}；高度 ${p.height}px。首尾数值差始终为 ${values.at(-1) - values[0]}。`,
      table: [["样本", "数值"], ...values.map((v, i) => [i + 1, v])],
    };
  }
  function contours(p) {
    /*@0*/ const cols = 9,
      rows = 7,
      cell = 39;
    const field = Array.from({ length: rows }, (_, y) =>
      Array.from(
        { length: cols },
        (_, x) => 100 * Math.exp(-((x - 4) ** 2 + (y - 3) ** 2) / 7),
      ),
    );
    const marks = [
      {
        tag: "text",
        group: 1,
        attrs: { x: 410, y: 30, "font-size": 10 },
        text: `T ${p.threshold}`,
      },
    ];
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++)
        marks.push({
          tag: "rect",
          group: 0,
          attrs: {
            x: 55 + x * cell - cell / 2,
            y: 30 + y * cell - cell / 2,
            width: cell - 2,
            height: cell - 2,
            fill: `hsl(150,30%,${95 - field[y][x] * 0.48}%)`,
          },
          tip: `网格 (${x},${y})：${field[y][x].toFixed(1)}`,
        });
    /*@1*/ const lookup = {
      1: [[3, 0]],
      2: [[0, 1]],
      3: [[3, 1]],
      4: [[1, 2]],
      5: [
        [3, 0],
        [1, 2],
      ],
      6: [[0, 2]],
      7: [[3, 2]],
      8: [[2, 3]],
      9: [[0, 2]],
      10: [
        [0, 1],
        [2, 3],
      ],
      11: [[1, 2]],
      12: [[1, 3]],
      13: [[0, 1]],
      14: [[0, 3]],
    };
    let segments = 0;
    for (let y = 0; y < rows - 1; y++)
      for (let x = 0; x < cols - 1; x++) {
        const v = [
            field[y][x],
            field[y][x + 1],
            field[y + 1][x + 1],
            field[y + 1][x],
          ],
          mask = v.reduce((m, n, i) => m + (n >= p.threshold ? 1 << i : 0), 0),
          corners = [
            [x, y],
            [x + 1, y],
            [x + 1, y + 1],
            [x, y + 1],
          ];
        const edge = (e) => {
          const next = (e + 1) % 4,
            t = (p.threshold - v[e]) / (v[next] - v[e]);
          return [
            55 + (corners[e][0] + t * (corners[next][0] - corners[e][0])) * cell,
            30 + (corners[e][1] + t * (corners[next][1] - corners[e][1])) * cell,
          ];
        };
        /*@2*/ for (const [a, b] of lookup[mask] || []) {
          const pa = edge(a),
            pb = edge(b);
          marks.push({
            tag: "line",
            group: 2,
            attrs: {
              x1: pa[0],
              y1: pa[1],
              x2: pb[0],
              y2: pb[1],
              stroke: "#cd8e59",
              "stroke-width": 3,
            },
          });
          if (p.intersections)
            for (const point of [pa, pb])
              marks.push({
                tag: "circle",
                group: 1,
                attrs: { cx: point[0], cy: point[1], r: 3, fill: "#f5d99f" },
              });
          segments++;
        }
      }
    return {
      marks,
      height: 310,
      summary: `阈值 ${p.threshold}，生成 ${segments} 段等值边界；格子中采用线性插值。该径向示例不包含歧义单元。`,
      table: [
        ["阈值", "边界段数"],
        [p.threshold, segments],
      ],
    };
  }
  function timeAggregation(p) {
    /*@0*/ const data = Array.from({ length: 90 }, (_, i) => ({
      date: new Date(Date.UTC(2026, 0, 1 + i)),
      value: Math.round(35 + 18 * Math.sin(i * 0.2) + i * 0.3),
    }));
    /*@1*/ const groups = {};
    for (const d of data) {
      const key =
        p.grain === "month"
          ? d.date.toISOString().slice(0, 7)
          : p.grain === "week"
            ? `7天块 ${Math.floor((d.date - Date.UTC(2026, 0, 1)) / 86400000 / 7) + 1}`
            : d.date.toISOString().slice(5, 10);
      const bucket = (groups[key] ??= { values: [], start: d.date, end: d.date });
      bucket.values.push(d.value);
      bucket.end = d.date;
    }
    const points = Object.entries(groups).map(([label, bucket]) => ({
      label,
      time: (+bucket.start + +bucket.end) / 2,
      value: bucket.values.reduce((a, b) => a + b, 0) / bucket.values.length,
    }));
    /*@2*/ const coords = points.map((d, i) => ({
      x: 45 + ((d.time - +data[0].date) / (+data.at(-1).date - +data[0].date)) * 350,
      y: 235 - d.value * 2,
      ...d,
    }));
    const marks = [
      {
        tag: "path",
        group: 2,
        attrs: {
          d: coords.map((d, i) => `${i ? "L" : "M"}${d.x},${d.y}`).join(" "),
          stroke: "#578c73",
          "stroke-width": 2,
          fill: "none",
        },
      },
      ...coords.map((d) => ({
        tag: "circle",
        group: 1,
        attrs: { cx: d.x, cy: d.y, r: points.length > 30 ? 2 : 5, fill: "#78a38d" },
        tip: `${d.label}：${d.value.toFixed(1)}`,
      })),
      {
        tag: "text",
        group: 0,
        attrs: { x: 45, y: 268 },
        text: "2026-01-01 → 2026-03-31（UTC）",
      },
    ];
    return {
      marks,
      height: 295,
      summary: `同一份 90 天数据，按${{ day: "日", week: "7 天块", month: "自然月" }[p.grain]}求均值后得到 ${points.length} 个时间点；位置取每组时间范围的中点。`,
      table: [["时间", "均值"], ...points.map((d) => [d.label, d.value.toFixed(1)])],
    };
  }
  function missingTime(p) {
    /*@0*/ const raw = [32, 49, null, 72, 58, 86, null, 94, 76, 105, 89, 116];
    const values = raw.map((v) => (v === null && p.missing === "zero" ? 0 : v));
    /*@1*/ let path = "",
      started = false;
    const marks = [];
    values.forEach((value, i) => {
      if (value === null) {
        if (p.missing === "gap") started = false;
        return;
      }
      const x = 38 + i * 34,
        y = 240 - value * 1.65;
      path += (started ? "L" : "M") + `${x},${y}`;
      started = true;
      marks.push({
        tag: "circle",
        group: 0,
        attrs: { cx: x, cy: y, r: 4, fill: raw[i] === null ? "#d89a6c" : "#6d9b80" },
        tip: `${i + 1} 月：${value}${raw[i] === null ? "（缺失被补零）" : ""}`,
      });
    });
    /*@2*/ marks.push(
      {
        tag: "path",
        group: 1,
        attrs: { d: path, stroke: "#6a997a", "stroke-width": 2.5, fill: "none" },
      },
      {
        tag: "line",
        group: 2,
        attrs: { x1: 38, y1: 240, x2: 412, y2: 240, stroke: "#b4c5b1" },
      },
    );
    raw.forEach((_, i) =>
      marks.push({
        tag: "text",
        group: 2,
        attrs: { x: 38 + i * 34, y: 263, "text-anchor": "middle", "font-size": 10 },
        text: `${i + 1}月`,
      }),
    );
    return {
      marks,
      height: 290,
      summary:
        p.missing === "zero"
          ? "错误对照：补零制造了并未观测到的谷底。"
          : p.missing === "connect"
            ? "跨缺失连接会暗示连续性，应明确注明缺失。"
            : "缺失处断线：没有观测，不代表数值为零。",
      table: [
        ["月份", "原始值", "显示值"],
        ...raw.map((v, i) => [
          i + 1,
          v === null ? "缺失" : v,
          values[i] === null ? "缺失" : values[i],
        ]),
      ],
    };
  }
  function calendar(p) {
    /*@0*/ const start = Date.UTC(2026, 0, 1),
      offset = 4;
    const days = Array.from({ length: 56 }, (_, i) => ({
      date: new Date(start + i * 86400000),
      value: Math.round(42 + 28 * Math.sin(i * 0.23) + 15 * Math.cos(i * 0.7)),
    }));
    /*@1*/ const colors =
      p.palette === "blue"
        ? ["#e4eff7", "#bdd3e5", "#8cb3d0", "#5b8fae", "#32627f"]
        : ["#e7efdc", "#bfd3a0", "#99b978", "#729957", "#456f3c"];
    /*@2*/ const marks = days.map((d, i) => ({
      tag: "rect",
      group: 1,
      attrs: {
        x: 55 + Math.floor((i + offset) / 7) * 39,
        y: 28 + d.date.getUTCDay() * 28,
        width: 33,
        height: 22,
        rx: 3,
        fill:
          d.value < p.threshold
            ? "#edf0e9"
            : colors[Math.min(4, Math.floor(d.value / 20))],
      },
      tip: `${d.date.toISOString().slice(0, 10)}：${d.value}`,
    }));
    ["日", "一", "二", "三", "四", "五", "六"].forEach((d, i) =>
      marks.push({
        tag: "text",
        group: 0,
        attrs: { x: 20, y: 43 + i * 28 },
        text: d,
      }),
    );
    colors.forEach((fill, i) =>
      marks.push({
        tag: "rect",
        group: 2,
        attrs: { x: 160 + i * 32, y: 252, width: 26, height: 13, rx: 2, fill },
      }),
    );
    colors.forEach((_, i) =>
      marks.push({
        tag: "text",
        group: 2,
        attrs: { x: 173 + i * 32, y: 282, "text-anchor": "middle", "font-size": 9 },
        text: i === 4 ? "80+" : String(i * 20),
      }),
    );
    return {
      marks,
      height: 295,
      summary: `2026 年前 56 天的合成数据；周为列、星期为行；突出 ${days.filter((d) => d.value >= p.threshold).length} 天。`,
      table: [
        ["日期", "数值"],
        ...days.map((d) => [d.date.toISOString().slice(0, 10), d.value]),
      ],
    };
  }
  function spiral(p) {
    /*@0*/ const count = 84,
      period = p.period;
    const angles = Array.from(
      { length: count },
      (_, i) => (2 * Math.PI * i) / period,
    );
    /*@1*/ const radii = angles.map((theta) => 18 + p.spacing * theta),
      scale = 125 / Math.max(...radii);
    /*@2*/ const points = angles.map((theta, i) => ({
      x: 225 + radii[i] * scale * Math.cos(theta),
      y: 150 + radii[i] * scale * Math.sin(theta),
      day: i + 1,
    }));
    const marks = [
      {
        tag: "path",
        group: 1,
        attrs: {
          d: points.map((d, i) => `${i ? "L" : "M"}${d.x},${d.y}`).join(" "),
          fill: "none",
          stroke: "#cfdfce",
          "stroke-width": 1,
        },
      },
      ...points.map((d) => ({
        tag: "circle",
        group: 2,
        attrs: {
          cx: d.x,
          cy: d.y,
          r: 3.7,
          fill: ["#82a593", "#5e8e79", "#d3a16c"][
            Math.floor((d.day - 1) / period) % 3
          ],
        },
        tip: `第 ${d.day} 天`,
      })),
      {
        tag: "line",
        group: 0,
        attrs: {
          x1: 225,
          y1: 150,
          x2: 360,
          y2: 150,
          stroke: "#c4d3c4",
          "stroke-dasharray": "3 4",
        },
      },
      { tag: "circle", group: 0, attrs: { cx: 225, cy: 150, r: 3, fill: "#779b83" } },
    ];
    return {
      marks,
      height: 310,
      summary: `84 天数据；每 ${period} 天转一圈；r = 18 + ${p.spacing}θ；为适应画布统一缩放。`,
      table: [
        ["日期", "角度 rad", "未缩放半径"],
        ...angles
          .filter((_, i) => i % p.period === 0)
          .map((t, i) => [
            i * p.period + 1,
            t.toFixed(2),
            (18 + p.spacing * t).toFixed(1),
          ]),
      ],
    };
  }
  function storyline(p) {
    /*@0*/ const names = ["角色 A", "角色 B", "角色 C"],
      times = [0, 1, 2, 3, 4];
    const colors = ["#578e78", "#799ebc", "#c09b68"];
    /*@1*/ const paths = names.map((name, person) =>
      times.map((time) => ({
        x: 55 + time * 82,
        y: time === p.meeting ? 130 + person * 11 : 58 + person * 77,
      })),
    );
    /*@2*/ const marks = paths.flatMap((points, i) => [
      {
        tag: "path",
        group: 1,
        attrs: {
          d: points.map((d, n) => `${n ? "L" : "M"}${d.x},${d.y}`).join(" "),
          fill: "none",
          stroke: colors[i],
          "stroke-width": i === p.person ? 4 : 2,
          opacity: i === p.person ? 1 : 0.55,
        },
        choose: { id: "person", value: i },
        tip: names[i],
      },
      {
        tag: "text",
        group: 0,
        attrs: { x: 14, y: points[0].y - 12, fill: colors[i] },
        text: names[i],
      },
    ]);
    marks.push({
      tag: "rect",
      group: 2,
      attrs: {
        x: 55 + p.meeting * 82 - 16,
        y: 111,
        width: 32,
        height: 58,
        rx: 6,
        fill: "none",
        stroke: "#a9bf98",
        "stroke-dasharray": "4 3",
      },
    });
    times.forEach((t) =>
      marks.push({
        tag: "text",
        group: 0,
        attrs: { x: 55 + t * 82, y: 266, "text-anchor": "middle" },
        text: `场景${t + 1}`,
      }),
    );
    return {
      marks,
      height: 295,
      summary: `三个角色在场景 ${p.meeting + 1} 相遇。纵向轨道用于组织人物关系，不表示数量高低。点击轨迹选择角色。`,
      table: [["角色", "相遇场景"], ...names.map((n) => [n, p.meeting + 1])],
    };
  }
  const computes = {
    cleanData,
    dikw,
    attributes,
    transformData,
    dataJoin,
    pipeline,
    hierarchy,
    eventPath,
    colorSpace,
    colorMap,
    labSlice,
    harmony,
    researchPalette,
    emphasis,
    redundant,
    coordinates,
    curves,
    contours,
    timeAggregation,
    missingTime,
    calendar,
    spiral,
    storyline,
  };
  root.LinkedLessonModels = computes;
  if (typeof module !== "undefined" && module.exports) module.exports = computes;
})(typeof window === "undefined" ? globalThis : window);

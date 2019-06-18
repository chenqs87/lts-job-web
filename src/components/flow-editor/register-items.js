import factory from "@/assets/factory.svg";

const Flow = G6Editor.Flow;

Flow.registerNode("factory-card", {
  draw(item) {
    const group = item.getGraphicGroup();
    const model = item.getModel();
    const width = 100;
    const height = 100;
    const x = -width / 2;
    const y = -height / 2;
    const keyShape = group.addShape("image", {
      attrs: {
        x,
        y,
        width,
        height,
        img: factory
      }
    });
    if (model.label) {
      group.addShape("text", {
        attrs: {
          text: model.label,
          x: 0,
          y: y - 20,
          textAlign: "center",
          textBaseline: "top",
          fill: model.color ? model.color : "rgba(0,0,0,0.65)"
        }
      });
    }
    return keyShape;
  },
  // 设置锚点
  anchor: [
    [
      1,
      0.5,
      {
        type: "output"
      }
    ], // 上面边的中点
    [
      0,
      0.5,
      {
        type: "input"
      }
    ] // 下边边的中点
  ]
});

// 注册模型卡片基类
Flow.registerNode("model-card", {
  draw(item) {
    const group = item.getGraphicGroup();
    const model = item.getModel();
    const width = 184;
    const height = 40;
    const x = -width / 2;
    const y = -height / 2;
    const borderRadius = 4;
    const keyShape = group.addShape("rect", {
      attrs: {
        x,
        y,
        width,
        height,
        radius: borderRadius,
        fill: "white",
        stroke: "#CED4D9"
      }
    });
    // 左侧色条
    group.addShape("path", {
      attrs: {
        path: [
          ["M", x, y + borderRadius],
          ["L", x, y + height - borderRadius],
          [
            "A",
            borderRadius,
            borderRadius,
            0,
            0,
            0,
            x + borderRadius,
            y + height
          ],
          ["L", x + borderRadius, y],
          ["A", borderRadius, borderRadius, 0, 0, 0, x, y + borderRadius]
        ],
        fill: this.color_type
      }
    });
    // 类型 logo
    group.addShape("image", {
      attrs: {
        img: this.type_icon_url,
        x: x + 16,
        y: y + 12,
        width: 20,
        height: 16
      }
    });
    // 名称文本
    const label = model.label ? model.label : this.label;
    group.addShape("text", {
      attrs: {
        text: label,
        x: x + 52,
        y: y + 13,
        textAlign: "start",
        textBaseline: "top",
        fill: "rgba(0,0,0,0.65)"
      }
    });
    // 状态 logo
    group.addShape("image", {
      attrs: {
        img: this.state_icon_url,
        x: x + 158,
        y: y + 12,
        width: 16,
        height: 16
      }
    });
    return keyShape;
  },
  // 设置锚点
  anchor: [
    [0.5, 0], // 上面边的中点
    [0.5, 1] // 下边边的中点
  ]
});

// k 均值聚类
Flow.registerNode(
  "k-means",
  {
    label: "k 均值聚类",
    color_type: "#1890FF",
    type_icon_url:
      "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
    state_icon_url:
      "https://gw.alipayobjects.com/zos/rmsportal/MXXetJAxlqrbisIuZxDO.svg",
    // 设置锚点
    anchor: [
      [
        0.5,
        0,
        {
          type: "input"
        }
      ], // 上面边的中点
      [
        0.5,
        1,
        {
          type: "output"
        }
      ] // 下边边的中点
    ]
  },
  "model-card"
);

// 随机森林
Flow.registerNode(
  "random-forest",
  {
    label: "随机森林",
    color_type: "#9254DE",
    type_icon_url:
      "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
    state_icon_url:
      "https://gw.alipayobjects.com/zos/rmsportal/MXXetJAxlqrbisIuZxDO.svg",
    // 设置锚点
    anchor: [
      [
        0.5,
        0,
        {
          type: "input"
        }
      ],
      [
        0.5,
        1,
        {
          type: "output"
        }
      ]
    ]
  },
  "model-card"
);

// PS-SMART 分类
Flow.registerNode(
  "PS-SMART",
  {
    label: "PS-SMART 分类",
    color_type: "#1890FF",
    type_icon_url:
      "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
    state_icon_url:
      "https://gw.alipayobjects.com/zos/rmsportal/MXXetJAxlqrbisIuZxDO.svg",
    // 设置锚点
    anchor: [
      [
        0.5,
        0,
        {
          type: "input"
        }
      ],
      [
        0.33,
        1,
        {
          type: "output"
        }
      ],
      [
        0.66,
        1,
        {
          type: "output"
        }
      ]
    ]
  },
  "model-card"
);

// 朴素贝叶斯
Flow.registerNode(
  "Bayes",
  {
    label: "朴素贝叶斯",
    color_type: "#9254DE",
    type_icon_url:
      "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
    state_icon_url:
      "https://gw.alipayobjects.com/zos/rmsportal/uZVdwjJGqDooqKLKtvGA.svg",
    // 设置锚点
    anchor: [
      [
        0.5,
        0,
        {
          type: "input"
        }
      ],
      [
        0.5,
        1,
        {
          type: "output"
        }
      ]
    ]
  },
  "model-card"
);

// 读数据表
Flow.registerNode(
  "read-data-base",
  {
    label: "读数据表",
    color_type: "#FAAD14",
    type_icon_url:
      "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
    state_icon_url:
      "https://gw.alipayobjects.com/zos/rmsportal/MXXetJAxlqrbisIuZxDO.svg",
    // 设置锚点
    anchor: [
      [
        0.5,
        1,
        {
          type: "output"
        }
      ]
    ]
  },
  "model-card"
);

Flow.registerEdge("line", {
  draw(item) {
    const group = item.getGraphicGroup();
    const path = this.getPath(item);

    // const width = 20;

    let aaa = group.addShape("path", {
      attrs: {
        path,
        stroke: "black",
        // lineWidth: width,
        endArrow: true,
        lineDash: [10, 10]
      }
    });

    return aaa;
  },
  getPath(item) {
    const points = item.getPoints();
    return G6Editor.Util.pointsToPolygon(points);
  },
  afterDraw: function afterDraw(item) {
    var keyShape = item.getKeyShape();
    keyShape.attr("lineDashOffset", 0);
    keyShape.animate(
      {
        lineDashOffset: -20,
        repeat: true
      },
      500
    );
  }
});

function registerJob(jobId, name) {
  Flow.registerNode(
    jobId,
    {
      label: jobId + ":" + name,
      color_type: "#1890FF",
      type_icon_url:
        "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
      state_icon_url:
        "https://gw.alipayobjects.com/zos/rmsportal/MXXetJAxlqrbisIuZxDO.svg",
      // 设置锚点
      anchor: [[0.5, 0, { type: "input" }], [0.5, 1, { type: "output" }]]
    },
    "model-card"
  );
}

export default {
  registerJob
};

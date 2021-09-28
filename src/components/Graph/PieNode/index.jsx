import G6 from "@antv/g6";

const lightBlue = "#5b8ff9";
const lightOrange = "#5ad8a6";
const lightRed = "#FF0000";

// register a pie chart node
G6.registerNode("pie-node", {
  draw: (cfg, group) => {
    const radius = cfg.size / 2; // node radius
    const inPercentage1 = cfg.inDegree1 / cfg.degree; // the ratio of indegree to outdegree
    const inPercentage2 = cfg.inDegree2 / cfg.degree; // the ratio of indegree to outdegree
    const inPercentage3 = cfg.inDegree3 / cfg.degree; // the ratio of indegree to outdegree

    const inAngle1 = inPercentage1 * Math.PI * 2; // the anble for the indegree fan
    const inAngle2 = inPercentage2 * Math.PI * 2 + inAngle1; // the anble for the indegree fan
    const inAngle3 = inPercentage3 * Math.PI * 2 + inAngle2; // the anble for the indegree fan

    const inArcEnd1 = [
      radius * Math.cos(inAngle1),
      -radius * Math.sin(inAngle1)
    ]; // the end position for the in-degree fan
    const inArcEnd2 = [
      radius * Math.cos(inAngle2),
      -radius * Math.sin(inAngle2)
    ]; // the end position for the in-degree fan

    let isOutBigArc = 1;
    if (inAngle1 > Math.PI / 2) {
      isOutBigArc = 0;
    }
    // fan shape for the in degree
    group.addShape("path", {
      attrs: {
        path: [
          ["M", radius, 0],
          ["A", radius, radius, 0, 0, 0, inArcEnd1[0], inArcEnd1[1]],
          ["L", 0, 0],
          ["Z"]
        ],
        lineWidth: 0,
        fill: lightOrange
      },
      name: "in-fan-shape1"
    });

    // draw the fan shape
    group.addShape("path", {
      attrs: {
        path: [
          ["M", inArcEnd1[0], inArcEnd1[1]],
          ["A", radius, radius, 0, 1, 0, radius, 0],
          ["L", 0, 0],
          ["Z"]
        ],
        lineWidth: 0,
        fill: lightRed
      },
      name: "out-fan-shape"
    });
    group.addShape("path", {
      attrs: {
        path: [
          ["M", inArcEnd2[0], inArcEnd2[1]],
          ["A", radius, radius, 0, isOutBigArc, 0, radius, 0],
          ["L", 0, 0],
          ["Z"]
        ],
        lineWidth: 0,
        fill: lightBlue
      },
      name: "out-fan-shape"
    });
    // 返回 keyshape
    return group;
  }
});




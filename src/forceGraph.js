import G6 from '@antv/g6';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export default function ForceGraph () {
  const reff = React.useRef(null);
  let graph = null;

  //const width = container.scrollWidth;
  //const height = container.scrollHeight || 500;

  useEffect(() => {
    const container =  ReactDOM.findDOMNode(reff.current);
    if (!graph) {
      const graph = new G6.Graph({
        container: ReactDOM.findDOMNode(reff.current),
        width: 120,
        height: 120,
        layout: {
          type: 'force',
        },
        defaultNode: {
          size: 15,
        },
      })};

      fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/relations.json')
      .then((res) => res.json())
      .then((data) => {
        graph.data({
          nodes: data.nodes,
          edges: data.edges.map(function (edge, i) {
            edge.id = 'edge' + i;
            return Object.assign({}, edge);
          }),
        });
        graph.render();
    
        graph.on('node:dragstart', function (e) {
          graph.layout();
          refreshDragedNodePosition(e);
        });
        graph.on('node:drag', function (e) {
          const forceLayout = graph.get('layoutController').layoutMethods[0];
          forceLayout.execute();
          refreshDragedNodePosition(e);
        });
        graph.on('node:dragend', function (e) {
          e.item.get('model').fx = null;
          e.item.get('model').fy = null;
        });
    
        if (typeof window !== 'undefined')
          window.onresize = () => {
            if (!graph || graph.get('destroyed')) return;
            if (!container || !container.scrollWidth || !container.scrollHeight) return;
            graph.changeSize(container.scrollWidth, container.scrollHeight);
          };
      });

    function refreshDragedNodePosition(e) {
    const model = e.item.get('model');
    model.fx = e.x;
    model.fy = e.y;
  }});
  return <div reff={reff}></div>;
  }


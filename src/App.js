//import logo from './logo.svg';
import G6 from '@antv/g6';
import './App.css';
import { Footer, Header, UndoButton, RedoButton } from './components/Layout'
import axios from 'axios';
import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import cloneDeep from "lodash/cloneDeep";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.undo = []; // Record the status to be returned
    this.redo = []; //Record to be last status
    this.cleundo = true; // Whether to display the Undo button
    this.cleredo = true; //Whether to display the Redo button
    this.idSelected = ""; //id of selected node or edge
    this.labelSelected = "";//label of selected node or edge
    this.isNode = false;//whether it is node, the selected node
    this.isCombo = false;//whether combo
    this.isEdge = false;//whether edge
    this.previous = [];//record the node or edge that is selected; corresponding undo
    this.future = [];//when the user click undo, save the first value (node/edge) of the list previous
    this.current = "";//the current type (node/edge) of the selected element 
    this.comboDataVir = {};// unuseful
    this.nodeClickedPath = [];//record the selected nodes to be showed in the subgraph
    this.updateCombo = true;//where update combo graph
    this.comboRecord = {};//record of the state
    //state
    this.state = {
      indexEtat: "0", //the id of clicked state in the history graph
      clickId: "", //the id of selected node
      isNode: true, //whether display node in the combo graph (it has influence to the layout of combograph)
      clickLabel: "",// the label of selected element(node/edge)
      record: "waiting for work ヾ(￣▽￣)",//signage
      labelHistory: "____",//title for history graph
      changesInfo: [{ disappear: [], appear: [], valuechange: [], validtime: [] },
      { disappear: [], appear: [], valuechange: [], validtime: [] }],// record of the changes of an entity
      comboData: {
      },// data to be rendered in the combo graph
      nodeid: {},//date about node to be transmitted in the list
      edgeid: {}, // date about edge to be transmitted in the list
      forceData: {
        nodes: [
          {
            id: '01',
            x: 30,
            y: 120,
            label: 'User',
            style: {
              fill: '	#FF6666',
              stroke: '#FF6666',
            },
          },
          {
            id: '02',
            x: 330,
            y: 120,
            label: 'Item',
            type: 'circle',
            style: {
              fill: '#006699',
              stroke: '#006699',
            },
          },
          {
            id: '03',
            x: 630,
            y: 120,
            label: 'Category',
            style: {
              fill: '#FFFF00',
              stroke: '#FFFF00',
            },
          },
        ],
        edges: [{
          source: '01',
          target: '02',
          label: 'addtocart',
          style: {
            stroke: '#D3D3D3',
          },
        },
        {
          source: '02',
          target: '03',
          label: 'belongto',
          style: {
            stroke: '#CFCFCF',
          },
        },
        {
          source: '03',
          target: '03',
          label: 'subCategory',
          type: 'loop',
          style: {
            stroke: '#AAABD3',
          },
        }
          ,
        {
          source: '01',
          target: '02',
          label: 'view',
          style: {
            stroke: '#EEB4B4',
          },
        },
        {
          source: '01',
          target: '02',
          label: 'transaction',
          style: {
            stroke: '#CDBE70',
          },
        }
        ],

      },// data to be rendered in the force graph (structure of the graph in the database)
      pathDate: { nodes: [], edges: [] },// data to be rendered on the path graph
      historyData: {
        "nodes": [
          {
            "id": "1022750",
            "label": "1009690",
            "size": "80",
            "x": "0",
            "y": "5"
          },
          {
            "id": "1022751",
            "label": "1009691",
            "size": "80",
            "degree": "360",
            "type": "demi-node",
            "x": "90",
            "y": "5",
            "color1": "#7FFF00",
            "color2": "#FFB90F",
            "style": {
              "fill": "#FFFFFF"
            }
          },
          {
            "id": "1022752",
            "label": "1009692",
            "size": "80",
            "degree": "360",
            "type": "demi-node",
            "x": "180",
            "y": "5",
            "color1": "#7FFF00",
            "color2": "#FFB90F",
            "style": {
              "fill": "#FFFFFF"
            }
          },
          {
            "id": "1022753",
            "label": "1009693",
            "size": "80",
            "degree": "360",
            "type": "demi-node",
            "x": "270",
            "y": "5",
            "color1": "#7FFF00",
            "color2": "#FFB90F",
            "style": {
              "fill": "#FFFFFF"
            }
          },
          {
            "id": "1022754",
            "label": "1009694",
            "size": "80",
            "degree": "360",
            "type": "demi-node",
            "x": "360",
            "y": "5",
            "color1": "#7FFF00",
            "color2": "#FFB90F",
            "style": {
              "fill": "#FFFFFF"
            }
          },
          {
            "id": "1022755",
            "label": "1009695",
            "size": "80",
            "degree": "360",
            "type": "demi-node",
            "x": "450",
            "y": "5",
            "color1": "#7FFF00",
            "color2": "#FFB90F",
            "style": {
              "fill": "#FFFFFF"
            }
          },
          {
            "id": "1022756",
            "label": "1009696",
            "size": "80",
            "degree": "360",
            "type": "demi-node",
            "x": "540",
            "y": "5",
            "color1": "#7FFF00",
            "color2": "#FFB90F",
            "style": {
              "fill": "#FFFFFF"
            }
          },
          {
            "id": "1022757",
            "label": "1009697",
            "size": "80",
            "degree": "360",
            "type": "",
            "x": "630",
            "y": "5",
            "color1": "",
            "color2": "",
            "style": {
              "fill": "#FFB90F"
            }
          },
          {
            "id": "1022758",
            "label": "1009698",
            "size": "80",
            "degree": "360",
            "type": "demi-node",
            "x": "720",
            "y": "5",
            "color1": "#7FFF00",
            "color2": "#FFB90F",
            "style": {
              "fill": "#FFFFFF"
            }
          },
          {
            "id": "1022759",
            "label": "1009699",
            "size": "80",
            "degree": "360",
            "type": "demi-node",
            "x": "810",
            "y": "5",
            "color1": "#FFB90F",
            "color2": "#FF0000",
            "style": {
              "fill": "#FFFFFF"
            }
          }
        ]
      }// data to be rendered on the history graph
    };//{ id: '0', label: 'test', x: 20, y: 55 }
   
   //------------------graphs--------------------------
    this.comboGraph = null;
    this.forceGraph = null;
    this.pathGraph = null;
    this.historyGraph = null;

  }

  //publish message
  // publish the selected node in the force graph
  publishmsgNode = () => {
    // console.log("app publish", this.state.nodeid)
    PubSub.publish('NODE', this.state.nodeid);
  }
  // publish the selected edge in the force graph
  publishmsgEdge = () => {
    //  console.log("app publish", this.state.edgeid)
    PubSub.publish('EDGE', this.state.edgeid);
  }
  // publish the current combo data
  publishmsgComboData = (dataselected) => {
    //  console.log("app publish")
    PubSub.publish('COMBODATA', dataselected);
  }
  // publish the current path data 
  publishmsgPathData = (pathdata) => {
    //console.log("app publish")
    PubSub.publish('PATHDATA', pathdata);
  }

  publishmsgPathDataToHeader = (pathdata) => {
    //  console.log("app publish")
    PubSub.publish('PATHDATAHEADER', pathdata);
  }

  handleUndo = (e) => {
    e.preventDefault();
    // console.log("undo", this.undo)
    this.saveRedo();
    //this.redo.unshift(this.state);
    this.setState({
      clickId: this.undo[0].clickId,
      isNode: this.undo[0].isNode,
      clickLabel: this.undo[0].clickLabel,
      comboData: this.undo[0].comboData,
      nodeid: this.undo[0].nodeid,
      edgeid: this.undo[0].edgeid,
      pathDate: this.undo[0].pathDate,
      indexEtat: this.undo[0].indexEtat,
      record: this.undo[0].record,
      labelHistory: this.undo[0].labelHistory,
      changesInfo: this.undo[0].changesInfo,
      historyData: this.undo[0].historyData,

    }, () => {
      this.future.unshift(this.current); //0 current
      (this.previous[1] === "node") ? this.publishmsgNode() : this.publishmsgEdge();
      this.current = this.previous[1]
      this.previous.splice(1, 1);
      //  console.log("statettete",this.state.comboData)
    }
    );

    this.undo.splice(0, 1);
  }

  handleRedo = (e) => {
    e.preventDefault();
    this.saveUndo();
    this.setState({
      clickId: this.redo[0].clickId,
      isNode: this.redo[0].isNode,
      clickLabel: this.redo[0].clickLabel,
      comboData: this.redo[0].comboData,
      nodeid: this.redo[0].nodeid,
      edgeid: this.redo[0].edgeid,
      pathDate: this.redo[0].pathDate,
      indexEtat: this.undo[0].indexEtat,
      record: this.undo[0].record,
      labelHistory: this.undo[0].labelHistory,
      changesInfo: this.undo[0].changesInfo,
      historyData: this.undo[0].historyData,
    }, () => {
      this.previous.splice(1, 0, this.current);

      (this.future[0] === "node") ? this.publishmsgNode() : this.publishmsgEdge();
      this.current = this.future[0];
      this.future.splice(0, 1)
    }

    );

    this.redo.splice(0, 1);
  }

  componentDidMount() {
    this.activeBtn();
    PubSub.subscribe('DATE', (_, stateObj) => {
      //  console.log("date", stateObj);
      // axios.get(`http://localhost:8080/kaggle/time/` + this.state.clickLabel + `/time_get?st=` + stateObj[0] + `&et= ` + stateObj[1])
      //   .then(res => {
      //     console.log("DATE", `http://localhost:8080/kaggle/time/` + this.state.clickLabel + `/time_get?st=` + stateObj[0] + `&et=` + stateObj[1])
      //     this.setState({ comboData: res.data });

      //   });

      axios.post(`http://localhost:8080/kaggle/subgraph/time/validtime?st=` + stateObj[0] + `&et= ` + stateObj[1], this.state.pathDate)
        .then(res => {
          console.log("DATE", `http://localhost:8080/kaggle/subgraph/time/validtime?st=` + stateObj[0] + `&et= ` + stateObj[1])

          this.updateCombo = true;
          this.comboRecord = res.data;
          this.setState({ comboData: res.data });

          this.setPrompt();

        });

    });

    // PubSub.subscribe('DAY', (_, stateObj) => {
    //   console.log("day", stateObj);

    //   axios.post(`http://localhost:8080/kaggle/subgraph/time/validtime?st=` + stateObj[0] + `&et= ` + stateObj[1], this.state.pathDate)
    //     .then(res => {
    //       console.log("day", `http://localhost:8080/kaggle/subgraph/time/validtime?st=` + stateObj[0] + `&et= ` + stateObj[1])
    //       this.setState({ comboData: res.data });


    //     });

    // });

    PubSub.subscribe('ClickList', (_, stateObj) => {
      this.saveUndo();
      if (stateObj[0] === 'false') {
        axios.get(`http://localhost:8080/kaggle/combo/node/` + stateObj[1].toLowerCase() + `/` + stateObj[2])
          .then(res => {
            this.updateCombo = true;
            this.setState({ comboData: res.data });
            this.comboRecord = res.data;
            this.setPrompt();

          });
      }
      else if (stateObj[0] === 'true') {
        axios.get(`http://localhost:8080/kaggle/combo/edge/` + stateObj[5].toLowerCase() + `/` + stateObj[1].toLowerCase() + '/' + stateObj[3] + '/' + stateObj[2].toLowerCase() + '/' + stateObj[4])
          .then(res => {
            this.updateCombo = true;
            this.setState({ comboData: res.data });
            this.comboRecord = res.data;
            this.setPrompt();
            //this.comboDataVir.cloneDeep(this.state.comboData)
          });
      }
    });
    PubSub.subscribe('AFTERFILTRE', (_, stateObj) => {
      //  console.log("AFTERFILTRE", stateObj);
      this.updateCombo = true;
      this.setState({ comboData: stateObj })
      this.comboRecord = stateObj;
      this.setPrompt()
    });



    // this.callAPI();

    //plugins of graph
    // const tooltipForce = new G6.Tooltip({
    //   offsetX: 10,
    //   offsetY: 10,
    //   // the types of items that allow the tooltip show up
    //   itemTypes: ['node', 'edge'],
    //   // custom the tooltip's content
    //   getContent: (e) => {
    //     const outDiv = document.createElement('div');
    //     outDiv.style.width = 'fit-content';
    //     //outDiv.style.padding = '0px 0px 20px 0px';

    //     outDiv.innerHTML = `
    //     <h4>Info</h4>
    //     <ul>
    //       <li>Type: ${e.item.getType()}</li>
    //     </ul>
    //     <ul>
    //       <li>Label: ${e.item.getModel().label}</li>
    //     </ul>`;
    //     return outDiv;
    //   },
    // });
    // const tooltipCombo = new G6.Tooltip({
    //   offsetX: 10,
    //   offsetY: 10,

    //   // the types of items that allow the tooltip show up
    //   itemTypes: ['combo'],
    //   // custom the tooltip's content
    //   getContent: (e) => {
    //     const outDiv = document.createElement('div');
    //     outDiv.style.width = 'fit-content';
    //     //outDiv.style.padding = '0px 0px 20px 0px';
    //     outDiv.innerHTML = `
    //     <h4>Info</h4>
    //     <ul>
    //     <li>Id: ${e.item.getModel().id}</li>
    //   </ul>
    //     <ul>
    //       <li>Type: ${e.item.getType()}</li>
    //     </ul>
    //     <ul>
    //       <li>Label: ${e.item.getModel().label}</li>
    //     </ul>`;
    //     return outDiv;
    //   },
    // });
    // const tooltipNode = new G6.Tooltip({
    //   offsetX: 10,
    //   offsetY: 10,

    //   // the types of items that allow the tooltip show up
    //   itemTypes: ['node'],
    //   // custom the tooltip's content
    //   getContent: (e) => {
    //     const outDiv = document.createElement('div');
    //     outDiv.style.width = 'fit-content';
    //     //outDiv.style.padding = '0px 0px 20px 0px';
    //     var attributesList = "";
    //     Object.keys(e.item.getModel().attributes).forEach(key => {
    //       if (key !== "startvalidtime" & key !== "endvalidtime") {
    //         attributesList = attributesList + "<ul><li>" + key + ":" + e.item.getModel().attributes[key] + "</li></ul>";
    //       }
    //       return attributesList;
    //     })

    //     outDiv.innerHTML = `
    //     <h4>Info</h4>
    //     <ul>
    //     <li>Id: ${e.item.getModel().id}</li>
    //   </ul>
    //     <ul>
    //       <li>InstanceId: ${e.item.getModel().instanceid}</li>
    //     </ul>
    //     <ul>
    //     <li>EntityId: ${e.item.getModel().comboId}</li>
    //   </ul>
    //     <ul>
    //     <li>Startvalidtime: ${e.item.getModel().startvalidtime}</li>
    //   </ul>
    //   <ul>
    //   <li>Endvalidtime: ${e.item.getModel().endvalidtime}</li>
    // </ul>
    //   `+ attributesList;
    //     return outDiv;
    //   },
    // });
    // const tooltipEdge = new G6.Tooltip({
    //   offsetX: 10,
    //   offsetY: 10,

    //   // the types of items that allow the tooltip show up
    //   itemTypes: ['edge'],
    //   // custom the tooltip's content
    //   getContent: (e) => {
    //     const outDiv = document.createElement('div');

    //     outDiv.style.width = 'fit-content';
    //     //outDiv.style.padding = '0px 0px 20px 0px';
    //     var attributesList = "";
    //     Object.keys(e.item.getModel().attributes).forEach(key => {
    //       if (key !== "startvalidtime" & key !== "endvalidtime") {
    //         attributesList = attributesList + "<ul><li>" + key + ":" + e.item.getModel().attributes[key] + "</li></ul>";
    //       }
    //       return attributesList;
    //     })

    //     outDiv.innerHTML = `
    //     <h4>Info</h4>
    //     <ul>
    //     <li>Id: ${e.item.getModel().id}</li>
    //   </ul>
    //   <ul>
    //   <li>Type: ${e.item.getModel().typeEdge}</li>
    // </ul>
    //     <ul>
    //       <li>SourceId: ${e.item.getModel().source}</li>
    //     </ul>
    //     <ul>
    //     <li>TargetId: ${e.item.getModel().target}</li>
    //   </ul>

    //     <ul>
    //     <li>Startvalidtime: ${e.item.getModel().attributes.startvalidtime}</li>
    //   </ul>
    //   <ul>
    //   <li>Endvalidtime: ${e.item.getModel().attributes.endvalidtime}</li>
    // </ul>
    //   `+ attributesList;
    //     return outDiv;
    //   },
    // });
    const contextMenu = new G6.Menu({

      getContent(evt) {
        let header;
        if (evt.target && evt.target.isCanvas && evt.target.isCanvas()) {
          //     console.log(evt.target.isCanvas())
          header = 'Canvas ContextMenu';
        }
        else if (evt.item) {
          const itemType = evt.item.getType();
          //    console.log(evt);
          const { item } = evt;
          if (itemType === 'node' || itemType === 'combo') {
            header = `${item._cfg.model.label}`;
          }
          else if (itemType === 'edge') {
            header = `${item._cfg.id}`;
          }
        }
        return `
      <h3 class="serif" >${header}</h3>
      <HR align=center width=100 color=#EEE9E9 SIZE=1>
      <div align="left"><button class=" btnInMenu" >Delete</button></div>
      <div align="left"><button class=" btnInMenu" >History</button></div>
      <div align="left"><button class=" btnInMenu" >Expand</button></div>`;
      },

      handleMenuClick: (target, item) => {
        console.log(target.innerText, item);
        if (target.innerText === "Delete") {
          this.handleDelete();
        } else if (target.innerText === "History") {
          this.handleHistory();
        } else if (target.innerText === "Expand") {
          var type = item._cfg.type;
          var id = item._cfg.model.label;
          console.log("id", id);
          let nameId;
          let reg = /[0-9]+/g;
          let idNoNum = id.replace(reg, "");
          let label;
          console.log("idNoNum", idNoNum);
          if (type === "combo") {
            label = idNoNum;
            nameId = idNoNum.toLowerCase() + "id";
          }
          else if (type === "node") {
            if (idNoNum.length === 0) {
              label = item._cfg.model.comboId.replace(reg, "");
              nameId = "instanceid"
            } else {
              label = idNoNum;
              nameId = idNoNum.toLowerCase() + "id";
            }
          }
          var idTarget = id.replace(/[^0-9]/ig, "");
          this.handleExpand(idTarget, label, nameId);
        }
      },
      // offsetX and offsetY include the padding of the parent container
      // 需要加上父级容器的 padding-left 16 与自身偏移量 10
      offsetX: 16 + 10,
      // 需要加上父级容器的 padding-top 24 、画布兄弟元素高度、与自身偏移量 10
      offsetY: 0,
      // the types of items that allow the menu show up
      // 在哪些类型的元素上响应
      itemTypes: ['combo', 'node', 'edge'], //, 'canvas'
    });
    // const minimap = new G6.Minimap({
    //   size: [150, 100],
    // });

    //path graph
    this.pathGraph = new G6.Graph({
      container: "path",
      width: 3000,
      height: document.getElementById('path').scrollHeight || 200,
      defaultNode: {
        shape: "circle",
        size: [40],

        style: {
          lineWidth: 1
        },

        labelCfg: {
          style: {
            fill: "#000000",
            fontSize: 10
          }
        }
      },
      defaultEdge: {
        style: {
          stroke: "#e2e2e2"
        }
      }
    });

    this.pathGraph.data(this.state.pathDate);
    this.pathGraph.render();

    // force graph
    G6.Util.processParallelEdges(this.state.forceData.edges);
    const widthF = document.getElementById('force').scrollWidth || 300;
    const heightF = document.getElementById('force').scrollHeight || 300;
    this.forceGraph = new G6.Graph(
      {
        container: document.getElementById('force'),
        width: widthF,
        height: heightF,
        plugins: [],
        layout: {
          type: 'force',
        },
        modes: {
          default: ['drag-node'],
        },
        defaultNode: {
          type: 'circle',
          size: 100,
          // <img src="https://s3.jpg.cm/2021/06/21/IRQKPL.png" alt="node evolution" border="0">
          //img: 'https://i.loli.net/2021/06/21/2Wtydn6vSBHQuqX.png'
          style: {
            fill: 'green',
            //stroke: 'red',
            //lineDash: [2, 2],
            lineWidth: 0.5,
          },

        }
      }
    );
    this.forceGraph.node((node) => {
      if (node.label === 'Item') {

        return {
          id: node.id,
          style: {
            lineDash: [2, 2],
            lineWidth: 8,
          },
        };
      }
      else {
        return {
          id: node.id,
          style: {
            lineWidth: 0.5,

          },
        }
      }

    }
    );
    this.forceGraph.edge((edge) => {
      if (edge.label === 'view' || edge.label === 'transaction' || edge.label === 'addtocart') {
        return {
          id: edge.id,
          style: {
            lineDash: [2, 2],
            lineWidth: 7,
          },
        };
      }
      else {
        return {
          id: edge.id,
          style: {
            lineWidth: 1.5,

          },
        }
      }

    }
    );
    this.forceGraph.data(this.state.forceData);
    this.forceGraph.render();

    this.forceGraph.on('node:dragstart', (e) => {
      this.forceGraph.layout();
      this.refreshDragedNodePosition(e);
    });


    this.forceGraph.on('node:drag', (e) => {
      this.refreshDragedNodePosition(e);
    });
    this.forceGraph.on('node:mouseup', (evt) => {
      //   console.log("node mouseup")
      this.saveUndo();
      this.previous.unshift('node');
      this.current = "node";

      const { item } = evt;
      this.forceGraph.getNodes().forEach((item) => {
        this.forceGraph.clearItemStates(item);
      });
      this.forceGraph.getEdges().forEach((item) => {
        this.forceGraph.clearItemStates(item);
      });
      this.forceGraph.setItemState(item, 'selected', true);
      //console.log(item._cfg.id);
      //this.setState({isNode:true});
      var id = item._cfg.id;
      this.setState({ clickId: id });
      var nodescopy = cloneDeep(this.state.pathDate.nodes);
      // nodescopy.splice(nodescopy.length-1,1);
      if (this.state.clickId === '01') {
        this.labelSelected = "user";
        this.nodeClickedPath.push('user');
        this.setState({ isNode: true, clickLabel: "user" },
          () => {

            let objNode = {
              //id: (nodescopy.length).toString(), label: this.state.clickLabel+'1', x: 15 + (nodescopy.length) * 95, y: 55,
              id: "user" + (nodescopy.length).toString(), label: this.state.clickLabel, labelForCard: this.state.clickLabel, labelForQuery: this.state.clickLabel + '1', x: 21 + (nodescopy.length) * 120, y: 55,


              style: {
                fill: "#FF6666",
                stroke: "#1C1C1C"
              }
            }; nodescopy.push(objNode);
            //   let objNode2 = { id: (nodescopy.length).toString(), label: "", x: 15 + (nodescopy.length) * 95, y: 55,
            //     style: {
            //     fill: "#fff",
            //     stroke: "#fff"
            // } };
            //   nodescopy.push(objNode2);

            let data = Object.assign({}, this.state.pathDate, { nodes: nodescopy });

            this.setState({
              pathDate: data
            });
          }
        );
        //user
      }
      else if (this.state.clickId === '02') {
        this.labelSelected = "item";
        //item
        this.nodeClickedPath.push('item');
        this.setState({ isNode: true, clickLabel: "item" },
          () => {

            let objNode = {
              //id: (nodescopy.length).toString(), label: this.state.clickLabel+'1', x: 15 + (nodescopy.length) * 95, y: 55,
              id: "item" + (nodescopy.length).toString(), label: this.state.clickLabel, labelForCard: this.state.clickLabel, labelForQuery: this.state.clickLabel + '1', x: 21 + (nodescopy.length) * 120, y: 55,

              style: {
                fill: "#006699",
                stroke: "#1C1C1C"
              }
            }; nodescopy.push(objNode);
            //   let objNode2 = { id: (nodescopy.length).toString(), label: "", x: 15 + (nodescopy.length) * 95, y: 55,
            //     style: {
            //     fill: "#fff",
            //     stroke: "#fff"
            // } };
            //   nodescopy.push(objNode2);

            let data = Object.assign({}, this.state.pathDate, { nodes: nodescopy });

            this.setState({
              pathDate: data
            });
          });
      }
      else if (this.state.clickId === '03') {
        this.labelSelected = "category";
        //category
        this.nodeClickedPath.push('category');
        this.setState({ isNode: true, clickLabel: "category" },
          () => {

            let objNode = {
              // id: (nodescopy.length).toString(), label: this.state.clickLabel+'1', x: 15 + (nodescopy.length) * 95, y: 55,
              id: "category" + (nodescopy.length).toString(), label: this.state.clickLabel, labelForCard: this.state.clickLabel, labelForQuery: this.state.clickLabel + '1', x: 21 + (nodescopy.length) * 120, y: 55,

              style: {
                fill: "#FFFF00",
                stroke: "#1C1C1C"
              }
            }; nodescopy.push(objNode);
            //   let objNode2 = { id: (nodescopy.length).toString(), label: "", x: 15 + (nodescopy.length) * 95, y: 55,
            //     style: {
            //     fill: "#fff",
            //     stroke: "#fff"
            // } };
            //   nodescopy.push(objNode2);
            let data = Object.assign({}, this.state.pathDate, { nodes: nodescopy });

            this.setState({
              pathDate: data
            });
          });
      }


      axios.get(`http://localhost:8080/kaggle/combo/node/` + this.state.clickLabel)
        .then(res => {
          this.updateCombo = true;
          this.setState({ comboData: res.data });
          this.comboRecord = res.data;
          this.setPrompt();
        })
      axios.get(`http://localhost:8080/kaggle/list/node/` + this.state.clickLabel + '/1')
        .then(res => {

          this.setState({ nodeid: res.data }, () => { this.publishmsgNode(); });
        })/**/
      //this.getComboData();
    });

    this.forceGraph.on('edge:mouseup', (evt) => {
      this.saveUndo();
      //    console.log("undo", this.undo)
      this.previous.unshift('edge');
      this.current = "edge";
      const { item } = evt;
      this.forceGraph.getNodes().forEach((item) => {
        this.forceGraph.clearItemStates(item);
      });

      this.forceGraph.getEdges().forEach((item) => {
        this.forceGraph.clearItemStates(item);
      });
      this.forceGraph.setItemState(item, 'selected', true);
      //console.log(item._cfg);
      //console.log(item._cfg.model.label)

      // this.setState({});
      var label = item._cfg.model.label;
      var sourcelabel = "user";
      var targetlabel = "item";
      var edgescopy = cloneDeep(this.state.pathDate.edges);
      this.labelSelected = label;
      this.setState({ isNode: false, clickLabel: label });
      let addEdge=true;
      if (this.state.clickLabel === 'view') {
        //view
        sourcelabel = "user";
        targetlabel = "item";
      }
      else if (this.state.clickLabel === 'addtocart') {
        //addtocart
        sourcelabel = "user";
        targetlabel = "item";
      }
      else if (this.state.clickLabel === 'transaction') {
        //transaction
        sourcelabel = "user";
        targetlabel = "item";
      }
      else if (this.state.clickLabel === 'belongto') {
        //belongto
        sourcelabel = "item";
        targetlabel = "category";
        if (this.state.pathDate.nodes.length !== 0) {
          var nodescopy = cloneDeep(this.state.pathDate.nodes);
          //modify the label of the node
          nodescopy[nodescopy.length - 1].labelForCard = nodescopy[nodescopy.length - 1].labelForCard + "\n(--belongto)"
          if (this.state.pathDate.nodes[this.state.pathDate.nodes.length - 1].label.substring(0, 8) === "category") {
            // check the nb item in nodes
            let nb = 1
            if (typeof (this.statisticalFieldNumber(this.nodeClickedPath).item) !== "undefined") {
              nb = this.statisticalFieldNumber(this.nodeClickedPath).item + 1;
            }
            //创建一个Item
            let objNode = {
              // id: (nodescopy.length).toString(), label: "item"+nb, x: 15 + (nodescopy.length) * 95, y: 55,
              id: "item" + (nodescopy.length).toString(), label: "item", labelForCard: "item", labelForQuery: "item" + nb, x: 15 + (nodescopy.length) * 120, y: 55,
              style: {
                fill: "#006699",
                stroke: "#1C1C1C"
              }
            };
            nodescopy.push(objNode);
            this.nodeClickedPath.push("item")
            let data = Object.assign({}, this.state.pathDate, { nodes: nodescopy });
            this.setState({
              pathDate: data
            });
          }

          else if (this.state.pathDate.nodes[this.state.pathDate.nodes.length - 1].label.substring(0, 4) === "item") {
            //创建一个category
            // check the nb item in nodes
            let nb = 1
            if (typeof (this.statisticalFieldNumber(this.nodeClickedPath).category) !== "undefined") {
              nb = this.statisticalFieldNumber(this.nodeClickedPath).category + 1;
            }

            //category

            let objNode = {
              //id: (nodescopy.length).toString(), label: "category"+nb, x: 15 + (nodescopy.length) * 95, y: 55,
              id: "category" + (nodescopy.length).toString(), label: "category", labelForCard: "category", labelForQuery: "category" + nb, x: 15 + (nodescopy.length) * 120, y: 55,
              style: {
                fill: "#FFFF00",
                stroke: "#1C1C1C"
              }
            }; nodescopy.push(objNode);
            this.nodeClickedPath.push('category')
            let data = Object.assign({}, this.state.pathDate, { nodes: nodescopy });

            this.setState({
              pathDate: data
            });

          }
          else{
            addEdge=false;
            alert("Subgraph generation failed");
            
          }
        }
      }
      else if (this.state.clickLabel === 'subCategory') {
        //subCategory
        sourcelabel = "category";
        targetlabel = "category";
        if (this.state.pathDate.nodes.length !== 0) {

          var nodescopy = cloneDeep(this.state.pathDate.nodes);
          //modify the label of the node
          nodescopy[nodescopy.length - 1].labelForCard = nodescopy[nodescopy.length - 1].labelForCard + "\n(--subCategory)"
          if (this.state.pathDate.nodes[this.state.pathDate.nodes.length - 1].label.substring(0, 8) === "category") {
            //创建一个category
            // check the nb category in nodes
            let nb = 1
            if (typeof (this.statisticalFieldNumber(this.nodeClickedPath).category) !== "undefined") {
              nb = this.statisticalFieldNumber(this.nodeClickedPath).category + 1;
            }
            //category
            let objNode = {
              // id: (nodescopy.length).toString(), label: "category" + nb, x: 15 + (nodescopy.length) * 95, y: 55,
              id: "category" + (nodescopy.length).toString(), label: "category", labelForCard: "category", labelForQuery: "category" + nb, x: 15 + (nodescopy.length) * 120, y: 55,
              style: {
                fill: "#FFFF00",
                stroke: "#1C1C1C"
              }
            }; nodescopy.push(objNode);
            this.nodeClickedPath.push('category')
            let data = Object.assign({}, this.state.pathDate, { nodes: nodescopy });

            this.setState({
              pathDate: data
            });
          }else{
            addEdge=false;
            alert("Subgraph generation failed")
          };
         
    
        }

      }


      if (this.state.clickLabel === "view" | this.state.clickLabel === 'addtocart' | this.state.clickLabel === 'transaction') {
        //   console.log("eeeeee")
        if (this.state.pathDate.nodes.length !== 0) {
          var nodescopy = cloneDeep(this.state.pathDate.nodes);
          //modify the label of the node
          nodescopy[nodescopy.length - 1].labelForCard = nodescopy[nodescopy.length - 1].labelForCard + "\n(--" + this.state.clickLabel + ")"
          if (this.state.pathDate.nodes[this.state.pathDate.nodes.length - 1].label.substring(0, 4) === "user") {
            //创建一个Item

            // check the nb item in nodes
            let nb = 1
            if (typeof (this.statisticalFieldNumber(this.nodeClickedPath).item) !== "undefined") {
              nb = this.statisticalFieldNumber(this.nodeClickedPath).item + 1;
            }

            //item

            let objNode = {
              // id: (nodescopy.length).toString(), label: "item" + nb, x: 15 + (nodescopy.length) * 95, y: 55,
              id: "item" + (nodescopy.length).toString(), label: "item", labelForCard: "item", labelForQuery: "item" + nb, x: 15 + (nodescopy.length) * 120, y: 55,

              style: {
                fill: "#006699",
                stroke: "#1C1C1C"
              }
            };
            nodescopy.push(objNode);
            this.nodeClickedPath.push('item');
            let data = Object.assign({}, this.state.pathDate, { nodes: nodescopy });
            this.setState({
              pathDate: data
            });

          }
          else if (this.state.pathDate.nodes[this.state.pathDate.nodes.length - 1].label.substring(0, 4) === "item") {
            //创建一个user

            // check the nb user in nodes
            let nb = 1
            if (typeof (this.statisticalFieldNumber(this.nodeClickedPath).user) !== "undefined") {
              nb = this.statisticalFieldNumber(this.nodeClickedPath).user + 1;
            }

            let objNode = {
              // id: (nodescopy.length).toString(), label: "user" + nb, x: 15 + (nodescopy.length) * 95, y: 55,
              id: "user" + (nodescopy.length).toString(), label: "user", labelForCard: "user", labelForQuery: "user" + nb, x: 15 + (nodescopy.length) * 120, y: 55,

              style: {
                fill: "#FF6666",
                stroke: "#1C1C1C"
              }
            };
            nodescopy.push(objNode);
            this.nodeClickedPath.push("user");
            let data = Object.assign({}, this.state.pathDate, { nodes: nodescopy });

            this.setState({
              pathDate: data
            });
          }
          else{
            addEdge=false;
            alert("Subgraph generation failed");
          }
        }

      }
      if (this.state.pathDate.nodes.length !== 0 & addEdge==true) {
        let objEdge = {
          source: this.state.pathDate.nodes[this.state.pathDate.nodes.length - 2].id,
          target: this.state.pathDate.nodes[this.state.pathDate.nodes.length - 1].id,
          label: this.state.clickLabel,
          style: {
            stroke: "#1C1C1C"
          }
        };
        edgescopy.push(objEdge);
        // merge
        let data = Object.assign({}, this.state.pathDate, { edges: edgescopy });

        this.setState({
          pathDate: data
        });

      }
      axios.get(`http://localhost:8080/kaggle/combo/edge/` + this.state.clickLabel + `/` + sourcelabel + `/` + targetlabel)
        .then(res => {
          this.updateCombo = true;
          this.comboRecord = res.data;
          this.setState({ comboData: res.data });
          this.setPrompt();
        })
      axios.get(`http://localhost:8080/kaggle/list/edge/` + this.state.clickLabel + '/1')
        .then(res => {
          console.log("resr data",res.data);
          this.setState({ edgeid: res.data }, () => {console.log("edgeiddddd",this.state.edgeid.source);this.publishmsgEdge();  }); //
        })
    })

    this.forceGraph.on('canvas:click', (evt) => {


      this.forceGraph.getNodes().forEach((item) => {
        this.forceGraph.clearItemStates(item);
      });

      this.forceGraph.getEdges().forEach((item) => {
        this.forceGraph.clearItemStates(item);
      });
    })
    //combo graph
    const width = document.getElementById('combo').scrollWidth || 470;
    const height = document.getElementById('combo').scrollHeight || 600;
    this.comboGraph = new G6.Graph({
      container: document.getElementById('combo'),
      width,
      height,
      plugins: [contextMenu], //minimap,
      fitView: true,
      layout: {
        type: 'comboForce',
        nodeSpacing: (d) => 8,
        preventOverlap: true,
        preventComboOverlap: true,

      },
      // translate the comboGraph to align the canvas's center, support by v3.5.1
      fitCenter: true,
      // Set groupByTypes to false to get rendering result with reasonable visual zIndex for combos
      groupByTypes: false,
      modes: {


        default: ['drag-canvas', 'drag-node', 'drag-combo'],  //, 'zoom-canvas'
      },

      defaultCombo: {

        type: 'circle',
        //style for the keyShape 
        style: {
          lineWidth: 1,
        },

        labelCfg: {
          position: 'top',
        },
      },
      defaultNode: {
        type: 'circle',
        size: 25,
      },
    });
    this.comboGraph.addBehaviors(
      {
        type: 'collapse-expand-combo',
        relayout: false,
      },
    );
    this.comboGraph.data(this.state.comboData);
    // this.comboGraph.data(this.comboDataVir);
    this.comboGraph.render();
    this.comboGraph.on('combo:mouseenter', (evt) => {
      const { item } = evt;
      this.comboGraph.setItemState(item, 'active', true);
      this.idSelected = item._cfg.id;
      let reg = /[0-9]+/g;
      this.labelSelected = this.idSelected.replace(reg, "")
      //  console.log("idSelected", this.idSelected)
    });

    this.comboGraph.on('combo:mouseleave', (evt) => {
      const { item } = evt;

      //   console.log("idSelected", this.idSelected);
      this.comboGraph.setItemState(item, 'active', false);
    });
    // obtain the id of combo
    this.comboGraph.on('combo:mousedown', (evt) => {

      const { item } = evt;
      this.isCombo = true;
      this.isEdge = false;
      this.isNode = false;
      //  console.log("item", item._cfg.id)
      this.idSelected = item._cfg.id;
      let reg = /[0-9]+/g;
      this.labelSelected = this.idSelected.replace(reg, "")
      //  console.log("item", this.idSelected)
      this.comboGraph.setItemState(item, 'selected', true);
      this.handleDetails();
      //console.log(item._cfg.id)
    });
    //obtain the id of instance in the combo


    this.comboGraph.on('node:mouseenter', (evt) => {
      const { item } = evt;
      this.isCombo = false;
      this.isEdge = false;
      this.isNode = true;
      this.idSelected = item._cfg.id;
      //    console.log("idSelected", this.idSelected);
      this.comboGraph.setItemState(item, 'active', true);
      this.handleDetails();
    });

    this.comboGraph.on('node:mouseleave', (evt) => {
      const { item } = evt;
      //   console.log(item._cfg.states)
      if (item._cfg.states.length !== 2) {
        this.isCombo = false;
        this.isEdge = false;
        this.isNode = false;
        this.idSelected = "";
        //    console.log("idSelected", this.idSelected);
      }

      this.comboGraph.setItemState(item, 'active', false);
      this.handleDetails();
    });/**/
    this.comboGraph.on('node:mousedown', (evt) => {
      const { item } = evt;
      //   console.log(item)
      this.isCombo = false;
      this.isEdge = false;
      this.isNode = true;
      //     console.log("item", item)
      //this.setState({idSelected:item._cfg.id});    
      this.idSelected = item._cfg.id;
      //    console.log("idSelected", this.idSelected);
      this.comboGraph.setItemState(item, 'selected', true);
      this.handleDetails();
      // this.publishmsgComboData();     
    });

    this.comboGraph.on('edge:mouseenter', (evt) => {
      const { item } = evt;
      this.isCombo = false;
      this.isEdge = true;
      this.isNode = false;
      this.idSelected = item._cfg.id;
      //    console.log("idSelected", this.idSelected);
      this.comboGraph.setItemState(item, 'active', true);
      this.handleDetails();

    });

    this.comboGraph.on('edge:mouseleave', (evt) => {
      const { item } = evt;
      if (item._cfg.states.length !== 2) {
        this.isCombo = false;
        this.isEdge = false;
        this.isNode = false;
        this.idSelected = "";
        //    console.log("idSelected", this.idSelected);
      }
      this.comboGraph.setItemState(item, 'active', false);
      this.handleDetails();
    });/**/
    this.comboGraph.on('canvas:click', (evt) => {
      this.comboGraph.getCombos().forEach((combo) => {
        this.comboGraph.clearItemStates(combo);
      });
      this.comboGraph.getNodes().forEach((item) => {
        this.comboGraph.clearItemStates(item);
      });
      this.comboGraph.getEdges().forEach((item) => {
        this.comboGraph.clearItemStates(item);
      });

    })

    this.comboGraph.on('edge:mousedown', (evt) => {
      const { item } = evt;

      this.isEdge = true;
      this.isNode = false;
      this.isCombo = false;
      this.idSelected = item._cfg.id;
      this.comboGraph.setItemState(item, 'selected', true);
      this.handleDetails();
      //this.publishmsgComboData();    
    })

    //history graph

    const lightGreen = "#7FFF00";
    const lightOrange = "#FFB90F";
    const lightRed = "#FF0000";
    //const lightBlue = '#5b8ff9';

    // register a pie chart node
    G6.registerNode("pie-node", {
      draw: (cfg, group) => {
        const radius = cfg.size / 2; // node radius
        const inPercentage1 = 120 / cfg.degree; // the ratio of indegree to outdegree
        const inPercentage2 = 120 / cfg.degree; // the ratio of indegree to outdegree

        const inAngle1 = inPercentage1 * Math.PI * 2; // the anble for the indegree fan
        const inAngle2 = inPercentage2 * Math.PI * 2 + inAngle1; // the anble for the indegree fan

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
            fill: lightGreen
          },
          name: "out-fan-shape"
        });
        if (cfg.label) {
          group.addShape("text", {
            // attrs: style
            attrs: {

              textAlign: "center",
              textBaseline: "middle",
              text: cfg.label,
              fill: "white",

              fontStyle: "bold",

            },
            name: "text-shape"
          });
        }
        // 返回 keyshape
        return group;
      }
    });

    G6.registerNode('demi-node', {
      draw: (cfg, group) => {
        const radius = cfg.size / 2; // node radius
        const inPercentage = 180 / cfg.degree; // the ratio of indegree to outdegree
        const inAngle = inPercentage * Math.PI * 2; // the anble for the indegree fan
        const inArcEnd = [radius * Math.cos(inAngle), -radius * Math.sin(inAngle)]; // the end position for the in-degree fan
        let isInBigArc = 0,
          isOutBigArc = 1;
        if (inAngle > Math.PI) {
          isInBigArc = 1;
          isOutBigArc = 0;
        }
        // fan shape for the in degree
        const fanIn = group.addShape('path', {
          attrs: {
            path: [
              ['M', radius, 0],
              ['A', radius, radius, 0, isInBigArc, 0, inArcEnd[0], inArcEnd[1]],
              ['L', 0, 0],
              ['Z'],
            ],
            lineWidth: 0,
            fill: cfg.color1,
          },
          name: 'in-fan-shape',
        });
        // draw the fan shape
        group.addShape('path', {
          attrs: {
            path: [
              ['M', inArcEnd[0], inArcEnd[1]],
              ['A', radius, radius, 0, isOutBigArc, 0, radius, 0],
              ['L', 0, 0],
              ['Z'],
            ],
            lineWidth: 0,
            fill: cfg.color2,
          },
          name: 'out-fan-shape',
        });

        if (cfg.label) {
          group.addShape("text", {
            // attrs: style
            attrs: {

              textAlign: "center",
              textBaseline: "middle",
              text: cfg.label,
              fill: "white",

              fontStyle: "bold",

            },
            name: "text-shape"
          });
        }
        // 返回 keyshape
        return fanIn;
      },
    });

    const widthH = document.getElementById('history').scrollWidth || 600;
    const heightH = document.getElementById('history').scrollHeight || 300;
    this.historyGraph = new G6.Graph({
      container: document.getElementById('history'),
      width: widthH,
      height: heightH,
      plugins: [],
      // fitView: true,
      // translate the comboGraph to align the canvas's center, support by v3.5.1
      fitCenter: true,
      modes: {
        default: ['drag-canvas'],  //'drag-node', 'drag-combo', 'zoom-canvas'
      },
      defaultNode: {
        type: 'circle',
        style: {
          fill: "#FFFFFF",
          stroke: "#1E90FF",
          lineWidth: 1,
        }
      },
    });
    this.historyGraph.addBehaviors(
      {
        type: 'collapse-expand-combo',
        relayout: false,
      },
    );
    this.historyGraph.on('node:mousedown', (evt) => {
      this.historyGraph.getNodes().forEach((item) => {
        this.historyGraph.clearItemStates(item);
      });
      this.historyGraph.getEdges().forEach((item) => {
        this.historyGraph.clearItemStates(item);
      });
      this.updateCombo = false;
      const { item } = evt;
      this.historyGraph.setItemState(item, 'selected', true);
      let idClick = item._cfg.id;
      let id = 0;
      Object.values(this.state.historyData.nodes).map((value) => {
        value.id === idClick ? this.setState({ indexEtat: id }) : console.log(value, value.label, idClick);
        id = id + 1;
      })
    });
    this.historyGraph.on('canvas:click', (evt) => {
      this.historyGraph.getNodes().forEach((item) => {
        this.historyGraph.clearItemStates(item);
      });

      this.historyGraph.getEdges().forEach((item) => {
        this.historyGraph.clearItemStates(item);
      });

    });
    this.historyGraph.data(this.state.historyData);
    // this.comboGraph.data(this.comboDataVir);
    this.historyGraph.render();

  }


  statisticalFieldNumber = (arr) => {
    return arr.reduce(function (prev, next) {
      console.log("prev", prev)
      console.log("next", next)

      prev[next] = (prev[next] + 1) || 1;
      return prev;
    }, {});
  }

  activeBtn = () => {
    if (this.redo.length === 0) {
      this.cleredo = true;
    }
    if (this.undo.length === 1) {
      this.cleundo = true;
    }
    if (this.undo.length > 1) {
      this.cleundo = false;
    }
    if (this.redo.length >= 1) {
      this.cleredo = false;
    }
  }
  setPrompt = () => {
    if (this.state.comboData.nodes.length === 0) {
      this.setState({ record: "no record ┗( T﹏T )┛" })

    } else {
      this.setState({ record: "" })
    }

  }

  componentDidUpdate() {
    console.log("change data", this.updateCombo); 
    if (this.updateCombo) {
      if (typeof (this.state.comboData.edges) != 'undefined') {
        // if (typeof(this.comboDataVir.edges)!='undefined'){ 
        //    console.log("util process parallel ")
        G6.Util.processParallelEdges(this.state.comboData.edges);
      };
      // G6.Util.processParallelEdges(this.comboDataVir.edges);};

      (this.state.isNode === true) ? this.comboGraph.updateLayout({
        type: 'comboForce', nodeSpacing: (d) => 8,
        preventOverlap: true,
        preventComboOverlap: true,
      }) : this.comboGraph.updateLayout({
        // type: 'mds',
        // preventOverlap: true,
        type: 'radial',
        unitRadius: 120,
        preventOverlap: true,
        maxPreventOverlapIteration: 500,
      })

      console.log("updateCombo", this.updateCombo)
      this.comboGraph.changeData(this.state.comboData);
    }

    this.historyGraph.changeData(this.state.historyData);

    //this.comboGraph.changeData(this.comboDataVir);
    this.publishmsgPathData(this.state.pathDate);
    this.publishmsgPathDataToHeader(this.state.pathDate);


    this.pathGraph.changeData(this.state.pathDate);


  }
  //fruchterman
  refreshDragedNodePosition(e) {
    const model = e.item.get('model');
    model.fx = e.x;
    model.fy = e.y;
  };
  saveUndo = () => {

    let deepState = cloneDeep(this.state)
    this.undo.unshift(deepState);
    //console.log("after save undo", this.undo)
  }
  saveRedo = () => {

    let deepState = cloneDeep(this.state)
    this.redo.unshift(deepState);

  }

  contains(nodes, obj) {
    var i = nodes.length;
    while (i--) {
      if (nodes[i].id === obj) {
        return i;
      }
    }
    return false;
  }

  sortNumber(a, b) { return a - b }

  containsComboInNodes(nodes, obj) {
    var i = nodes.length;
    var list = [];
    while (i--) {
      if (nodes[i].comboId === obj) {
        list.push(i);
      }
    }
    list = list.sort(this.sortNumber);
    return list;
  }

  handleDetails() {
    let deepState = cloneDeep(this.state.comboData)
    if (this.isNode) {
      //const node = this.comboGraph.findById(this.idSelected);
      let id = this.contains(deepState.nodes, this.idSelected)

      //console.log(id, deepState.nodes[id])
      this.publishmsgComboData(deepState.nodes[id])
    } else if (this.isCombo) {
      //all the nodes of the selected combo
      const combo = this.comboGraph.findById(this.idSelected);
      // const nodesInCombo = combo.getNodes()
      //console.log(nodesInCombo)
      let idsInNodes = this.containsComboInNodes(deepState.nodes, this.idSelected);
      // console.log(idsInNodes);
      var total = 0;
      // condition : reponse order by itemid
      idsInNodes.forEach(id => {
        deepState.nodes = deepState.nodes.splice(id - total, 1);
        total++;
      });
      // console.log(idsInNodes, deepState.nodes)
      let idCombo = this.contains(deepState.combos, this.idSelected);
      deepState.combos = deepState.combos.splice(idCombo, 1);
      // console.log(idCombo, deepState.combos)
      //publish whatttt????
    } else if (this.isEdge) {
      let idEdge = this.contains(deepState.edges, this.idSelected)

      this.publishmsgComboData(deepState.edges[idEdge])
    }
    else {
      this.publishmsgComboData(null)

    }
  }

  handleDelete() {

    this.saveUndo();
    let deepState = cloneDeep(this.state.comboData)

    // console.log(deepState)
    console.log("this.idSelected", this.idSelected, this.isNode)

    if (this.isNode) {
      //  console.log(this.state)
      const node = this.comboGraph.findById(this.idSelected);
      // 找到对应的边 删除边
      const edges = node.getEdges();
      if (edges.length !== 0) {
        edges.forEach(edge => {
          //      console.log(edge);
          let idEdge = this.contains(deepState.edges, edge._cfg.id)
          deepState.edges.splice(idEdge, 1)
        });
      }
      let id = this.contains(deepState.nodes, this.idSelected)
      // console.log(id)
      deepState.nodes.splice(id, 1)
      this.updateCombo = true;
      this.comboRecord = deepState;
      this.setState({ comboData: deepState })
    } else if (this.isCombo) {
      //all the nodes of the selected combo
      const combo = this.comboGraph.findById(this.idSelected);

      const nodesInCombo = combo.getNodes()
      //   console.log(nodesInCombo)
      //找到所有的边 并删除
      let edgesRelevent = [];
      let idsInNodes = this.containsComboInNodes(deepState.nodes, this.idSelected);
      //  console.log(idsInNodes);
      nodesInCombo.forEach(idNode => {
        const node = this.comboGraph.findById(idNode._cfg.id);
        const edges = node.getEdges();
        edgesRelevent = edgesRelevent.concat(edges);
      });

      if (edgesRelevent.length !== 0) {
        edgesRelevent.forEach(edge => {
          //    console.log(edge);
          let idEdge = this.contains(deepState.edges, edge._cfg.id)
          deepState.edges.splice(idEdge, 1)
        });
      }
      var total = 0;
      // condition : reponse order by itemid
      idsInNodes.forEach(id => {
        deepState.nodes.splice(id - total, 1);
        total++;
      });
      let idCombo = this.contains(deepState.combos, this.idSelected);
      deepState.combos.splice(idCombo, 1);
      this.updateCombo = true;
      this.comboRecord = deepState;
      this.setState({ comboData: deepState })
    } else if (this.isEdge) {
      let idEdge = this.contains(deepState.edges, this.idSelected)
      deepState.edges.splice(idEdge, 1)
      this.updateCombo = true;
      this.comboRecord = deepState;
      this.setState({ comboData: deepState })
    }
  }

  handleHistory() {
    //  console.log("histttt", this.labelSelected)
    const nodeId = this.comboGraph.findById(this.idSelected)._cfg.id.replace(/[^0-9]/ig, "");
    this.updateCombo = false;
    axios.get(`http://localhost:8080/kaggle/nodehistory/` + this.labelSelected + `/` + nodeId)
      .then(res => {
        this.setState({ historyData: res.data["nodes"] });
        this.setState({ changesInfo: res.data["changes"] });

      });
    this.setState({ labelHistory: this.idSelected });
  }

  handleExpand(id, label, nameId) {

    //获取节点Id
    console.log("expand", id, label, nameId)
    //叫一个api
    http://localhost:8080/kaggle/combo/expand/15/item/itemid
    axios.get(`http://localhost:8080/kaggle/combo/expand/` + id + `/` + label + `/` + nameId)
      .then(res => {
        //将值加到comborecord上/或者是state上 可以保留原来的位置   注意删除重复的元素
        //combo buyongguan
        //node
        this.comboRecord=cloneDeep(this.state.comboData);
        if (res.data.nodes.length !== 0) {
          res.data.nodes.map((node) => {
            var result = this.comboRecord.nodes.some(item => item.id === node.idCombo) //have the same id
            if (!result) {
              // do something
              this.comboRecord.nodes.push(node);
            }
          })

        }
        //edge zhijiejia
        if (res.data.edges.length !== 0) {
          if (typeof (this.comboRecord.edges) !== "undefined") {
            res.data.edges.map((edge) => {
              this.comboRecord.edges.push(edge);
            })

          } else {
            var edges = [];
            //创建一个edges 加到comborecord里
            res.data.edges.map((edge) => {
              edges.push(edge);
            });
            let key = "edges";
            this.comboRecord[key] = edges;
          }
        }

        console.log("comboRecord", this.comboRecord)


        // 设置 state
        this.updateCombo = true;
        this.setState({isNode:false})
        this.setState({ comboData: this.comboRecord });
        this.setPrompt();
      });




  }
  handleTest = () => {
    //   console.log("handle test");
    axios.post('http://localhost:8080/kaggle/subgraph', this.state.pathDate)
      .then(res => {
        //     console.log('res=>', res.data);
        this.updateCombo = true;
        this.comboRecord = res.data;
        this.setState({ comboData: res.data })
        this.setPrompt();
      });

  }

  render() {
    console.log("state", this.state)
    this.activeBtn();
    return (
      <div className="App" style={{ position: 'relative' }}>
        {/* <button onClick={this.force()}></button>*/}
        <Header record={this.state.record} labelHistory={this.state.labelHistory} changesInfo={this.state.changesInfo} indexEtat={this.state.indexEtat} node={this.state.nodeid} edge={this.state.edgeid}></Header>

        <UndoButton handlerClick={this.handleUndo} cle={this.cleundo} ></UndoButton>
        <RedoButton handlerClick={this.handleRedo} cle={this.cleredo}></RedoButton>

        {/* <p className="App-intro">{this.state.apiResponse}</p>
        <button id="undo" onClick={this.handleUndo}>Undo</button>
        <button id="redo" onClick={this.handleRedo}>Redo</button>*/}
        <button style={{ position: 'fixed', top: '23%', left: '3.5%' }} onClick={this.handleTest} >Subgraph</button>

        <Footer></Footer>

      </div>
    )
  }
}



//import logo from './logo.svg';
import G6 from '@antv/g6';
import './App.css';
import { Footer, Header, CenteredGrid, UndoButton, RedoButton } from './components/Layout'
import axios from 'axios';
import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import cloneDeep from "lodash/cloneDeep";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.undo = [];
    this.redo = [];
    this.cleundo = true;
    this.cleredo = true;
    this.idSelected = "";
    this.isNode = false;
    this.isCombo = false;
    this.isEdge = false;
    this.previous = [];
    this.future = [];
    this.current = "";
    this.comboDataVir = {};
    //state
    this.state = {
      clickId: "",
      isNode: true,
      clickLabel: "",
      starttime: "",
      endtime: "",
      comboData: {
      },
      nodeid: {},
      edgeid: {},
      forceData: {
        nodes: [
          {
            id: '01',
            x: 50,
            y: 120,
            label: 'User',
            style: {
              fill: '	#FF6666',
              stroke: '#FF6666',
            },
          },
          {
            id: '02',
            x: 400,
            y: 150,
            label: 'Item',
            type: 'circle',
            style: {
              fill: '#006699',
              stroke: '#006699',
            },
          },
          {
            id: '03',
            x: 250,
            y: 100,
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

      },
      pathDate: { nodes: [], edges: [] },


    };//{ id: '0', label: 'test', x: 20, y: 55 }
    this.comboGraph = null;
    this.forceGraph = null;
    this.pathGraph = null;
  }

  //publish message
  publishmsgNode = () => {
    console.log("app publish", this.state.nodeid)
    PubSub.publish('NODE', this.state.nodeid);
  }
  publishmsgEdge = () => {
    console.log("app publish", this.state.edgeid)
    PubSub.publish('EDGE', this.state.edgeid);
  }
  publishmsgComboData = (dataselected) => {
    console.log("app publish")
    PubSub.publish('COMBODATA', dataselected);
  }

  // callAPI() {
  //   fetch("http://localhost:9000/testAPI")
  //     .then(res => res.text())
  //     .then(res => this.setState({ apiResponse: res }));
  //     console.log('api');
  // }
  /*   callAPI() {
      fetch("http://localhost:9000/testAPI")
        .then(res => res.text())
        .then(res => { console.log(res); });
  
    } */
  handleUndo = (e) => {
    e.preventDefault();
    this.saveRedo();
    //this.redo.unshift(this.state);
    this.setState({
      clickId: this.undo[0].clickId,
      isNode: this.undo[0].isNode,
      clickLabel: this.undo[0].clickLabel,
      comboData: this.undo[0].comboData,
      nodeid: this.undo[0].nodeid,
      edgeid: this.undo[0].edgeid,
      pathDate:this.undo[0].pathDate,
    }, () => {
      this.future.unshift(this.current); //0 current
      (this.previous[1] === "node") ? this.publishmsgNode() : this.publishmsgEdge();
      this.current = this.previous[1]
      this.previous.splice(1, 1);
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
      pathDate:this.redo[0].pathDate,
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
      console.log("date", stateObj);
      // axios.get(`http://localhost:8080/kaggle/time/` + this.state.clickLabel + `/time_get?st=` + stateObj[0] + `&et= ` + stateObj[1])
      //   .then(res => {
      //     console.log("DATE", `http://localhost:8080/kaggle/time/` + this.state.clickLabel + `/time_get?st=` + stateObj[0] + `&et=` + stateObj[1])
      //     this.setState({ comboData: res.data });

      //   });

        axios.post(`http://localhost:8080/kaggle/time/subgraph/validtime?st=` + stateObj[0] + `&et= ` + stateObj[1], this.state.pathDate)
        .then(res => {
          console.log("DATE", `http://localhost:8080/kaggle/time/subgraph/validtime?st=` + stateObj[0] + `&et= ` + stateObj[1])
          this.setState({ comboData: res.data });

        });

    });

    PubSub.subscribe('DAY', (_, stateObj) => {
      console.log("day", stateObj);

        axios.post(`http://localhost:8080/kaggle/time/subgraph/validtime?st=` + stateObj[0] + `&et= ` + stateObj[1], this.state.pathDate)
        .then(res => {
          console.log("day", `http://localhost:8080/kaggle/time/subgraph/validtime?st=` + stateObj[0] + `&et= ` + stateObj[1])
          this.setState({ comboData: res.data });

        });

    });

    PubSub.subscribe('ClickList', (_, stateObj) => {
      this.saveUndo();
      if (stateObj[0] === 'false') {
        axios.get(`http://localhost:8080/kaggle/` + stateObj[1].toLowerCase() + `/` + stateObj[2])
          .then(res => {
            this.setState({ comboData: res.data });

          });
      }
      else if (stateObj[0] === 'true') {
        axios.get(`http://localhost:8080/kaggle/edge/` + stateObj[5].toLowerCase() + `/` + stateObj[1].toLowerCase() + '/' + stateObj[3] + '/' + stateObj[2].toLowerCase() + '/' + stateObj[4])
          .then(res => {
            this.setState({ comboData: res.data });
            //this.comboDataVir.cloneDeep(this.state.comboData)
          });
      }
    });



    // this.callAPI();

    //plugins of graph
    const tooltipForce = new G6.Tooltip({
      offsetX: 10,
      offsetY: 10,
      // the types of items that allow the tooltip show up
      itemTypes: ['node', 'edge'],
      // custom the tooltip's content
      getContent: (e) => {
        const outDiv = document.createElement('div');
        outDiv.style.width = 'fit-content';
        //outDiv.style.padding = '0px 0px 20px 0px';

        outDiv.innerHTML = `
        <h4>Info</h4>
        <ul>
          <li>Type: ${e.item.getType()}</li>
        </ul>
        <ul>
          <li>Label: ${e.item.getModel().label}</li>
        </ul>`;
        return outDiv;
      },
    });
    const tooltipCombo = new G6.Tooltip({
      offsetX: 10,
      offsetY: 10,

      // the types of items that allow the tooltip show up
      itemTypes: ['combo'],
      // custom the tooltip's content
      getContent: (e) => {
        const outDiv = document.createElement('div');
        outDiv.style.width = 'fit-content';
        //outDiv.style.padding = '0px 0px 20px 0px';
        outDiv.innerHTML = `
        <h4>Info</h4>
        <ul>
        <li>Id: ${e.item.getModel().id}</li>
      </ul>
        <ul>
          <li>Type: ${e.item.getType()}</li>
        </ul>
        <ul>
          <li>Label: ${e.item.getModel().label}</li>
        </ul>`;
        return outDiv;
      },
    });
    const tooltipNode = new G6.Tooltip({
      offsetX: 10,
      offsetY: 10,

      // the types of items that allow the tooltip show up
      itemTypes: ['node'],
      // custom the tooltip's content
      getContent: (e) => {
        const outDiv = document.createElement('div');
        outDiv.style.width = 'fit-content';
        //outDiv.style.padding = '0px 0px 20px 0px';
        var attributesList = "";
        Object.keys(e.item.getModel().attributes).forEach(key => {
          if (key !== "startvalidtime" & key !== "endvalidtime") {
            attributesList = attributesList + "<ul><li>" + key + ":" + e.item.getModel().attributes[key] + "</li></ul>";
          }
          return attributesList;
        })

        outDiv.innerHTML = `
        <h4>Info</h4>
        <ul>
        <li>Id: ${e.item.getModel().id}</li>
      </ul>
        <ul>
          <li>InstanceId: ${e.item.getModel().instanceid}</li>
        </ul>
        <ul>
        <li>EntityId: ${e.item.getModel().comboId}</li>
      </ul>
        <ul>
        <li>Startvalidtime: ${e.item.getModel().startvalidtime}</li>
      </ul>
      <ul>
      <li>Endvalidtime: ${e.item.getModel().endvalidtime}</li>
    </ul>
      `+ attributesList;
        return outDiv;
      },
    });
    const tooltipEdge = new G6.Tooltip({
      offsetX: 10,
      offsetY: 10,

      // the types of items that allow the tooltip show up
      itemTypes: ['edge'],
      // custom the tooltip's content
      getContent: (e) => {
        const outDiv = document.createElement('div');

        outDiv.style.width = 'fit-content';
        //outDiv.style.padding = '0px 0px 20px 0px';
        var attributesList = "";
        Object.keys(e.item.getModel().attributes).forEach(key => {
          if (key !== "startvalidtime" & key !== "endvalidtime") {
            attributesList = attributesList + "<ul><li>" + key + ":" + e.item.getModel().attributes[key] + "</li></ul>";
          }
          return attributesList;
        })

        outDiv.innerHTML = `
        <h4>Info</h4>
        <ul>
        <li>Id: ${e.item.getModel().id}</li>
      </ul>
      <ul>
      <li>Type: ${e.item.getModel().typeEdge}</li>
    </ul>
        <ul>
          <li>SourceId: ${e.item.getModel().source}</li>
        </ul>
        <ul>
        <li>TargetId: ${e.item.getModel().target}</li>
      </ul>

        <ul>
        <li>Startvalidtime: ${e.item.getModel().attributes.startvalidtime}</li>
      </ul>
      <ul>
      <li>Endvalidtime: ${e.item.getModel().attributes.endvalidtime}</li>
    </ul>
      `+ attributesList;
        return outDiv;
      },
    });
    const contextMenu = new G6.Menu({

      getContent(evt) {
        let header;
        if (evt.target && evt.target.isCanvas && evt.target.isCanvas()) {
          console.log(evt.target.isCanvas())
          header = 'Canvas ContextMenu';
        }
        else if (evt.item) {
          const itemType = evt.item.getType();
          console.log(evt);
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
      <div align="left"><button class=" btnInMenu" >Details</button></div>`;
      },

      handleMenuClick: (target, item) => {
        console.log(target.innerText, item);
        if (target.innerText === "Delete") {
          this.handleDelete();
        } else if (target.innerText === "Detail") {


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
    const minimap = new G6.Minimap({
      size: [150, 100],
    });

    //path graph
    this.pathGraph = new G6.Graph({
      container: "path",
      width: 3000,
      height: document.getElementById('path').scrollHeight || 200,
      defaultNode: {
        shape: "circle",
        size: [25],

        style: {
          lineWidth: 1
        },

        labelCfg: {
          style: {
            fill: "#fff",
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
      console.log("node mouseup")
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
        this.setState({ isNode: true, clickLabel: "user" },
          () => {

            let objNode = {
              id: (nodescopy.length).toString(), label: this.state.clickLabel, x: 15 + (nodescopy.length) * 95, y: 55,
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
        //item
        this.setState({ isNode: true, clickLabel: "item" },
          () => {

            let objNode = {
              id: (nodescopy.length).toString(), label: this.state.clickLabel, x: 15 + (nodescopy.length) * 95, y: 55,
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
        //category
        this.setState({ isNode: true, clickLabel: "category" },
          () => {

            let objNode = {
              id: (nodescopy.length).toString(), label: this.state.clickLabel, x: 15 + (nodescopy.length) * 95, y: 55,
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


      axios.get(`http://localhost:8080/kaggle/combo/` + this.state.clickLabel)
        .then(res => {
          this.setState({ comboData: res.data });
        })
      axios.get(`http://localhost:8080/kaggle/node/` + this.state.clickLabel + '/1')
        .then(res => {

          this.setState({ nodeid: res.data }, () => { this.publishmsgNode(); });
        })/**/
      //this.getComboData();
    });

    this.forceGraph.on('edge:mouseup', (evt) => {
      this.saveUndo();
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
      this.setState({ isNode: false, clickLabel: label });

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
        if (this.state.pathDate.nodes[this.state.pathDate.nodes.length - 1].label === "category") {
          //创建一个Item
          var nodescopy = cloneDeep(this.state.pathDate.nodes);
          //item

              let objNode = {
                id: (nodescopy.length).toString(), label: "item", x: 15 + (nodescopy.length) * 95, y: 55,
                style: {
                  fill: "#006699",
                  stroke: "#1C1C1C"
                }
              };
              nodescopy.push(objNode);
              let data = Object.assign({}, this.state.pathDate, { nodes: nodescopy });
              this.setState({
                pathDate: data
              });
        }

        else if (this.state.pathDate.nodes[this.state.pathDate.nodes.length - 1].label === "item") {
          //创建一个category
          var nodescopy = cloneDeep(this.state.pathDate.nodes);
             //category
        
               let objNode = { id: (nodescopy.length).toString(), label: "category", x: 15 + (nodescopy.length) * 95, y: 55,
                 style: {
                 fill: "#FFFF00",
                 stroke: "#1C1C1C"
             } };nodescopy.push(objNode);
               let data = Object.assign({}, this.state.pathDate, { nodes: nodescopy });
     
               this.setState({
                 pathDate: data
               });

        }
      }
      else if (this.state.clickLabel === 'subCategory') {
        //subCategory
        sourcelabel = "category";
        targetlabel = "category";
        if (this.state.pathDate.nodes[this.state.pathDate.nodes.length - 1].label === "category") {
          //创建一个category
          var nodescopy = cloneDeep(this.state.pathDate.nodes);
          //category
            let objNode = { id: (nodescopy.length).toString(), label: "category", x: 15 + (nodescopy.length) * 95, y: 55,
              style: {
              fill: "#FFFF00",
              stroke: "#1C1C1C"
          } };nodescopy.push(objNode);
            let data = Object.assign({}, this.state.pathDate, { nodes: nodescopy });
  
            this.setState({
              pathDate: data
            });
        };
        }
      

      if (this.state.clickLabel === "view" | this.state.clickLabel === 'addtocart' | this.state.clickLabel === 'transaction') {
        console.log("eeeeee",this.state.pathDate.nodes)
        if (this.state.pathDate.nodes[this.state.pathDate.nodes.length - 1].label === "user") {
          //创建一个Item
          var nodescopy = cloneDeep(this.state.pathDate.nodes);
          //item

              let objNode = {
                id: (nodescopy.length).toString(), label: "item", x: 15 + (nodescopy.length) * 95, y: 55,
                style: {
                  fill: "#006699",
                  stroke: "#1C1C1C"
                }
              };
              nodescopy.push(objNode);
              let data = Object.assign({}, this.state.pathDate, { nodes: nodescopy });
              this.setState({
                pathDate: data
              });
        }
        else if (this.state.pathDate.nodes[this.state.pathDate.nodes.length - 1].label === "item") {
          //创建一个user
          var nodescopy = cloneDeep(this.state.pathDate.nodes);
          let objNode = {
            id: (nodescopy.length).toString(), label: "user", x: 15 + (nodescopy.length) * 95, y: 55,
            style: {
              fill: "#FF6666",
              stroke: "#1C1C1C"
            }
          }; 
          nodescopy.push(objNode);
          let data = Object.assign({}, this.state.pathDate, { nodes: nodescopy });

          this.setState({
            pathDate: data
          });
        }
      }

      let objEdge = {
        source: this.state.pathDate.nodes[this.state.pathDate.nodes.length - 2].id, target: this.state.pathDate.nodes[this.state.pathDate.nodes.length - 1].id, label: this.state.clickLabel,
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


      axios.get(`http://localhost:8080/kaggle/combo/` + this.state.clickLabel + `/` + sourcelabel + `/` + targetlabel)
        .then(res => {
          this.setState({ comboData: res.data });
        })
      axios.get(`http://localhost:8080/kaggle/edge/` + this.state.clickLabel + '/1')
        .then(res => {
          this.setState({ edgeid: res.data }, () => { this.publishmsgEdge(); });
        })
    })

    this.forceGraph.on('canvas:click', (evt) => {
      console.log(typeof (contextMenu)) //contextmenu的类型

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
      plugins: [contextMenu], //minimap
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


        default: ['drag-canvas', 'drag-node', 'drag-combo', 'zoom-canvas'],  //
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
    });

    this.comboGraph.on('combo:mouseleave', (evt) => {
      const { item } = evt;
      this.comboGraph.setItemState(item, 'active', false);
    });
    // obtain the id of combo
    this.comboGraph.on('combo:mousedown', (evt) => {

      const { item } = evt;
      this.isCombo = true;
      this.isEdge = false;
      this.isNode = false;
      console.log("item", item._cfg.id)
      this.idSelected = item._cfg.id;
      console.log("item", this.idSelected)
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
      this.comboGraph.setItemState(item, 'active', true);
      this.handleDetails();
    });

    this.comboGraph.on('node:mouseleave', (evt) => {
      const { item } = evt;
      console.log(item._cfg.states)
      if (item._cfg.states.length !== 2) {
        this.isCombo = false;
        this.isEdge = false;
        this.isNode = false;
        this.idSelected = "";
      }

      this.comboGraph.setItemState(item, 'active', false);
      this.handleDetails();
    });/**/
    this.comboGraph.on('node:mousedown', (evt) => {
      const { item } = evt;
      console.log(item)
      this.isCombo = false;
      this.isEdge = false;
      this.isNode = true;
      console.log("item", item)
      //this.setState({idSelected:item._cfg.id});    
      this.idSelected = item._cfg.id;
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

  componentDidUpdate() {
    console.log("change data");
    if (typeof (this.state.comboData.edges) != 'undefined') {
      // if (typeof(this.comboDataVir.edges)!='undefined'){ 
      console.log("util process parallel ")
      G6.Util.processParallelEdges(this.state.comboData.edges);
    };
    // G6.Util.processParallelEdges(this.comboDataVir.edges);};

    (this.state.isNode === true) ? this.comboGraph.updateLayout({
      type: 'comboForce', nodeSpacing: (d) => 8,
      preventOverlap: true,
      preventComboOverlap: true,
    }) : this.comboGraph.updateLayout({
      type: 'random',
      preventOverlap: true,
    })

    this.comboGraph.changeData(this.state.comboData);
    //this.comboGraph.changeData(this.comboDataVir);
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
      const node = this.comboGraph.findById(this.idSelected);
      let id = this.contains(deepState.nodes, this.idSelected)

      console.log(id, deepState.nodes[id])
      this.publishmsgComboData(deepState.nodes[id])
    } else if (this.isCombo) {
      //all the nodes of the selected combo
      const combo = this.comboGraph.findById(this.idSelected);
      const nodesInCombo = combo.getNodes()
      console.log(nodesInCombo)
      let idsInNodes = this.containsComboInNodes(deepState.nodes, this.idSelected);
      console.log(idsInNodes);
      var total = 0;
      // condition : reponse order by itemid
      idsInNodes.forEach(id => {
        deepState.nodes = deepState.nodes.splice(id - total, 1);
        total++;
      });
      console.log(idsInNodes, deepState.nodes)
      let idCombo = this.contains(deepState.combos, this.idSelected);
      deepState.combos = deepState.combos.splice(idCombo, 1);
      console.log(idCombo, deepState.combos)
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

    console.log(deepState)
    if (this.isNode) {
      console.log(this.state)
      const node = this.comboGraph.findById(this.idSelected);
      // 找到对应的边 删除边
      const edges = node.getEdges();
      if (edges.length !== 0) {
        edges.forEach(edge => {
          console.log(edge);
          let idEdge = this.contains(deepState.edges, edge._cfg.id)
          deepState.edges.splice(idEdge, 1)
        });
      }
      let id = this.contains(deepState.nodes, this.idSelected)
      console.log(id)
      deepState.nodes.splice(id, 1)
      this.setState({ comboData: deepState })
    } else if (this.isCombo) {
      //all the nodes of the selected combo
      const combo = this.comboGraph.findById(this.idSelected);
      const nodesInCombo = combo.getNodes()
      console.log(nodesInCombo)
      //找到所有的边 并删除
      let edgesRelevent = [];
      let idsInNodes = this.containsComboInNodes(deepState.nodes, this.idSelected);
      console.log(idsInNodes);
      nodesInCombo.forEach(idNode => {
        const node = this.comboGraph.findById(idNode._cfg.id);
        const edges = node.getEdges();
        edgesRelevent = edgesRelevent.concat(edges);
      });

      if (edgesRelevent.length !== 0) {
        edgesRelevent.forEach(edge => {
          console.log(edge);
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
      this.setState({ comboData: deepState })
    } else if (this.isEdge) {
      let idEdge = this.contains(deepState.edges, this.idSelected)
      deepState.edges.splice(idEdge, 1)
      this.setState({ comboData: deepState })
    }
  }
  handleTest = () => {
    console.log("handle test");
    axios.post('http://localhost:8080/kaggle/getBody', this.state.pathDate)
      .then(res => {
        console.log('res=>', res.data);
        this.setState({ comboData: res.data })
      });

  }

  render() {
    console.log("state", this.state)
    this.activeBtn();
    return (
      <div className="App" style={{ position: 'relative' }}>
        {/* <button onClick={this.force()}></button>*/}<Header  ></Header>
        <UndoButton handlerClick={this.handleUndo} cle={this.cleundo} style={{position:'fixed'}}></UndoButton>
        <RedoButton handlerClick={this.handleRedo} cle={this.cleredo}></RedoButton>
        <CenteredGrid clickId={this.state.clickId} clickLabel={this.state.clickLabel}> </CenteredGrid>

        {/* <p className="App-intro">{this.state.apiResponse}</p>
        <button id="undo" onClick={this.handleUndo}>Undo</button>
        <button id="redo" onClick={this.handleRedo}>Redo</button>*/}
        <button style={{ position: 'fixed', top: '23%', left: '3.5%' }} onClick={this.handleTest} >for test</button>

        <Footer></Footer>

      </div>
    )
  }
}



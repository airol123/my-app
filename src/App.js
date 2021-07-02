import logo from './logo.svg';
import G6 from '@antv/g6';
import './App.css';
import { Footer, Header, CenteredGrid } from './components/Layout'
import axios from 'axios';

import React,{ Component } from 'react'
import ReactDOM from 'react-dom';



export default class App extends Component {
  constructor(props) {
    super(props);
    //state
    this.state = {
      clickId:"",
      clickLabel:"",
      nbClique:0,
      apiResponse: "",
      comboData: {
        nodes: [
          {
            id: 'node1',
            x: 200,
            y: 110,
            comboId: 'item',
            date: parseInt('20200202')
          },
          {
            id: 'node2',
            x: 100,
            y: 110,
            comboId: 'user',
          },
          {
            id: 'node3',
            x: 200,
            y: 100,
            comboId: 'item',
          },
          {
            id: 'node4',
            x: 100,
            y: 100,
            comboId: 'user',
          },
          {
            id: 'node5',
            x: 200,
            y: 120,
            comboId: 'item',
          },
          {
            id: 'node6',
            x: 100,
            y: 120,
            comboId: 'user',
          },
        ],
        edges: [{
          source: 'node1',
          target: 'node2',
          type: 'line',
        },
        {
          source: 'node3',
          target: 'node4',
          type: 'line',
        },
        {
          source: 'node3',
          target: 'node6',
          type: 'line',
        }
        ],
        combos: [
          {
            id: 'item',
            label: 'item',
          },
          {
            id: 'user',
            label: 'user',
          },
        ]
      },
      userData: {
        nodes: [
          {
            id: 'node1',
            x: 200,
            y: 110,
            comboId: 'user1',

          },
          {
            id: 'node2',
            x: 100,
            y: 110,
            comboId: 'user2',
          },
          {
            id: 'node3',
            x: 200,
            y: 100,
            comboId: 'user3',
          },
        ],
        combos: [
          {
            id: 'user1',
            label: 'user1',
          },
          {
            id: 'user2',
            label: 'user2',
          },
          {
            id: 'user3',
            label: 'user3',
          },
        ]
      },
      categoryData: {
        nodes: [
          {
            id: 'node1',
            x: 200,
            y: 110,
            comboId: 'category1',

          },
          {
            id: 'node2',
            x: 100,
            y: 110,
            comboId: 'category2',
          },
          {
            id: 'node3',
            x: 200,
            y: 100,
            comboId: 'category3',
          },
        ],
        combos: [
          {
            id: 'category1',
            label: 'category1',
          },
          {
            id: 'category2',
            label: 'category2',
          },
          {
            id: 'category3',
            label: 'category3',
          },
        ]
      },
      itemData: {
        nodes: [
          {
            id: 'node1',
            x: 200,
            y: 110,
            comboId: 'item1',

          },
          {
            id: 'node4',
            x: 200,
            y: 130,
            comboId: 'item1',

          },
          {
            id: 'node2',
            x: 100,
            y: 110,
            comboId: 'item2',
          },
          {
            id: 'node3',
            x: 200,
            y: 100,
            comboId: 'item3',
          },
        ],
        combos: [
          {
            id: 'item1',
            label: 'item1',
          },
          {
            id: 'item2',
            label: 'item2',
          },
          {
            id: 'item3',
            label: 'item3',
          },
        ]
      },
      viewData: {
        nodes: [
          {
            id: 'i01',
            x: 200,
            y: 110,
            comboId: 'item',
          },
          {
            id: 'u01',
            x: 100,
            y: 110,
            comboId: 'user',
          },
          {
            id: 'i02',
            x: 200,
            y: 100,
            comboId: 'item',
          },
          {
            id: 'u02',
            x: 100,
            y: 100,
            comboId: 'user',
          },
          {
            id: 'i03',
            x: 200,
            y: 120,
            comboId: 'item',
          },
          {
            id: 'u03',
            x: 100,
            y: 120,
            comboId: 'user',
          },
        ],
        edges: [{
          source: 'i01',
          target: 'u01',

        },
        {
          source: 'i02',
          target: 'u02',

        },
        {
          source: 'i03',
          target: 'u03',
        },
        {
          source: 'i03',
          target: 'u01',
        }
        ],
        combos: [
          {
            id: 'item',
            label: 'item',
          },
          {
            id: 'user',
            label: 'user',
          },
        ]
      },
      addtocartData: {
        nodes: [
          {
            id: 'i01',
            x: 200,
            y: 110,
            comboId: 'item',
          },
          {
            id: 'u01',
            x: 100,
            y: 110,
            comboId: 'user',
          },
          {
            id: 'i02',
            x: 200,
            y: 100,
            comboId: 'item',
          },
          {
            id: 'u02',
            x: 100,
            y: 100,
            comboId: 'user',
          },
          {
            id: 'i03',
            x: 200,
            y: 120,
            comboId: 'item',
          },
          {
            id: 'u03',
            x: 100,
            y: 120,
            comboId: 'user',
          },
        ],
        edges: [{
          source: 'i01',
          target: 'u01',

        },
        {
          source: 'i02',
          target: 'u02',

        },
        {
          source: 'i03',
          target: 'u03',
        },
        {
          source: 'i03',
          target: 'u01',
        }
        ],
        combos: [
          {
            id: 'item',
            label: 'item',
          },
          {
            id: 'user',
            label: 'user',
          },
        ]
      },
      transactionData: {
        nodes: [
          {
            id: 'i01',
            x: 200,
            y: 110,
            comboId: 'item',
          },
          {
            id: 'u01',
            x: 100,
            y: 110,
            comboId: 'user',
          },
          {
            id: 'i02',
            x: 200,
            y: 100,
            comboId: 'item',
          },
          {
            id: 'u02',
            x: 100,
            y: 100,
            comboId: 'user',
          },
          {
            id: 'i03',
            x: 200,
            y: 120,
            comboId: 'item',
          },
          {
            id: 'u03',
            x: 100,
            y: 120,
            comboId: 'user',
          },
        ],
        edges: [{
          source: 'i01',
          target: 'u01',

        },
        {
          source: 'i02',
          target: 'u02',

        },
        {
          source: 'i03',
          target: 'u03',
        },
        {
          source: 'i03',
          target: 'u01',
        }
        ],
        combos: [
          {
            id: 'item',
            label: 'item',
          },
          {
            id: 'user',
            label: 'user',
          },
        ]
      },
      belongtoData: {
        nodes: [
          {
            id: 'i01',
            x: 200,
            y: 110,
            comboId: 'item',
          },
          {
            id: 'c01',
            x: 100,
            y: 110,
            comboId: 'category',
          },
          {
            id: 'i02',
            x: 200,
            y: 100,
            comboId: 'item',
          },
          {
            id: 'c02',
            x: 100,
            y: 100,
            comboId: 'category',
          },
          {
            id: 'i03',
            x: 200,
            y: 120,
            comboId: 'item',
          },
          {
            id: 'c03',
            x: 100,
            y: 120,
            comboId: 'category',
          },
        ],
        edges: [{
          source: 'i01',
          target: 'c01',

        },
        {
          source: 'i02',
          target: 'c02',

        },
        {
          source: 'i03',
          target: 'c03',
        },
        {
          source: 'i03',
          target: 'c01',
        }
        ],
        combos: [
          {
            id: 'item',
            label: 'item',
          },
          {
            id: 'category',
            label: 'category',
          },
        ]
      },
      subCategoryData: {
        nodes: [
          {
            id: 'c01',
            x: 200,
            y: 110,
            comboId: 'category',
          },
          {
            id: 'c02',
            x: 100,
            y: 110,
            comboId: 'category',
          },
          {
            id: 'c03',
            x: 200,
            y: 100,
            comboId: 'category',
          },
          {
            id: 'c04',
            x: 100,
            y: 100,
            comboId: 'category',
          },
          {
            id: 'c05',
            x: 200,
            y: 120,
            comboId: 'category',
          },
          {
            id: 'c06',
            x: 100,
            y: 120,
            comboId: 'category',
          },
        ],
        edges: [{
          source: 'c01',
          target: 'c06',

        },
        {
          source: 'c02',
          target: 'c06',

        },
        {
          source: 'c03',
          target: 'c06',
        },
        {
          source: 'c04',
          target: 'c05',
        }
        ],
        combos: [

          {
            id: 'category',
            label: 'category',
          },
        ]
      },
      forceData: {
        nodes: [
          {
            id: '01',
            x: 50,
            y: 120,
            label: 'User',
          },
          {
            id: '02',
            x: 400,
            y: 150,
            label: 'Item',
            type: 'diamond'
          },
          {
            id: '03',
            x: 250,
            y: 100,
            label: 'Category',
          },
        ],
        edges: [{
          source: '01',
          target: '02',
          label: 'addtocart',
        },
        {
          source: '02',
          target: '03',
          label: 'belongto',
        },
        {
          source: '03',
          target: '03',
          label: 'subCategory',
          type: 'loop'
        }
          ,
        {
          source: '01',
          target: '02',
          label: 'view',
        },
        {
          source: '01',
          target: '02',
          label: 'transaction',
        }
        ],

      }

    };
    this.comboGraph = null;
    this.forceGraph = null;
  }

  // callAPI() {
  //   fetch("http://localhost:9000/testAPI")
  //     .then(res => res.text())
  //     .then(res => this.setState({ apiResponse: res }));
  //     console.log('api');
  // }
  callAPI() {
    fetch("http://localhost:9000/testAPI")
      .then(res => res.text())
      .then(res => { console.log(res); });

  }
  handleClick(e) {
    e.preventDefault();
    axios.get(`http://localhost:8080/user/demo1`)
      .then(res => {
        const persons = res.data;
        console.log(persons);
      })
  }

  componentDidMount() {
   // this.callAPI();
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
          <li>Label: ${e.item.getModel().label || e.item.getModel().id}</li>
        </ul>`;
      return outDiv;
    },
  });
  const tooltipCombo = new G6.Tooltip({
    offsetX: 10,
    offsetY: 10,
    // the types of items that allow the tooltip show up
    itemTypes: ['node', 'edge','combo'],
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
          <li>Label: ${e.item.getModel().label || e.item.getModel().id}</li>
        </ul>`;
      return outDiv;
    },
  });
    // force graph
    G6.Util.processParallelEdges(this.state.forceData.edges);
    const widthF = document.getElementById('force').scrollWidth || 500;
    const heightF = document.getElementById('force').scrollHeight || 500;
    this.forceGraph = new G6.Graph(
      {
        container: document.getElementById('force'),
        width: widthF,
        height: heightF,
        plugins: [tooltipForce],
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
            // fill: '#steelblue',
            //stroke: 'red',
            lineWidth: 2,
          },

        }
      }
    );
    this.forceGraph.edge((edge) => {
      if (edge.label == 'view' || edge.label == 'transaction' || edge.label == 'addtocart') {
        return {
          id: edge.id,
          style: {
            lineDash: [2, 2],
            lineWidth: 2.5,
          },
        };
      }
      else {
        return {
          id: edge.id,
          style: {
            lineWidth: 2.5,

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
    this.forceGraph.on('node:mousedown', (evt) => {
      const { item } = evt;
      this.forceGraph.setItemState(item, 'selected', true);
      //console.log(item);
      //console.log(item._cfg.id);
     
      var id = item._cfg.id;
      this.setState({nbClique:this.state.nbClique+1})
      this.setState({clickId:id});
      if (this.state.clickId == '01') {
        //user
        this.comboGraph.changeData(this.state.userData);
      }
      else if (this.state.clickId == '02') {
        //item
        this.comboGraph.changeData(this.state.itemData);
      }
      else if (this.state.clickId == '03') {
        //category
        this.comboGraph.changeData(this.state.categoryData);
      }

    });

    this.forceGraph.on('edge:mousedown', (evt) => {
      const { item } = evt;
      this.forceGraph.setItemState(item, 'selected', true);
      //console.log(item._cfg);
      //console.log(item._cfg.model.label)

      var label = item._cfg.model.label;
      //this.setState({nbClique:this.state.nbClique+1})
      this.setState({clickLabel:label});
      if (this.state.clickLabel == 'view') {
        //view
        this.comboGraph.changeData(this.state.viewData);
      }
      else if (this.state.clickLabel == 'addtocart') {
        //addtocart
        this.comboGraph.changeData(this.state.addtocartData);
      }
      else if (this.state.clickLabel == 'transaction') {
        //transaction
        this.comboGraph.changeData(this.state.transactionData);
      }
      else if (this.state.clickLabel == 'belongto') {
        //belongto
        this.comboGraph.changeData(this.state.belongtoData);
      }
      else if (this.state.clickLabel == 'subCategory') {
        //subCategory
        this.comboGraph.changeData(this.state.subCategoryData);
      }
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
      const width = document.getElementById('combo').scrollWidth || 500;
      const height = document.getElementById('combo').scrollHeight || 500;
      this.comboGraph = new G6.Graph({
        container: document.getElementById('combo'),
        width,
        height,
        plugins: [tooltipCombo],
       // fitView: true,
        // translate the comboGraph to align the canvas's center, support by v3.5.1
        fitCenter: true,
        // Set groupByTypes to false to get rendering result with reasonable visual zIndex for combos
        groupByTypes: false,
        modes: {
          default: ['drag-canvas', 'drag-node', 'drag-combo', 'collapse-expand-combo'],
        },
        defaultCombo: {
  
          type: 'circle',
          //style for the keyShape 
          style: {
            lineWidth: 1,
          },
          defaultNode: {
            size: 50,
          },
          labelCfg: {
            position: 'top',
          },
        },
      });
     
      this.comboGraph.data(this.state.itemData);
  
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
      this.comboGraph.on('combo:click', (evt) => {
        const { item } = evt;
        this.comboGraph.setItemState(item, 'selected', true);
        //console.log(item)
        //console.log(item._cfg.id)
      });
      //obtain the id of instance in the combo
      this.comboGraph.on('node:mousedown', (evt) => {
        const { item } = evt;
        this.comboGraph.setItemState(item, 'selected', true);
        //console.log(item)
        //console.log(item._cfg.id)
      });
  
      this.comboGraph.on('edge:mousedown', (evt) => {
        const { item } = evt;
        this.comboGraph.setItemState(item, 'selected', true);
  
      })
  
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


  }


  refreshDragedNodePosition(e) {
    const model = e.item.get('model');
    model.fx = e.x;
    model.fy = e.y;
  };



  render() {
    return ( 
      <div className="App">
        <Header></Header>
        <button onClick={this.handleClick}></button>
        <CenteredGrid></CenteredGrid>
        <p className="App-intro">{this.state.apiResponse}</p>
        <Footer></Footer> 
      </div>
    )
}
}



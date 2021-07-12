//import logo from './logo.svg';
import G6 from '@antv/g6';
import './App.css';
import { Footer, Header, CenteredGrid } from './components/Layout'
import axios from 'axios';

import React,{ Component } from 'react'
import PubSub from 'pubsub-js'

export default class App extends Component {
  constructor(props) {
    super(props);
    //state
    this.state = {
      clickId:"",
      test:"",
      isEdge:true,
      clickLabel:"",
      apiResponse: "",
      comboData: {
      },
      nodeid:{},
      edgeid:{},
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

      },
      testData: {
        nodes: [
          {
            id: '0',
            comboId: 'a',
          },
          {
            id: '1',
            comboId: 'a',
          },
          {
            id: '2',
            comboId: 'a',
          },
          {
            id: '3',
            comboId: 'a',
          },
          {
            id: '4',
            comboId: 'a',
          },
          {
            id: '5',
            comboId: 'a',
          },
          {
            id: '6',
            comboId: 'a',
          },
          {
            id: '7',
            comboId: 'a',
          },
          {
            id: '8',
            comboId: 'a',
          },
          {
            id: '9',
            comboId: 'a',
          },
          {
            id: '10',
            comboId: 'a',
          },
          {
            id: '11',
            comboId: 'a',
          },
          {
            id: '12',
            comboId: 'a',
          },
          {
            id: '13',
            comboId: 'a',
          },
          {
            id: '14',
            comboId: 'a',
          },
          {
            id: '15',
            comboId: 'a',
          },
          {
            id: '16',
            comboId: 'b',
          },
          {
            id: '17',
            comboId: 'b',
          },
          {
            id: '18',
            comboId: 'b',
          },
          {
            id: '19',
            comboId: 'b',
          },
          {
            id: '20',
          },
          {
            id: '21',
          },
          {
            id: '22',
          },
          {
            id: '23',
            comboId: 'c',
          },
          {
            id: '24',
            comboId: 'a',
          },
          {
            id: '25',
          },
          {
            id: '26',
          },
          {
            id: '27',
            comboId: 'c',
          },
          {
            id: '28',
            comboId: 'c',
          },
          {
            id: '29',
            comboId: 'c',
          },
          {
            id: '30',
            comboId: 'c',
          },
          {
            id: '31',
            comboId: 'c',
          },
          {
            id: '32',
            comboId: 'd',
          },
          {
            id: '33',
            comboId: 'd',
          },
        ],
        edges: [
          {
            source: 'a',
            target: 'b',
            label: 'Combo A - Combo B',
            size: 3,
            labelCfg: {
              autoRotate: true,
              style: {
                stroke: '#fff',
                lineWidth: 5,
                fontSize: 20,
              },
            },
            style: {
              stroke: 'red',
            },
          },
          {
            source: 'a',
            target: '33',
            label: 'Combo-Node',
            size: 3,
            labelCfg: {
              autoRotate: true,
              style: {
                stroke: '#fff',
                lineWidth: 5,
                fontSize: 20,
              },
            },
            style: {
              stroke: 'blue',
            },
          },
          {
            source: '0',
            target: '1',
          },
          {
            source: '0',
            target: '2',
          },
          {
            source: '0',
            target: '3',
          },
          {
            source: '0',
            target: '4',
          },
          {
            source: '0',
            target: '5',
          },
          {
            source: '0',
            target: '7',
          },
          {
            source: '0',
            target: '8',
          },
          {
            source: '0',
            target: '9',
          },
          {
            source: '0',
            target: '10',
          },
          {
            source: '0',
            target: '11',
          },
          {
            source: '0',
            target: '13',
          },
          {
            source: '0',
            target: '14',
          },
          {
            source: '0',
            target: '15',
          },
          {
            source: '0',
            target: '16',
          },
          {
            source: '2',
            target: '3',
          },
          {
            source: '4',
            target: '5',
          },
          {
            source: '4',
            target: '6',
          },
          {
            source: '5',
            target: '6',
          },
          {
            source: '7',
            target: '13',
          },
          {
            source: '8',
            target: '14',
          },
          {
            source: '9',
            target: '10',
          },
          {
            source: '10',
            target: '22',
          },
          {
            source: '10',
            target: '14',
          },
          {
            source: '10',
            target: '12',
          },
          {
            source: '10',
            target: '24',
          },
          {
            source: '10',
            target: '21',
          },
          {
            source: '10',
            target: '20',
          },
          {
            source: '11',
            target: '24',
          },
          {
            source: '11',
            target: '22',
          },
          {
            source: '11',
            target: '14',
          },
          {
            source: '12',
            target: '13',
          },
          {
            source: '16',
            target: '17',
          },
          {
            source: '16',
            target: '18',
          },
          {
            source: '16',
            target: '21',
          },
          {
            source: '16',
            target: '22',
          },
          {
            source: '17',
            target: '18',
          },
          {
            source: '17',
            target: '20',
          },
          {
            source: '18',
            target: '19',
          },
          {
            source: '19',
            target: '20',
          },
          {
            source: '19',
            target: '33',
          },
          {
            source: '19',
            target: '22',
          },
          {
            source: '19',
            target: '23',
          },
          {
            source: '20',
            target: '21',
          },
          {
            source: '21',
            target: '22',
          },
          {
            source: '22',
            target: '24',
          },
          {
            source: '22',
            target: '25',
          },
          {
            source: '22',
            target: '26',
          },
          {
            source: '22',
            target: '23',
          },
          {
            source: '22',
            target: '28',
          },
          {
            source: '22',
            target: '30',
          },
          {
            source: '22',
            target: '31',
          },
          {
            source: '22',
            target: '32',
          },
          {
            source: '22',
            target: '33',
          },
          {
            source: '23',
            target: '28',
          },
          {
            source: '23',
            target: '27',
          },
          {
            source: '23',
            target: '29',
          },
          {
            source: '23',
            target: '30',
          },
          {
            source: '23',
            target: '31',
          },
          {
            source: '23',
            target: '33',
          },
          {
            source: '32',
            target: '33',
          },
        ],
        combos: [
          {
            id: 'a',
            label: 'Combo A',
          },
          {
            id: 'b',
            label: 'Combo B',
          },
          {
            id: 'c',
            label: 'Combo D',
          },
          {
            id: 'd',
            label: 'Combo D',
            parentId: 'b',
          },
        ],
      }
    };
    this.comboGraph = null;
    this.forceGraph = null;
  }

  //publish message
  publishmsgNode=()=>{

    PubSub.publish('MY TOPIC',this.state.nodeid);
  }

  publishmsgEdge=()=>{
    console.log("send")
    PubSub.publish('EDGE',this.state.edgeid);
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
  handleClick=(e)=> {
    e.preventDefault();
    this.setState({test :"test"})
  }

  componentDidMount() {

     PubSub.subscribe('ClickList',(_,stateObj)=>{
      if(stateObj[0]==='false'){
      axios.get(`http://localhost:8080/kaggle/`+stateObj[1].toLowerCase()+`/`+stateObj[2])
      .then(res => {
        this.setState({comboData:res.data});
      });
      }
      else if (stateObj[0]==='true'){
       axios.get(`http://localhost:8080/kaggle/edge/`+stateObj[6].toLowerCase()+`/`+stateObj[1].toLowerCase()+'/'+stateObj[4]+'/'+stateObj[3].toLowerCase()+'/'+stateObj[5])
        .then(res => {
          this.setState({comboData:res.data});
        });
      }



		} );

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
      outDiv.innerHTML = `
        <h4>Info</h4>
        <ul>
        <li>Id: ${e.item.getModel().id}</li>
      </ul>
        <ul>
          <li>InstanceId: ${e.item.getModel().instanceid}</li>
        </ul>
        <ul>
        <li>Group: ${e.item.getModel().comboId}</li>
      </ul>
        <ul>
        <li>Startvalidtime: ${e.item.getModel().startvalidtime}</li>
      </ul>
      <ul>
      <li>Endvalidtime: ${e.item.getModel().endvalidtime}</li>
    </ul>
      `;
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
      `;
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
      if (edge.label === 'view' || edge.label === 'transaction' || edge.label === 'addtocart') {
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
      //console.log(item._cfg.id);
      this.setState({isEdge:true});
      var id = item._cfg.id;
      this.setState({clickId:id});
      if (this.state.clickId === '01') {
       this.setState({clickLabel:"user"});
        //user
      }
      else if (this.state.clickId === '02') {
        //item
        this.setState({clickLabel:"item"});
      }
      else if (this.state.clickId === '03') {
        //category
        this.setState({clickLabel:"category"});
      }

      axios.get(`http://localhost:8080/kaggle/combo/`+this.state.clickLabel)
      .then(res => {
        this.setState({comboData:res.data});
      })
      
      axios.get(`http://localhost:8080/kaggle/node/`+this.state.clickLabel)
      .then(res => {
        this.setState({nodeid:res.data});
        this.publishmsgNode();
      });
    });

    this.forceGraph.on('edge:mousedown', (evt) => {
      const { item } = evt;
      this.forceGraph.setItemState(item, 'selected', true);
      //console.log(item._cfg);
      //console.log(item._cfg.model.label)
      this.setState({isEdge:false});
      var label = item._cfg.model.label;
      var sourcelabel="user";
      var targetlabel="item";
      this.setState({clickLabel:label});
      if (this.state.clickLabel === 'view') {
        //view
         sourcelabel="user";
         targetlabel="item";
      }
      else if (this.state.clickLabel === 'addtocart') {
        //addtocart
         sourcelabel="user";
         targetlabel="item";
      }
      else if (this.state.clickLabel === 'transaction') {
        //transaction
         sourcelabel="user";
         targetlabel="item";
      }
      else if (this.state.clickLabel === 'belongto') {
        //belongto
         sourcelabel="item";
         targetlabel="category";
      }
      else if (this.state.clickLabel === 'subCategory') {
        //subCategory
         sourcelabel="category";
         targetlabel="category";
      }
      axios.get(`http://localhost:8080/kaggle/combo/`+this.state.clickLabel+`/`+sourcelabel+`/`+targetlabel)
     // axios.get(`http://localhost:8080/kaggle/test/view/user/item`)
      .then(res => {
        this.setState({comboData:res.data});
      })
      axios.get(`http://localhost:8080/kaggle/edge/`+this.state.clickLabel)
      .then(res => {
        this.setState({edgeid:res.data});
        this.publishmsgEdge();
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
        plugins: [tooltipCombo,tooltipEdge,tooltipNode],
        fitView: true,
        layout: {
          type: 'comboForce',
          nodeSpacing: (d) => 8,
          preventOverlap:true,
          preventComboOverlap:true,

      },
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
            //size: 50,
          },
          labelCfg: {
            position: 'top',
          },
        },
      });
     
      this.comboGraph.data(this.state.comboData);
  
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
      this.comboGraph.on('node:drag', (evt) => {
        this.comboGraph.layout();
        this.refreshDragedNodePosition(evt);
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

  componentDidUpdate(){
    console.log("change data");
    if (typeof(this.state.comboData.edges)!='undefined'){ 
      console.log("util process parallel ")
           G6.Util.processParallelEdges(this.state.comboData.edges);};
   (this.state.isEdge===true)? this.comboGraph.updateLayout({type: 'comboForce', nodeSpacing: (d) => 8,
   preventOverlap:true,
   preventComboOverlap:true,},):this.comboGraph.updateLayout({type: 'grid',
   preventOverlap: true,
  },)
    this.comboGraph.changeData(this.state.comboData);
    


  }


  refreshDragedNodePosition(e) {
    const model = e.item.get('model');
    model.fx = e.x;
    model.fy = e.y;
  };



  render() {
    console.log(this)
    return ( 
      
      <div className="App">
        <Header></Header>
        <button onClick={this.handleClick}></button>
        <CenteredGrid clickId={this.state.clickId} clickLabel={this.state.clickLabel}></CenteredGrid>
        <p className="App-intro">{this.state.apiResponse}</p>
        <Footer></Footer> 
      </div>
    )
}
}



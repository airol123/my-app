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
            type: 'circle'
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
      var attributesList="";
      Object.keys(e.item.getModel().attributes).forEach(key => {
        if(key!=="startvalidtime"& key!=="endvalidtime"){
            attributesList=attributesList+"<ul><li>"+key+":"+e.item.getModel().attributes[key]+"</li></ul>";}
        return  attributesList;
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
      `+attributesList;
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
      var attributesList="";
      Object.keys(e.item.getModel().attributes).forEach(key => {
        if(key!=="startvalidtime"& key!=="endvalidtime"){
            attributesList=attributesList+"<ul><li>"+key+":"+e.item.getModel().attributes[key]+"</li></ul>";}
        return  attributesList;
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
      `+attributesList;
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
            // fill: '#steelblue',
            //stroke: 'red',
            //lineDash: [2, 2],
            lineWidth: 1,
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
            lineWidth: 5,
          },
        };
      }
      else {
        return {
          id: node.id,
          style: {
            lineWidth: 1,

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
            lineWidth: 5,
          },
        };
      }
      else {
        return {
          id: edge.id,
          style: {
            lineWidth: 1,

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
      //axios.get(`http://localhost:8080/kaggle/test/view/user/item`)
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
        plugins: [],
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

          labelCfg: {
            position: 'top',
          },
        },
        defaultNode: {
          type:'circle',
          size: 25,
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
   preventComboOverlap:true,},):this.comboGraph.updateLayout({type: 'fruchterman',
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
        {/*<button onClick={this.handleClick}></button>*/}
        <CenteredGrid clickId={this.state.clickId} clickLabel={this.state.clickLabel}></CenteredGrid>
        <p className="App-intro">{this.state.apiResponse}</p>
        <Footer></Footer> 
      </div>
    )
}
}



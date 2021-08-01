//import logo from './logo.svg';
import G6 from '@antv/g6';
import './App.css';
import { Footer, Header, CenteredGrid ,UndoButton,RedoButton} from './components/Layout'
import axios from 'axios';
import React,{ Component } from 'react'
import PubSub from 'pubsub-js'
import cloneDeep from "lodash/cloneDeep";
export default class App extends Component {
  constructor(props) {
    super(props);
    this.undo=[];
    this.redo=[];
    this.cleundo=true;
    this.cleredo=true;
    //state
    this.state = {
      clickId:"",
      isNode:true,
      clickLabel:"",
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
            style: {
              fill: '	#A593E0',
              stroke: '#AAABD3',
            },
          },
          {
            id: '02',
            x: 400,
            y: 150,
            label: 'Item',
            type: 'circle',
            style: {
              fill: '#dedcee',
              stroke: '#CBA6C3',
            },
          },
          {
            id: '03',
            x: 250,
            y: 100,
            label: 'Category',
            style: {
              fill: '#aacfd0',
              stroke: '#aacfd0',
            },
          },
        ],
        edges: [{
          source: '01',
          target: '02',
          label: 'addtocart',
          style: {
            stroke: '#FFEEE4',
          },
        },
        {
          source: '02',
          target: '03',
          label: 'belongto',
          style: {
            stroke: '#FBFFB9',
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
            stroke: '#ABD0CE',
          },
        },
        {
          source: '01',
          target: '02',
          label: 'transaction',
          style: {
            stroke: '#8EC0E4',
          },
        }
        ],

      },
      test:"",

    };
    this.comboGraph = null;
    this.forceGraph = null;
  }

  //publish message
  publishmsgNode=()=>{
    console.log("app publish")
    PubSub.publish('NODE',this.state.nodeid);
  }
 
  publishmsgEdge=()=>{
    console.log("app publish",this.state.edgeid)
    PubSub.publish('EDGE',this.state.edgeid);
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
  handleUndo=(e)=> {
    e.preventDefault();
    this.saveRedo();
    //this.redo.unshift(this.state);
    this.setState({clickId:this.undo[0].clickId,
      isNode:this.undo[0].isNode,
      clickLabel:this.undo[0].clickLabel,
      comboData: this.undo[0].comboData,
      nodeid:this.undo[0].nodeid,
      edgeid:this.undo[0].edgeid,},
    );
  this.undo.splice(0,1);
  //
  }

  handleRedo=(e)=> {
    e.preventDefault();
    this.saveUndo();
    this.setState({clickId:this.redo[0].clickId,
      isNode:this.redo[0].isNode,
      clickLabel:this.redo[0].clickLabel,
      comboData: this.redo[0].comboData,
      nodeid:this.redo[0].nodeid,
      edgeid:this.redo[0].edgeid,},
      );
  this.redo.splice(0,1);
  //
  
   
  }

  componentDidMount() {
     this.activeBtn();
     PubSub.subscribe('ClickList',(_,stateObj)=>{
      this.saveUndo();
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

      this.saveUndo();
      const { item } = evt;
      this.forceGraph.setItemState(item, 'selected', true);
      //console.log(item._cfg.id);
      //this.setState({isNode:true});
      var id = item._cfg.id;
      this.setState({clickId:id});
      if (this.state.clickId === '01') {
       this.setState({isNode:true,clickLabel:"user"});
        //user
      }
      else if (this.state.clickId === '02') {
        //item
        this.setState({isNode:true,clickLabel:"item"});
      }
      else if (this.state.clickId === '03') {
        //category
        this.setState({isNode:true,clickLabel:"category"});
      }



      axios.get(`http://localhost:8080/kaggle/combo/`+this.state.clickLabel)
      .then(res => {

        this.setState({comboData:res.data});
      })
      axios.get(`http://localhost:8080/kaggle/node/`+this.state.clickLabel+'/1')
      .then(res => {

        this.setState({nodeid:res.data},()=>{this.publishmsgNode();});
    
        
      })

      //this.getComboData();

    });

    this.forceGraph.on('edge:mouseup', (evt) => {
      this.saveUndo();
      const { item } = evt;
      this.forceGraph.setItemState(item, 'selected', true);
      //console.log(item._cfg);
      //console.log(item._cfg.model.label)

     // this.setState({});
      var label = item._cfg.model.label;
      var sourcelabel="user";
      var targetlabel="item";
      this.setState({isNode:false,clickLabel:label});
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
      .then(res => {

        this.setState({comboData:res.data});

      })
      axios.get(`http://localhost:8080/kaggle/edge/`+this.state.clickLabel+'/1')
      .then(res => {

        this.setState({edgeid:res.data},()=>{ this.publishmsgEdge();});
    
       
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
      this.comboGraph.on('node:mouseup', (evt) => {
        const { item } = evt;
        this.comboGraph.setItemState(item, 'selected', true);
        //console.log(item)
        //console.log(item._cfg.id)
      });
     
  
      this.comboGraph.on('edge:mouseup', (evt) => {
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

  activeBtn=()=>{
 if(this.redo.length===0){
       this.cleredo=true;
    }
 if (this.undo.length===1){
       this.cleundo=true;
       }
  if(this.undo.length>1){
      this.cleundo=false;
    }
    if(this.redo.length>=1){
      this.cleredo=false;}
  }


  componentDidUpdate(){

    
    console.log("change data");
    if (typeof(this.state.comboData.edges)!='undefined'){ 
      console.log("util process parallel ")
           G6.Util.processParallelEdges(this.state.comboData.edges);};
   (this.state.isNode===true)? this.comboGraph.updateLayout({type: 'comboForce', nodeSpacing: (d) => 8,
   preventOverlap:true,
   preventComboOverlap:true,},):this.comboGraph.updateLayout({type: 'random',
   preventOverlap: true,
  },)
    this.comboGraph.changeData(this.state.comboData);
  }
//fruchterman

  refreshDragedNodePosition(e) {
    const model = e.item.get('model');
    model.fx = e.x;
    model.fy = e.y;
  };



  async getComboData(){
    let res=await  axios.get(`http://localhost:8080/kaggle/combo/`+this.state.clickLabel)
    this.setState({comboData:res.data})

    let result=await  axios.get(`http://localhost:8080/kaggle/node/`+this.state.clickLabel+'/1')
    this.setState({nodeid:result.data},()=>{this.publishmsgNode();});


  }

  saveUndo=()=>{
    //console.log("statu actuel",this.state)
    //console.log("before save undo", this.undo)
    //let deepState = JSON.parse(JSON.stringify(this.state))
    let deepState = cloneDeep(this.state)
    this.undo.unshift(deepState);
    //console.log("after save undo", this.undo)
  }


  saveRedo=()=>{
    
    let deepState = cloneDeep(this.state)
    this.redo.unshift(deepState);

  }

  force=()=>{
    this.forceUpdate();
  }
  render() {
    console.log("state",this.state)
    this.activeBtn();
    return ( 
      
      <div className="App">
        {/* <button onClick={this.force()}></button>*/}<Header></Header>
         <UndoButton handlerClick={this.handleUndo} cle={this.cleundo}></UndoButton>
        <RedoButton handlerClick={this.handleRedo} cle={this.cleredo}></RedoButton>
        
        
        <CenteredGrid clickId={this.state.clickId} clickLabel={this.state.clickLabel}></CenteredGrid>
       {/* <p className="App-intro">{this.state.apiResponse}</p>
        <button id="undo" onClick={this.handleUndo}>Undo</button>
        <button id="redo" onClick={this.handleRedo}>Redo</button>*/}
        <Footer></Footer> 
      </div>
    )
}
}



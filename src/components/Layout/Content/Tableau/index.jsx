
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import PubSub from 'pubsub-js'
import React, { Component } from 'react'
import Btn from './ButtonPage/index.jsx'
  


export default class Tableau extends Component {
  state = { 
    labelSource:"",
    labelTarget:"",
    label:"null",
    isRalation:"false",
    length:0,
		nodes:[], 
    relations:[],
    changes:[],
    select:false,
	} 
  
  componentDidMount(){
    PubSub.subscribe('NODE',(_,stateObj)=>{
      if (typeof(stateObj.nodes) !="undefined"){ // react cycle de vie + axios
        this.setState({isRalation:"false"});
        this.setState({nodes:stateObj.nodes});
        this.setState({labelSource:stateObj.label});
        this.setState({changes:stateObj.changes});
        //var arry = Array.from(stateObj.nodes);
        this.setState({length:stateObj.nodes.length+1});
      } } );

      PubSub.subscribe('PAGECHANGENODE',(_,stateObj)=>{
        if (typeof(stateObj.nodes) !="undefined"){ // react cycle de vie + axios
          this.setState({isRalation:"false"});
          this.setState({nodes:stateObj.nodes});
          this.setState({labelSource:stateObj.label});
          this.setState({changes:stateObj.changes});
          //var arry = Array.from(stateObj.nodes);
          this.setState({length:stateObj.nodes.length+1});
        } } );
  
    PubSub.subscribe('EDGE',(_,stateObj)=>{
      if (typeof(stateObj.label) !="undefined"){
       // react cycle de vie + axios
        this.setState({isRalation:"true"});
        this.setState({relations:stateObj.edges});
        this.setState({labelSource:stateObj.sourceLabel});
        this.setState({labelTarget:stateObj.targetLabel});
        this.setState({label:stateObj.label});
        //this.setState({changes:stateObj.changes});
      //  var arry = Array.from(stateObj.edges);
        this.setState({length:stateObj.edges.length});

      } } 
    );

      
    PubSub.subscribe('PAGECHANGEEDGE',(_,stateObj)=>{
      if (typeof(stateObj.label) !="undefined"){
       // react cycle de vie + axios
        this.setState({isRalation:"true"});
        this.setState({relations:stateObj.edges});
        this.setState({labelSource:stateObj.sourceLabel});
        this.setState({labelTarget:stateObj.targetLabel});
        this.setState({label:stateObj.label});
        //this.setState({changes:stateObj.changes});
      //  var arry = Array.from(stateObj.edges);
        this.setState({length:stateObj.edges.length});

      } } 
    );
  
  }

  publishmsg=(msgList)=>{

    PubSub.publish('ClickList',msgList);
  }
  handleClick=(msgList)=> {

    this.publishmsg(msgList);
    // change the color
    this.setState({select:true})
  }

   renderRow=(props)=> {
    const { index, style } = props;
  
    return (

      <ListItem selected={this.state.select} button style={style} key={index} onClick={this.state.isRalation==="false"?()=> this.handleClick([this.state.isRalation,this.state.labelSource,this.state.nodes[index-1]]) :()=> this.handleClick([this.state.isRalation,this.state.labelSource,this.state.nodes[index-1],this.state.labelTarget,this.state.relations[index-1].source,this.state.relations[index-1].target,this.state.label])}>
      {/* {this.state.isRalation==="false"?index === 0 ? <ListItemText primary={`${this.state.labelSource} id  (nbChange) :`} /> : <ListItemText primary={`---${this.state.labelSource} ${this.state.nodes[index]} ${this.state.changes[index]-1}  `} />:index === 0 ? <ListItemText primary={`${this.state.labelSource} id -->${this.state.labelTarget} id  (nbChange):`} /> : <ListItemText primary={`---${this.state.labelSource} ${this.state.relations[index].source}-->${this.state.labelTarget} ${this.state.relations[index].target} ${this.state.changes[index]-1}`} />}*/}
       {this.state.isRalation==="false"?index === 0 ? <ListItemText primary={`${this.state.labelSource} id   :`} /> : <ListItemText primary={`---${this.state.labelSource} ${this.state.nodes[index-1]}  `} />:index === 0 ? <ListItemText primary={`${this.state.labelSource} id -->${this.state.labelTarget} id  :`} /> : <ListItemText primary={`---${this.state.labelSource} ${this.state.relations[index-1].source}-->${this.state.labelTarget} ${this.state.relations[index-1].target}`} />}
     
      </ListItem>
      

    );
  }

  render() {
    return (
         <div>
      <FixedSizeList  className="root" height={410} width={300} itemSize={35} itemCount={this.state.length}>
        {this.renderRow}
        
      </FixedSizeList>
      <div className="divStyle">
      <Btn labelSource={this.state.labelSource} label={this.state.label} isRalation={this.state.isRalation}></Btn>
      </div>
    </div>
    )
    
  }
}


import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import PubSub from 'pubsub-js'
import React, { Component } from 'react'
import { findAllByDisplayValue } from '@testing-library/react';
  


export default class Tableau extends Component {
  state = { 
    labelSource:"",
    labelTarget:"",
    label:"null",
    isRalation:"false",
    length:0,
		nodes:[], 
    relations:[],
	} 
  
  componentDidMount(){
    var token1 = PubSub.subscribe('MY TOPIC',(_,stateObj)=>{
      
      if (typeof(stateObj.nodes) !="undefined"){ // react cycle de vie + axios
        this.setState({isRalation:"false"});
        this.setState({nodes:stateObj.nodes});
        this.setState({labelSource:stateObj.label});
        var arry = Array.from(stateObj.nodes);
        console.log(this.state.labelSource);
        this.setState({length:stateObj.nodes.length});
        
        console.log(this.state.nodes);
      } } 
    );
  
    var token2 = PubSub.subscribe('EDGE',(_,stateObj)=>{
      console.log("EDGE",stateObj);
      if (typeof(stateObj.label) !="undefined"){
       // react cycle de vie + axios
        this.setState({isRalation:"true"});
        this.setState({relations:stateObj.edges});
        this.setState({labelSource:stateObj.sourceLabel});
        this.setState({labelTarget:stateObj.targetLabel});
        this.setState({label:stateObj.label});
        var arry = Array.from(stateObj.edges);//
        console.log(this.state.label);//
        this.setState({length:stateObj.edges.length});//
        
        console.log("EDGE",stateObj);
      } } 
    );
  
  }

  publishmsg=(msgList)=>{
    console.log("message")

    PubSub.publish('ClickList',msgList);
  }
  handleClick=(msgList)=> {

    console.log("id",msgList[0]);
    this.publishmsg(msgList);
  }

   renderRow=(props)=> {
    const { index, style } = props;
  
    return (
      
      <ListItem button style={style} key={index} onClick={this.state.isRalation==="false"?()=> this.handleClick([this.state.isRalation,this.state.labelSource,this.state.nodes[index]]) :()=> this.handleClick([this.state.isRalation,this.state.labelSource,this.state.nodes[index],this.state.labelTarget,this.state.relations[index].source,this.state.relations[index].target,this.state.label]) }>
       {this.state.isRalation==="false"?index === 0 ? <ListItemText primary={`${this.state.labelSource} id :`} /> : <ListItemText primary={`---${this.state.labelSource} ${this.state.nodes[index]} `} />:index === 0 ? <ListItemText primary={`${this.state.labelSource} id -->${this.state.labelTarget} id :`} /> : <ListItemText primary={`---${this.state.labelSource} ${this.state.relations[index].source}-->${this.state.labelTarget} ${this.state.relations[index].target}`} />}
     
      </ListItem>
    );
  }

  render() {
    return (
         <div className="root">
      <FixedSizeList height={400} width={310} itemSize={46} itemCount={this.state.length}>
        {this.renderRow}
      </FixedSizeList>
    </div>
    )
    
  }
}

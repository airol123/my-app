
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import PubSub from 'pubsub-js'
import React, { useState,useEffect } from 'react'
import Btn from './ButtonPage/index.jsx'



export default function VirtualizedList() {

  const [labelSource, setLabelSource] = useState("");
  const [labelTarget, setLabelTarget] = useState("");
  const [label, setLabel] = useState("null");
  const [isRalation, setIsRalation] = useState("false");
  const [length, setLength] = useState(0);
  const [nodes, setNodes] = useState();
  const [relations, setRelations] = useState();
  const [changes, setChanges] = useState();
  const [select, setSelect] = useState(false);

 
  function subNode(){   
    PubSub.subscribe('NODE',(_,stateObj)=>{
       if (typeof(stateObj.nodes) !="undefined"){ 
        console.log("eeeeeee")
         setIsRalation("false");
         setNodes(stateObj.nodes);
         setLabelSource(stateObj.label);
         setChanges(stateObj.changes);
         setLength(stateObj.nodes.length+1);
       } } );
 }
 function subNodePage(){  
       PubSub.subscribe('PAGECHANGENODE',(_,stateObj)=>{
         if (typeof(stateObj.nodes) !="undefined"){ 
           setIsRalation("false");
           setNodes(stateObj.nodes);
           setLabel(stateObj.label);
           setChanges(stateObj.changes);
           setLength(stateObj.nodes.length+1);
         } } );
       }
 
 function subEdge(){ 
   
     PubSub.subscribe('EDGE',(_,stateObj)=>{
       console.log("receive edge",stateObj)
         
         console.log("eeeeeee")
         setRelations(stateObj.edges);
         setIsRalation("true");

         setLabelSource(stateObj.sourceLabel);
         setLabelTarget(stateObj.targetLabel);
         setLabel(stateObj.label);
         setLength(stateObj.edges.length);
 
       } 
     );}
 
 function subEdgePage(){   PubSub.subscribe('PAGECHANGEEDGE',(_,stateObj)=>{
       if (typeof(stateObj.label) !="undefined"){
         setIsRalation("true");
         setRelations(stateObj.edges);
         setLabelSource(stateObj.sourceLabel);
         setLabelTarget(stateObj.targetLabel);
         setLabel(stateObj.label);
         setLength(stateObj.edges.length);
 
       } } 
     );}
  
  function renderRow(props) {
    const { index, style } = props;
    return (
      <ListItem selected={select} button style={style} key={index} onClick={isRalation==="false"?()=> handleClick([isRalation,labelSource,nodes[index-1]]) :()=> this.handleClick([isRalation,labelSource,nodes[index-1],labelTarget,relations[index-1].source,relations[index-1].target,label])}>
           {/*console.log("nodes",nodes)}
           {console.log("relation",relations)*/}
           {true?isRalation==="false"?index === 0 ? <ListItemText primary={`${labelSource} id   :`} /> : <ListItemText primary={`---${labelSource} ${nodes[index-1]}  `} />:index === 0 ? <ListItemText primary={`${labelSource} id -->${labelTarget} id  :`} /> : <ListItemText primary={`---${labelSource} ${relations[index-1].source}-->${labelTarget} ${relations[index-1].target}`} />:console.log("0000")}
      </ListItem>
    );
  }

  function  publishmsg(msgList){

    PubSub.publish('ClickList',msgList);
  }

  function handleClick(msgList) {

    publishmsg(msgList);
    // change the color
    setSelect(true)
  }

  useEffect(() => {
    subNode();
    subNodePage();
    subEdge();
    subEdgePage();
    console.log("edge",relations)
    console.log("isRalation",isRalation)
    console.log("node",nodes)
    console.log("label",labelSource)
    console.log("changes",changes)
    console.log("len",length)

  });

  return (
    
       <div>
    <FixedSizeList  className="root" height={410} width={300} itemSize={35} itemCount={length}>
      {renderRow}
      
    </FixedSizeList>
    <div className="divStyle">
    <Btn labelSource={labelSource} label={label} isRalation={isRalation}></Btn>
    </div>
  </div>
  )
  
}




 
  
  




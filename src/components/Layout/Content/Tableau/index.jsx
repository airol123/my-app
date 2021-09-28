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
  const [selectedIndex, setSelectedIndex] = useState();
 

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };


  function subNode(){   
    PubSub.subscribe('NODE',(_,stateObj)=>{
      console.log("sub",stateObj)
       if (typeof(stateObj.nodes) !="undefined"){ 
         setNodes(stateObj.nodes);
         setIsRalation("false"); 
         setLabelSource(stateObj.label);
         setChanges(stateObj.changes);
         setLength(stateObj.nodes.length+1);
       } ;    } );
 }
 function subNodePage(){  
       PubSub.subscribe('PAGECHANGENODE',(_,stateObj)=>{
         if (typeof(stateObj.nodes) !="undefined"){ 
           setNodes(stateObj.nodes);
           setIsRalation("false");   
           setLabelSource(stateObj.label);
           setChanges(stateObj.changes);
           setLength(stateObj.nodes.length+1);
         } } );
       }
 
 function subEdge(){ 
   
     PubSub.subscribe('EDGE',(_,stateObj)=>{
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
         setRelations(stateObj.edges);
         setIsRalation("true");
         setLabelSource(stateObj.sourceLabel);
         setLabelTarget(stateObj.targetLabel);
         setLabel(stateObj.label);
         setLength(stateObj.edges.length);
 
       } } 
     );}

function handleTransProps(index) {
  isRalation==="false"?handleClick([isRalation,labelSource,nodes[index-1]]) :handleClick([isRalation,labelSource,labelTarget,relations[index-1].source,relations[index-1].target,label])

}
  
  function renderRow(props) {
    const { index, style } = props;

    return (
      <ListItem selected={selectedIndex === index} button style={style} key={index} onClick={(event)=>{handleListItemClick(event,index);handleTransProps(index)}}>
           {/*console.log("nodes",nodes)*/}
           
           {isRalation==="false"?index === 0 ? (<ListItemText primary={`${labelSource} id   :`} /> ) : <ListItemText primary={`---${labelSource} ${nodes[index-1]}  `} />:index === 0 ? <ListItemText primary={`${labelSource} id --${label}-->${labelTarget} id  :`} /> : <ListItemText primary={`---${labelSource} ${relations[index-1].source}-->${labelTarget} ${relations[index-1].target}`} />}
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
    PubSub.unsubscribe('NODE');
    PubSub.unsubscribe('PAGECHANGEEDGE');
    PubSub.unsubscribe('EDGE');
    PubSub.unsubscribe('PAGECHANGENODE');
    subNode();
    subNodePage();
    subEdge();
    subEdgePage();
  });

  return (
    
       <div>
    <FixedSizeList  className="root" height={410} width={'100%'} itemSize={35} itemCount={length}>
      {renderRow}
      
    </FixedSizeList>
    <div className="divStyle">
    <Btn labelSource={labelSource} label={label} isRalation={isRalation}></Btn>
    </div>
  </div>
  )
  
}

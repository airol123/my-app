import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import PubSub from 'pubsub-js'
import React, { useState,useEffect } from 'react'
import Btn from './ButtonPage/index.jsx'


export default function VirtualizedList() {

  const [labelSource, setLabelSource] = useState(""); // label of node or label of the source of the edge
  const [labelTarget, setLabelTarget] = useState("");// label of the target of the edge
  const [label, setLabel] = useState("null");// label of the edge
  const [isRalation, setIsRalation] = useState("false");// whether it is the edge 
  const [length, setLength] = useState(0);//The length of the message to be displayed
  const [nodes, setNodes] = useState();//The list of nodes to be displayed
  const [relations, setRelations] = useState();//The list of edges to be displayed
  const [changes, setChanges] = useState();
  const [select, setSelect] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState();// the id of the selected row
 

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

// subscribe info about node( when click on node of the schema forcegraph)
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
// subscribe the info of the next page( when click on the button to turn the page )

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
// subscribe info about edge( when click on edge of the schema forcegraph)

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
// subscribe the info of the next page( when click on the button to turn the page )
 
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
//If it is a node, return the corresponding node information, if it is an edge, return the corresponding edge information
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
//Click to post a message: Message is the information of the clicked line, whether it is a relationship, label, etc.
  function handleClick(msgList) {

    publishmsg(msgList);
    // change the color
    setSelect(true)
  }

  useEffect(() => {
    // cancle the subscribe : avoid the bug of deep loop
    PubSub.unsubscribe('NODE');
    PubSub.unsubscribe('PAGECHANGEEDGE');
    PubSub.unsubscribe('EDGE');
    PubSub.unsubscribe('PAGECHANGENODE');
    // resubscribe
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

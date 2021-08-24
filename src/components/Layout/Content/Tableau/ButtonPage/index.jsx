import React, { useState,useEffect  } from 'react'
import axios from 'axios';
import PubSub from 'pubsub-js'
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';



const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(0),
       
      },
    },
  }));
  let clique=false;
  export default function Btn(props) {

    const [labelSourceRecord,setLabelSourceRecord]=useState();
    const [labelRecord,setLabelRecord]=useState();
    const classes = useStyles();
    const [count, setCount] = useState(1);
    const [availibleB, setAvailibleB] = useState(true);
    const [availibleF, setAvailibleF] = useState(false);
    const [textInput, setTextInput] = useState("page");
    const{labelSource,label,isRalation}=props;
    let max=Math.ceil(2002/21) //2002  length of a node or a relationship
 
    function saveRecord(){
      setLabelSourceRecord(labelSource);
      setLabelRecord(label);
    }

    function initialiseCount(){
      if(labelSource!==labelSourceRecord||label!==labelRecord){
        setCount(1);
      }
    }
   
    function  handleClickBack() {
      //console.log("back",count)
        setCount(parseInt(count)-1);
        clique=true;

        }
    
    function  handleClickForward() {

      clique=true;
        setCount(parseInt(count)+1);
        }
    function availibleBF(){
        if (count>1)
        {    setAvailibleB(false)
        }else{
            setAvailibleB(true)
        };
         if (count<max)
        {    setAvailibleF(false)
        }else{
            setAvailibleF(true)
        };

    }

    function onChange(e){
      clique=true;
        //setTextInput(e.target.value);
        const ev=e.target.value
        console.log(ev.trim()==="")
        if(ev.trim()!==""){setCount(e.target.value);
          console.log("count1",e.target.value)}

      }

    function obtainData(){

        if(isRalation==="true"){
          
          axios.get(`http://localhost:8080/kaggle/edge/`+label+'/'+count)
          .then(res => {
            console.log(res.data);
            publishEdge(res.data);
          });   

        }
        else{  
          axios.get(`http://localhost:8080/kaggle/node/`+labelSource+'/'+count)
            .then(res => {
              console.log(res.data);
              publishNode(res.data);
            });}
   
      }
    function publishNode(msgList){
      console.log(msgList)
        PubSub.publish('PAGECHANGENODE',msgList);
      }

    function publishEdge(msgList){
      console.log(msgList)
      PubSub.publish('PAGECHANGEEDGE',msgList);
    }


    useEffect(() => {
        initialiseCount();
        availibleBF()
        setTextInput(count);
        console.log("effect",count)
        if(clique){obtainData();clique=false;}
        saveRecord();
    }
      );

    return (
        <div style={{padding:'10%'}}>
           <div  className={classes.root} noValidate autoComplete="off" >     
            
            <IconButton aria-label="back" onClick={handleClickBack} disabled={availibleB}>
                <ArrowBackIosIcon />
            </IconButton>  
            <TextField value={count}  margin="normal" onChange={(e)=>onChange(e)} id="outlined-basic" label="page" variant="outlined" style={{width:"8ch"}} size="small" />
                  
            <IconButton aria-label="forward"  onClick={handleClickForward} disabled={availibleF}>
                <ArrowForwardIosIcon />
            </IconButton>
            
            </div>  
        </div>
      
    );
  }



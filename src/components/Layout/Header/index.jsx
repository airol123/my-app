import React, { useState,useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HourglassFullIcon from "@material-ui/icons/HourglassFull";
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CenteredGrid from '../Content/index.jsx';
import Card from '../../TemporaryDrawer/Card/index.jsx';
import axios from 'axios';
import PubSub from 'pubsub-js'
import cloneDeep from "lodash/cloneDeep";
const drawerWidth = 370;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',

  },


  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: 'linear-gradient(45deg, #80bdff 50%,#FE6B8B 120%);',//linear-gradient(-225deg, #050505 0%, #910000 56%, #b84151 100%);

  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  title: {
    color: 'white',
    flexGrow: 1,
  },
}));

export default function PersistentDrawerLeft(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [cards, setCards] = useState([{}]);
  const [pathData, setpathData] = useState();
const {record,labelHistory,changesInfo,indexEtat} =props;
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const creatBody=(pathData,conditions)=>{
    var body=new Object();
    body.pathData=pathData;
    body.conditions=conditions;
    return body;

  }

  const   publishmsg= (data) => {
    PubSub.publish('AFTERFILTRE', data);
  }

  function handleOK() {
    console.log("header", pathData);
    //creat request body
    var request=creatBody(pathData,cards);

    console.log("request",request)


    axios.post('http://localhost:8080/kaggle/filtregraph', request)
    .then(res => {
      console.log('res=>', res.data);
      // send to app
      publishmsg(res.data)
    });

    

  }

  useEffect(() => {
    PubSub.unsubscribe('PATHDATAHEADER');
    PubSub.subscribe('PATHDATAHEADER', (_, stateObj) => {
      setpathData(stateObj)
      console.log("hdhdhdh",pathData)
  });

  })
  useEffect(() => {
    console.log("cards", cards);
  
  }, [cards])

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar

        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <HourglassFullIcon />
          </IconButton>
          <Typography variant="h5" className={classes.title}>
            INTERFACE FOR TEMPORAL GRAPH
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Typography variant="h5" >
          FILTER SUBGRAPH
        </Typography>
        <Divider />

        {
          cards.map((card, index) => {
            return typeof (card) === 'undefined' ? console.log("undefined") : <Card id={index} cards={cards} setCards={setCards} />
          })
        }

        <Button onClick={handleOK}>OK</Button>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <CenteredGrid record={record} labelHistory={labelHistory} changesInfo={changesInfo} indexEtat={indexEtat} />
      </main>
    </div>
  );
}

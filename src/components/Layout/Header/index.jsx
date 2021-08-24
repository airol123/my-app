import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import {AppBar,Toolbar,Typography,Button,IconButton} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
    root: {
      background: 'linear-gradient(45deg, #80bdff 50%,#FE6B8B 120%);',//linear-gradient(-225deg, #050505 0%, #910000 56%, #b84151 100%);
      flexGrow: 1,
      position: 'fixed',
      width:'100%',
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      color:'white',
      flexGrow: 1,
    },
  }));

function Header() {
    const classes = useStyles();
    return (
        <AppBar position="static" className={classes.root}>
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h5" className={classes.title}>
                INTERFACE FOR TEMPORAL GRAPH
                </Typography>
                <Button color="inherit"></Button>
            </Toolbar>
      </AppBar>
    )
}

export default Header

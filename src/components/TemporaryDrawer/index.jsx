import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import Card from './Card/index.jsx'

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    list: {
        width: 400,
    },
    fullList: {
        width: 'auto',
    },
    fabUndo: {
        position: 'fixed',
        bottom: theme.spacing(9),
        left: theme.spacing(20),
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
}));


export default function TemporaryDrawer() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        left: false,
    });
    const [open, setOpen] = React.useState(false);    

    const handleDrawerOpen = () => {
        setOpen(true);
      };
    
      const handleDrawerClose = () => {
        setOpen(false);
      };

    return (
        <div>
           
                <React.Fragment >
                    <IconButton className={classes.fabUndo} onClick={handleDrawerOpen}>
                        <HourglassFullIcon />
                    </IconButton>
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
                               
                            </IconButton>
                        </div>

                        <Divider />
                    </Drawer>
                </React.Fragment>
            
        </div>
    );
}

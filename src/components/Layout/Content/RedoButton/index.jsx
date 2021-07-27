import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Fab from '@material-ui/core/Fab';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
const useStyles = makeStyles((theme) => ({
  fabRedo: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
   
  },
}));

export default function FabRedo(props) {
  const classes = useStyles();
  const{handlerClick,cle}=props;
  return (
    <React.Fragment>
      <CssBaseline />
      <div>
        <Fab  onClick={handlerClick} id="redo" color="inherit"  size='small' className={classes.fabRedo}   disabled={cle}>
            <RedoIcon/>
        </Fab>
      </div>
    </React.Fragment>
  );
}
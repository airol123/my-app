import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Fab from '@material-ui/core/Fab';
import RedoIcon from '@material-ui/icons/Redo';
const useStyles = makeStyles((theme) => ({
  fabRedo: {
    position: 'fixed',
    top: theme.spacing(9),
    left: theme.spacing(13),
   
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
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Fab from '@material-ui/core/Fab';
import UndoIcon from '@material-ui/icons/Undo';
const useStyles = makeStyles((theme) => ({
  fabUndo: {
    position: 'fixed',
    bottom: theme.spacing(9),
    left: theme.spacing(7),
  },

}));
export default function FabUndo(props) {
  const classes = useStyles();
  const{handlerClick,cle}=props;

  return (
    <React.Fragment>
      <CssBaseline />
      <div>
        <Fab onClick={handlerClick} id="undo" color="inherit"  size='small' className={classes.fabUndo} disabled={cle}>
            <UndoIcon/>
        </Fab>
      </div>
    </React.Fragment>
  );
}
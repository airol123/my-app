import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FlagIcon from '@material-ui/icons/Flag';
import { green } from '@material-ui/core/colors';



const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function IconButtons() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <IconButton aria-label="flagIcon"  style={{color:green[500],position:'absolute',bottom:'25px', right: '1%'}}>
        <FlagIcon  style={{fontSize: 50}}/>
      </IconButton>

    </div>
  );
}

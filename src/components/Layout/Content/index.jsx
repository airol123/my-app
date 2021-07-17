import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Tableau from './Tableau'
import './index.css'
import theme from'../../theme.jsx'
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 120,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function CenteredGrid() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid   item xs={9} >
          <div className="gridcss1 backgroundbord " id='force'></div>
        </Grid>
        <Grid   item xs={3} >
          <div className="gridcss2 backgroundbord listfont"><Tableau ></Tableau></div>
          
        </Grid>
        <Grid  item xs={12} >
         <div id='comboGroup' className="gridcss3 backgroundbord"> 
         <div  id='combo' ></div>

         </div>
        </Grid>

        <Grid item xs={6}>
          <Paper className={classes.paper}>timebar</Paper>
        </Grid>


      </Grid>
    </div>
  );
}

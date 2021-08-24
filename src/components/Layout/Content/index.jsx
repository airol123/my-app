import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tableau from './Tableau'
import Detail from './Detail/index.jsx'
import Timebar from './Timebar';
import ChangeCombo from './ChangeCombo/index.jsx'
import './index.css'
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
    <div className={classes.root} style={{ paddingTop: '4%' }}>
      <Grid container spacing={1}>
        <Grid item xs={9} style={{ position: 'relative' }}>
          <div className="gridcss1 backgroundbord  " id='force'></div>
          <div className="gridpath box  " id='path'></div>
          <ChangeCombo />
        </Grid>

        <Grid item xs={3} >
          <div className="gridcss2 backgroundbord listfont"><Tableau ></Tableau></div>
        </Grid>
        <Grid item xs={12} >
          <div id='comboCompo'>
            <div className="detail gridcss4" ><Detail></Detail></div>
            <div id='combo' className="gridcss3 backgroundbord"></div>

          </div>
        </Grid>
        <Grid item xs={12}>
          <div className="gridtimebar backgroundbord" ><Timebar /></div>
        </Grid>


      </Grid>
    </div>
  );
}

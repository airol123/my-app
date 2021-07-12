import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Tableau from './Tableau'
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
    <div className={classes.root}>
      <Grid container spacing={0}>
        <Grid item xs={1}>
          <div id='legend'>

            <div className="divcss">
              <div >
                <h3 >Legend</h3>
              </div>
              <div >
                <div className="divcss2">
                  <img alt='legende' src="https://s3.jpg.cm/2021/06/21/IRcYk5.png" width="30" height="30" border="0"></img>
                  {/* <img src='https://s3.jpg.cm/2021/06/20/IRWQaW.png' width="50" height="50" border="0" ></img>*/}
                </div>
                <div className="divcss1 fontcss"> Evolvable entities</div>
              </div>
              <div>
                <div className="divcss2">
                  <img src="https://s3.jpg.cm/2021/06/17/IP0jwG.png" width="30" height="30" alt="node statique" border="0"></img>
                </div>
                <div className="divcss1 fontcss">Static entities</div>
              </div>

              <div>
                <div className="divcss2">
                  <img src="https://s3.jpg.cm/2021/06/21/IRcMSO.png" alt="edge evolution" border="0"></img>
                </div>
                <div className="divcss1 fontcss">Evolvable relationships</div>
              </div>

              <div>
                <div className="divcss2">
                  <img src="https://s3.jpg.cm/2021/06/21/IRcO3w.png" alt="edge statique" border="0"></img>
                </div>
                <div className="divcss1 fontcss">Static relationships</div>
              </div>



            </div>



          </div>
        </Grid>
        <Grid item xs={8}>
          <div id='force'></div>
        </Grid>
        <Grid item xs={3}>
          <Tableau></Tableau>
        </Grid>
        <Grid  item xs={12}>
         <div id='comboGroup'> 
         <div  id='combo' ></div>

         </div>
        </Grid>

        <Grid item xs={12}>
          <Paper className={classes.paper}>timebar</Paper>
        </Grid>

      </Grid>
    </div>
  );
}

import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tableau from './Tableau'
import Detail from './Detail/index.jsx'
import Timebar from './Timebar';
import ChangeCombo from './ChangeCombo/index.jsx'
import Infobulle from './Infobulle/index.jsx'
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

export default function CenteredGrid(props) {
  const classes = useStyles();
  const { record, labelHistory, changesInfo, indexEtat, node, edge } = props;
  useEffect(() => {
    console.log("changesInfo", changesInfo)
  }, [changesInfo])
  return (
    <div className={classes.root} style={{ paddingTop: '1%' }}>
      <Grid container spacing={1}>
        {/* the place where il is used to display forcegraph */}
        <Grid item xs={9} style={{ position: 'relative' }}>
          <div className="gridcss1 backgroundbord  " id='force'></div>
          <div className="gridpath box  " id='path'></div>
          {/* <ChangeCombo /> */}
        </Grid>
        {/* the place where il is used to display the list next to the forcegraph */}
        <Grid item xs={3} >
          <div className="gridcss2 backgroundbord listfont"><Tableau node={node} edge={edge} ></Tableau></div>
        </Grid>
        {/* the place where il is used to display combograph */}
        <Grid item xs={12} >
          <div id='comboCompo' style={{ position: 'relative' }}>

            <div id='combo' className="gridcss3 backgroundbord"></div>
            <div className="griddetail gridcss4" ><Detail></Detail></div>
            <label className="gridrecord">{record}</label>
          </div>
        </Grid>
        {/* the place where il is used to display calendrier */}

        <Grid item xs={12}>
          <div className="gridtimebar backgroundbord" ><Timebar /></div>
        </Grid>
        {/* the place where il is used to display historyGraph */}

        <Grid item xs={12} n style={{ position: "relative" }} >
          <div className="gridhistorique  boxH " id='history'></div>
          <div className="griddetailHistory " >
            {/* infobulle : show the changes of the node or the relationship */}

            <Infobulle changesInfo={changesInfo} indexEtat={indexEtat}></Infobulle>
          </div>
          <div className="divlabel  labelH"><label> History of {labelHistory}</label></div>
          <div id='postitfont' className="postit divlegende legendfont"> <p className="legend">Legend</p> <p className="postitfont" style={{ color: '#FF0000' }}>Red:attribut disappear</p><p className="postitfont" style={{ color: '#7FFF00' }}>Green:attribut appear</p><p className="postitfont" style={{ color: '#FFB90F' }}>Orange:value of attribut change</p></div>
        </Grid>


      </Grid>
    </div>
  );
}

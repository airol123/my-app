import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '99%',
        maxWidth: '99%',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 500,
        
    },
    listSection: {
        backgroundColor: 'inherit',
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
    },
}));
const colors={"disappear":'#FF0000',"appear":'#7FFF00'};

export default function PinnedSubheaderList(props) {
    const classes = useStyles();
    const [indexSelect, setindexSelect] = useState(0)
    const [list, setlist] = useState([{disappear:[0,1],appear:[0,1],valuechange:[],validtime:[0]},
        {disappear:[0,1],appear:[0,1],valuechange:[],validtime:[0]}])
    const {changesInfo,indexEtat}=props;
    useEffect(() => {
        setlist(changesInfo);
        console.log( "info bulle changesInfo",list[1]["disappear"],typeof(list[1]["disappear"]),indexEtat)
    }, [changesInfo])

    useEffect(() => {
        setindexSelect(indexEtat)
        console.log( "info bulle changesInfo",indexEtat,indexSelect)
    }, [indexEtat])
    return (
        <List className={classes.root} subheader={<li />}>
            {["validtime","disappear", "appear", "valuechange"].map((sectionTitle, index) => (
                <li key={`section-${index}`} className={classes.listSection}>
                    <ul className={classes.ul}>
                        <ListSubheader>{sectionTitle}</ListSubheader>
                        {sectionTitle==="disappear"||sectionTitle==="appear"?Object.keys(list[parseInt(indexSelect)][sectionTitle]).map((key) => (
                            <ListItem style={{color:colors[sectionTitle]}} key={`item-${sectionTitle}-${key}`}>
                                <ListItemText  primary={` ${list[parseInt(indexSelect)][sectionTitle][key]} `}/>
                            </ListItem>
                        )):Object.keys(list[parseInt(indexSelect)][sectionTitle]).map((key) => (
                            <ListItem key={`item-${sectionTitle}-${key}`}>
                                <ListItemText style={{color:"#FFB90F"}}  primary={`${key} ${list[parseInt(indexSelect)][sectionTitle][key]} `}/>
                            </ListItem>
                        ))}
                    </ul>
                </li>
            ))}
        </List>
    );
}

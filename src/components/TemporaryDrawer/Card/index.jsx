import React, { useState, useEffect,useCallback  } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Input from './Inputcard/index.jsx'
import cloneDeep from "lodash/cloneDeep";
const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 370,
        minHeight: 370,
    },

    cardActions: {
        spacing: 2,
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        fontSize: 20,
        fontWeight: 500,
        color: '#87CEFF',
    },

}));

export default function RecipeReviewCard(props) {
    const classes = useStyles();
    const [card, setCard] = useState({});
    const [label, setLabel] = useState("");
    const { id, cards, setCards } = props;
    const handleAND = () => {
        setLabel("AND");
        let list = cloneDeep(cards);
        list.push({})
        
        setCards(list);
        

    };
    const handleOR = () => {
        let list = cloneDeep(cards);
        list.push({})
        setCards(list);
        setLabel("OR");

    };

    const handleDelete = () => {
        let list = cloneDeep(cards);
        // list.splice(list.indexOf(id.toString()),1);
        delete list[id];
        setCards(list);
    

    };

    
    function changeCard() {
       
        let list = cloneDeep(cards)
        list[id] = cloneDeep(card)

        setCards(list)
    }



    useEffect(() => {
       
        changeCard();
     
    }, [card]);

    useEffect(() => {
        console.log("cards3", cards,'id',id)
    })


    return (

        <Card className={classes.root} variant="outlined">

            <CardActions disableSpacing >
                <IconButton aria-label="delete" onClick={handleDelete}>
                    <DeleteIcon />
                </IconButton>

            </CardActions>

            <CardContent>

                <Input relation={label} id={id} card={card} cards={cards} setCard={setCard} />
            </CardContent>
            <CardActions className={classes.cardActions}>
                <Button aria-label="and" style={{ paddingLeft: '30%' }} onClick={handleAND}>
                    AND
                </Button>
                <Button aria-label="or" onClick={handleOR}>
                    OR
                </Button>


            </CardActions>
            <label className={classes.typography}>{id + " : " + label}</label>
        </Card>


    );
}

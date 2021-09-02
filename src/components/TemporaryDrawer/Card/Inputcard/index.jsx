import React, { useState, useEffect, useCallback } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import cloneDeep from "lodash/cloneDeep";
import PubSub from 'pubsub-js'
import { idID } from "@material-ui/core/locale";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300
    },
    forminput: {
        margin: theme.spacing(1),
        width: 120,
    },
    chips: {
        display: "flex",
        flexWrap: "wrap"
    },
    chip: {
        margin: 2
    },
    noLabel: {
        marginTop: theme.spacing(3)
    }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};

let labels = [];
let labelsForQuery = [];
const attributes = [];

const operations = ["=", ">", "<", ">=", "<="];

function getLabels() {
    axios.get(`http://localhost:8080/kaggle/schema`)
        .then(res => {
            labels = cloneDeep(res.data.labels);

        });
}

function getStyles(attribute, attributeA, theme) {
    return {
        fontWeight:
            attributeA.indexOf(attribute) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium
    };
}

export default function MultipleSelect(props) {
    const { relation, id, card, setCard, cards } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [label, setLabel] = useState("");
    var attribute = 'attribute' + id;
    var setAttribute = 'setattribute' + id;
    [attribute, setAttribute] = useState("");
    const [operation, setOperation] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [relationCard, setRelationCard] = useState("");



    const handleChangeLabel = (event) => {
        setLabel(event.target.value);
        setAttributes(event.target.value);

    };
    const handleChange = (event) => {

        setAttribute(event.target.value);
    };
    const handleChangeOpe = (event) => {
        setOperation(event.target.value);
    };
    const handleInput = (event) => {

        setInputValue(event.target.value);
    };

    const handleClickAttribut = () => {
        console.log('ebchqnge', card)
        setT(card.label)


    }

    const useSyncCallback = callback => {
        const [proxyState, setProxyState] = useState({ current: false })

        const Func = useCallback(() => {
            setProxyState({ current: true })
        }, [proxyState])

        useEffect(() => {
            if (proxyState.current === true) setProxyState({ current: false })
        }, [proxyState])

        useEffect(() => {
            proxyState.current && callback()
        })

        return Func
    }
    const setT = (card) => {
        setAttributes(card);
        func();
    };
    /** 将func的方法传递给useSyncCallback然后返回一个新的函数 */
    const func = useSyncCallback(() => {
        console.log(attributes);
    });

    function createCard(relation, id, label, attribute, operation, value) {
        var labelForQuery;
        labelForQuery = labelsForQuery[labels.indexOf(label)];
        var o = new Object()
        o.relation = relation
        o.id = id
        o.label = label
        o.labelForQuery = labelForQuery
        o.attribute = attribute
        o.operation = operation
        o.value = value
        console.log('input create ', o, id)
        return o
    }

    function configCard(relation, id, label, attribute, operation, value) {
        var o = createCard(relation, id, label, attribute, operation, value);

        setCard(o)
        setRelationCard(relation)
    }


    function extraxKeyWord(word) {
        var chars = [];
        for (var i = 0; i < word.length; i++) {
            if (word.charAt(i) != '\n') { 
                chars.push(word.charAt(i)) }
            else { 
                break; }


        }
        return chars.join("");
    }

    function setAttributes(label) {
        let preAttributes
        let reg = /[0-9]+/g;
        let label1 =extraxKeyWord(label) //label.replace(reg, "");
        

        switch (label1) { //如果知道requete怎么写 可以传值label到后端获取attribut
            case 'item':
                preAttributes = ["itemid", "instanceid", "startvalidtime", "endvalidtime"]

                break;
            case 'user':
                preAttributes = ["userid", "startvalidtime", "endvalidtime"]
                break;
            case 'category':
                preAttributes = ["categoryid", "startvalidtime", "endvalidtime"]
                break;
            case 'view': case 'addtocart': case 'transaction':
                preAttributes = ["userid", "instanceitemid", "startvalidtime", "endvalidtime"]
                break;

            case "belongto":
                preAttributes = ["categoryid", "instanceitemid", "startvalidtime"]

                break;
            case "subCategory":
                preAttributes = ["categoryid", "parentid", "startvalidtime"]
                break;

        }
        attributes.splice(0, attributes.length);
        preAttributes.map((pre) => { attributes.push(pre) })
        console.log("attributes", attributes)
    }

    function subPathData() {
        PubSub.subscribe('PATHDATA', (_, stateObj) => {
            console.log(stateObj)
            if (typeof (stateObj.nodes) !== "undefined") {
                console.log("PathData", stateObj.nodes);
                labels = [];
                labelsForQuery = [];
                for (var i = 0; i < stateObj.nodes.length; i++) {
                    labels.push(stateObj.nodes[i].labelForCard);
                    labels = Array.from(new Set(labels));
                    labelsForQuery.push(stateObj.nodes[i].labelForQuery);
                    labelsForQuery = Array.from(new Set(labelsForQuery))
                }
                console.log("PathData", labels, labelsForQuery);
            }
            if (typeof (stateObj.edges) !== "undefined") {
                for (var i = 0; i < stateObj.edges.length; i++) {
                    labels.push("--" + stateObj.edges[i].label + "--");
                    labels = Array.from(new Set(labels));
                    labelsForQuery.push(stateObj.nodes[i].labelsForQuety);
                    labelsForQuery = Array.from(new Set(labelsForQuery))
                }
                console.log("PathData", labels, labelsForQuery);
            }


        });
    }

    useEffect(() => {
        PubSub.unsubscribe('PATHDATA');
        subPathData();
        return () => {

        }
    })

    useEffect(() => {

        configCard(relation, id, label, attribute, operation, inputValue);
        console.log("input confif effect ", card)
    }, [relation, id, label, attribute, operation, inputValue, relationCard])




    useEffect(() => {
        console.log("input card effect", card)
    }, [card])


    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel id="label">Label</InputLabel>
                <Select
                    labelId="label"
                    id="label"
                    value={label}
                    onChange={handleChangeLabel}
                    input={<Input />}
                >
                    {labels.map((label, index) => (
                        <MenuItem key={index} value={label}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-mutiple-name-label">Attribut</InputLabel>
                {console.log("cards[id].attribute", cards[id].attribute)}
                <Select
                    labelId="demo-mutiple-name-label"
                    id="demo-mutiple-name"
                    value={cards[id].attribute}
                    onMouseDown={handleClickAttribut}
                    onChange={handleChange}
                    input={<Input />}
                    MenuProps={MenuProps}
                >
                    {attributes.map((attribute) => (
                        <MenuItem
                            key={attribute}
                            value={attribute}
                            style={getStyles(attribute, attribute, theme)}
                        >
                            {attribute}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
                <InputLabel id="demo-mutiple-checkbox-label">operation</InputLabel>
                <Select
                    labelId="demo-mutiple-checkbox-label"
                    id="demo-mutiple-checkbox"
                    value={operation}
                    onChange={handleChangeOpe}
                    input={<Input />}
                    MenuProps={MenuProps}
                >
                    {operations.map((operation) => (
                        <MenuItem key={operation} value={operation}>
                            {operation}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl className={classes.forminput} noValidate autoComplete="off" onChange={handleInput}>
                <TextField id="standard-basic" label="value" />
            </FormControl>
        </div>
    );
}

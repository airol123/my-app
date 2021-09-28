import React, { useState,useEffect  } from 'react'
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import { AutoSizer, Column, Table } from "react-virtualized";
import PubSub from 'pubsub-js'
import cloneDeep from "lodash/cloneDeep";
const styles = (theme) => ({
  flexContainer: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box"
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    "& .ReactVirtualized__Table__headerRow": {
      flip: false,
      paddingRight: theme.direction === "rtl" ? "0 !important" : undefined
    }
  },
  tableRow: {
    cursor: "pointer"
  },
  tableRowHover: {
    "&:hover": {
      backgroundColor: theme.palette.grey[200]
    }
  },
  tableCell: {
    flex: 1
  },
  noClick: {
    cursor: "initial"
  }
});

class MuiVirtualizedTable extends React.PureComponent {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 70
  };

  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null
    });
  };

  cellRenderer = ({ cellData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={
          (columnIndex != null && columns[columnIndex].numeric) || false
            ? "right"
            : "left"
        }
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(
          classes.tableCell,
          classes.flexContainer,
          classes.noClick
        )}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? "right" : "left"}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  render() {
    const {
      classes,
      columns,
      rowHeight,
      headerHeight,
      ...tableProps
    } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: "inherit"
            }}
            headerHeight={headerHeight}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

/*MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired
    })
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number
};
*/
const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);


// ---render component------

export default function ReactVirtualizedTable() {
    // ---data------
    // obtain the data (subcribe)
    let sample=null;
    const [rows,setRows] =useState([]);
    function subCombodata(){   
        PubSub.subscribe('COMBODATA',(_,stateObj)=>{  
            let construObjList=[];
            if(typeof(stateObj)!=="undefined"&&stateObj!==null){        
                Object.keys(stateObj.attributes).forEach(key => {
                let list=[];
                list.push(key,stateObj.attributes[key]);
                construObjList.push(list);
                // console.log(construObjList)
                });
                if(stateObj.endvalidtime==="null"&&typeof(stateObj.endvalidtime)!=="undefined"){
                        let listT=["endvalidtime","-"];
                        construObjList.push(listT);
                }
                if(typeof(stateObj.comboId)!=="undefined"&&stateObj.comboId!=="null"){
                        let listT=["comboId",stateObj.comboId];
                        construObjList.push(listT);
                }}

            sample=cloneDeep(construObjList)
            setRowsInfo()
            } );

    }


    function createData(id, attributes, values) {
    return { id, attributes, values };
    }


    function  setRowsInfo(){
      // console.log("setRow",rows)
        let rowsInfo=[];
        if (sample!==null){
            for (let i = 0; i < sample.length; i += 1) {
            const randomSelection = sample[i];
            rowsInfo.push(createData(i, ...randomSelection));}
        setRows(rowsInfo)
        // console.log(rows)
    }
    }
    

    useEffect(() => {
      PubSub.unsubscribe('COMBODATA');
        subCombodata();
 
    },
      [rows]);
  return (
    <Paper style={{ height: 500, width: "100%" }}>
      <VirtualizedTable
        rowCount={rows.length}
        rowGetter={({ index }) => rows[index]}
        columns={[
          {
            width: 180,
            label: "Attribute",
            dataKey: "attributes"
          },
          {
            width: 350,
            label: "Value",
            dataKey: "values",
            numeric: true
          }
        ]}
      />
    </Paper>
  );
}

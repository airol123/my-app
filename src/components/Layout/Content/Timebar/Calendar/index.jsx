import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import moment from "moment";
import PubSub from 'pubsub-js'
import { DatePicker, Space } from "antd";
const { RangePicker } = DatePicker;
const dateFormat = "MM/DD/YYYY";

function disabledDate(current) {

    // 1 == February
    // depend on the minimum date and the maximum date of DB
    return (
        (current && current < moment([2015, 0, 28])) ||
        (current && current > moment([2016, 0, 28]))
    );
}



export default function Calendar(props) {
    const [starttime, setStarttime] = useState();
    const [endtime, setEndtime] = useState();
    const [timeSelected, settimeSelected] = useState();
    const {setStartDate,setEndDate} =props;

    function publishDate(starttime,endtime) {
        console.log("publish date")
        PubSub.publish('DATE', [starttime,endtime]);
      }
    function handleSelectTime(value) {
        let st = value[0].format();
        let et = value[1].format();
        let dateSt = st.slice(0, 19);
        let dateEt = et.slice(0, 19); 
        dateSt= dateSt.substring(0, 10) + ' ' + dateSt.substring(10 + 1);
        dateEt= dateEt.substring(0, 10) + ' ' + dateEt.substring(10 + 1);

        setStarttime(dateSt);
        setEndtime(dateEt);
        console.log('selected date', st, dateSt,dateEt);
        publishDate(dateSt,dateEt);
        setStartDate(dateSt);
        setEndDate(dateEt);
    }

    useEffect(() => {
        console.log("date and time", starttime,endtime, timeSelected);
       
    });

    return (
        <div>
            <Space direction="vertical" size={12}>
                <RangePicker
                    defaultValue={[
                        moment("01/28/2015", dateFormat),
                        moment("01/28/2015", dateFormat)
                    ]}
                    disabledDate={disabledDate}
                    onChange={(value) => handleSelectTime(value)}
                />
            </Space>

        </div>
    )
}



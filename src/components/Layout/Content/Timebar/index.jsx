import React , { useState, useEffect }from 'react'
import Calendar  from './Calendar/index.jsx'
import Daybar from './Daybar/index.jsx'



export default function Timebar() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    
    
    useEffect(() => {
        console.log("timebar date and time", startDate,endDate);
       
    });
    return (
        <div>
            <Calendar setStartDate={setStartDate} setEndDate={setEndDate} />
            {startDate==endDate?<Daybar startDate={startDate} endDate={endDate}/>:console.log(false)}
            
        </div>
    )
}



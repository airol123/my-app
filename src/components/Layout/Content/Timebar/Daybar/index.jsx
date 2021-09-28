import React, { useState, useEffect } from 'react';
import PubSub from 'pubsub-js'
import { Grommet, Box, RangeSelector, Stack, Text } from 'grommet';
import { grommet } from 'grommet/themes';

export default  function  Daybar (props,{ direction = 'horizontal' })  {
  const [range, setRange] = useState([12, 16]);
  const [textRange, setTextRange] = useState(['01','02','03','04','05','06','07','08','09','10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20','21','22','23','24'])
  let {startDate}=props;
  let {endDate}=props;
  const onChange = value => {
    console.log("range",value,startDate,endDate)
    setRange(value);
    startDate=startDate.substring(0, 11) + value[0] + startDate.substring(13 );
    endDate=endDate.substring(0, 11) + value[1] + endDate.substring(13 );
    publishDate(startDate,endDate);
    console.log("range",startDate,endDate)
  };

  const impair=["01","03","05","07","08","10","12"];
  const pair=["04","06","09","11"];
  const changeTextrange=(startDate)=>{
    console.log("start",props,startDate.slice(5,7))
    if (impair.includes(startDate.slice(5,7))){
      console.log("impair")
      setTextRange([1,2,3,4,5,6,7,8,9,10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,21,22,23,24,25,26,27,28,29,30,31])
    }
    if(pair.includes(startDate.slice(5,7))){
      setTextRange([1,2,3,4,5,6,7,8,9,10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,21,22,23,24,25,26,27,28,29,30])
  
    }
    if( startDate.slice(5,7)==="02" ){
      if(parseInt( startDate.slice(0,3))%4===0){
        setTextRange([1,2,3,4,5,6,7,8,9,10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,21,22,23,24,25,26,27,28,29])
  
      }else{
        setTextRange([1,2,3,4,5,6,7,8,9,10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,21,22,23,24,25,26,27,28])
  
      }
    }
  }

  
  function publishDate(startDate,endDate) {
    console.log("publish date")
    PubSub.publish('DAY', [startDate,endDate]);
  }

  useEffect(() => {
    
    console.log("date and time");
   
});

  return (
    <Grommet theme={grommet}>
      <Box align="center" pad="small">
        <Stack>
          <Box
            direction={direction === 'vertical' ? 'column' : 'row'}
            justify="between"
            width="large"
          >
            {textRange.map(value => (
              <Box
                key={value}
                width="xxsmall"
                height="xxsmall"
                align="center"
                pad="xsmall"
                border={false}
              >
                <Text style={{ fontFamily: 'monospace' }}>{value}</Text>
              </Box>
            ))}
          </Box>
          <RangeSelector
            direction={direction}
            min={1}
            max={24}
            size="full"
            values={range}
            onChange={onChange}
          />
        </Stack>
      </Box>
    </Grommet>
  );
};

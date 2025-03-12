import React, { useEffect, useRef, useState } from 'react'

import { CChartBar } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import dayjs from 'dayjs'

const SubChart = () => {
  console.log("charts2");
  const[date,setDate]=useState([])
  const[count,setCount]=useState([])

  const [labels, setLabels] = useState([]);

  useEffect(() => {
    // Generate last 10 days as labels
    const last10Days = Array.from({ length: 10 }, (_, i) =>
      dayjs().subtract(i, "day").format("DD/MM") // Format: 01/03, 02/03...
    ).reverse(); // Reverse to maintain order

    setLabels(last10Days);
    },[])   
    console.log(labels);
    

  

  useEffect(() => {
    
    const days =[]
    const counts=[]
    for(let j=0;j<labels.length;j++){
      counts[j]=0;
    }
    const getToday = async () => {
      const response = await fetch("http://127.0.0.1:8080/tenday");
      console.log(response);
      if (response.status == 400) {

      }
      else {
        const data = await response.json();
        console.log(data);
        
        data.forEach(x => {
          console.log(x.Day);
          
           const date = new Date(x.Day);

            
           const day =  date.format("DD"); // "06"
           const month =  date.format("MM"); // "03"

        //   const hour = date.getHours().toString().padStart(2, "0");
        //   const minutes = date.getMinutes().toString().padStart(2, "0");
        //   const seconds = date.getSeconds().toString().padStart(2, "0");

        //   const time = `${hour}:${minutes}:${seconds}`;
        //   console.log(time);
        //   for(let i=0;i<labels.length;i++){
           
            
        //     if(hour==i){
        //       console.log(hour);
        //       counts[i] = x.TotalCount
        //       console.log("value",counts);
              
        //     }
            // else{
            //   counts[i]=0;
            // }
        //   }
          
          // counts.push(x.TotalCount)

        }
      );
      // setHourly(hours)
      console.log(counts);
      
      setCount(counts)
      // console.log(count);

      }
    }
    getToday();
  }, [])

  return (
    <>
      <CChartBar
        data={{
          labels: labels,
          datasets: [
            {
              label: 'Transaction Count',
              backgroundColor: '#f87979',
              data: count,
            },
          ],
        }}
        options={{
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time (Hours)', // Label for X-axis
                font: {
                  size: 14,
                  weight: 'bold',
                },
              },
            },
            y: {
              title: {
                display: true,
                text: 'Transaction Count', // Label for Y-axis
                font: {
                  size: 14,
                  weight: 'bold',
                },
              },
            },
          },
        }}
      />
    </>
  )
}

export default SubChart

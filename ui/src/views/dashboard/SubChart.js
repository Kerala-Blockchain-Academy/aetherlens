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
    
    
    const days =[]
    const counts=[]
    console.log(last10Days.length);
    
    for(let j=0;j<last10Days.length;j++){
      counts[j]=0;
    }
    const getTenDay = async () => {
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
           console.log(date);
           

            
           const day = String(date.getDate()).padStart(2, '0'); // Ensures two digits: "06"
           const month = String(date.getMonth() + 1).padStart(2, '0'); // JS months are 0-indexed
            console.log(month);
            const dayformat = day+"/"+month;
            console.log(dayformat);
            console.log("labelslength",labels.length);
            
            
           for(let i=0;i<last10Days.length;i++){
             
             if(dayformat==last10Days[i]){
              console.log(x.TransCount);
              counts[i] = x.TransCount
         
            }
          }
          
          // counts.push(x.TotalCount)

        }
      );
      // setHourly(hours)
      console.log(counts);
      
      setCount(counts)
      // console.log(count);

      }
    }
    getTenDay();
    },[])   
    console.log(labels);
    

  

  // useEffect(() => {
    
   
  // }, [])

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

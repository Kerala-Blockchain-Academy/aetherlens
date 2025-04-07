import React, { useEffect, useRef, useState } from 'react'

import { CChartBar } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const MainChart = () => {
  console.log("chart1");
  const [hourly, setHourly] = useState([])
  const [count, setCount] = useState([])


  useEffect(() => {

    const hours = []
    const counts = []
    for (let j = 0; j < 24; j++) {
      counts[j] = 0;
    }
    const getToday = async () => {
      const response = await fetch("http://127.0.0.1:8080/today");
      console.log(response);
      if (response.status == 400) {

      }
      else {
        const data = await response.json();
        console.log(data);

        data.forEach(x => {
          console.log(x);

          const date = new Date(x.Hour);

          const hour = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          const seconds = date.getSeconds().toString().padStart(2, "0");

          const time = `${hour}:${minutes}:${seconds}`;
          console.log(time);
          for (let i = 0; i < 24; i++) {


            if (hour == i) {
              console.log(hour);
              counts[i] = x.TotalCount
              console.log("value", counts);

            }

          }

        }
        );

        console.log(counts);

        setCount(counts)


      }
    }
    getToday();
  }, [])

  return (
    <>
      <CChartBar
        data={{
          labels: ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
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

export default MainChart


import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import CardBox from "../shared/CardBox";
import { useEffect, useState } from "react";
import dayjs from 'dayjs'

const SalesProfit = () => {
  const [selected, setSelected] = useState("today");
  const [optionBlock, setOptionblock] = useState<ApexOptions | undefined>(undefined);
  const [labels, setLabels] = useState<any[]>([]);


  useEffect(()=>{
    MainChart()
  },[])

  const MainChart=async()=>{

    setSelected("today")
    const counts:any[] = []
    for (let j = 0; j < 24; j++) {
      counts[j] = 0;
    }
  
      const response = await fetch("http://127.0.0.1:8080/tooDay");
      console.log(response);
      if (response.status == 400) {

      }
      else {
        const data = await response.json();
        console.log(data);

        data.forEach((x:any) => {
          console.log(x.Hour);

          // const date = new Date(x.Hour);
          // console.log(date);
          

          // const hour:string = date.getHours().toString().padStart(2, "0");
          // const minutes = date.getMinutes().toString().padStart(2, "0");
          // const seconds = date.getSeconds().toString().padStart(2, "0");

          // const time = `${hour}:${minutes}:${seconds}`;
          // console.log(time);
          for (let i = 0; i < 24; i++) {


            if (x.Hour == i) {
              console.log(x.Hour);
              counts[i] = x.TotalCount
              console.log("value", counts);

            }

          }

        }
        );
        console.log(counts);
      }
      const dataB:any[]=[]
      counts.forEach((x:any)=>{
        console.log("count",x);
        
         dataB.push(x)
      })
      console.log(dataB);
      
      const optionData: any={
        series:[
          {
            name:"No. of Transactions",
            data:dataB
          }]
        ,
        chart: {
          fontFamily: "inherit",
          type: "bar",
          height: 350,
          offsetY: 10,
          offsetX: -18,
          toolbar: {
            show: false,
          },
        },
        grid: {
          show: true,
          strokeDashArray: 3,
          borderColor: "rgba(0,0,0,.1)",
        },
        colors: ["var(--color-primary)", "var(--color-secondary)"],
    plotOptions: {
      bar: {
        borderRadius: 5,
        horizontal: false,
        columnWidth: "70%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 5,
      colors: ["transparent"],
    },
    xaxis: {
      type: "category",
      categories: ["0", "1", "2", "3", "4", "5", "6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
      title:{
        text:"Hours",
        style:{
          color: "#14B8A6",
          fontSize: "14px",
          fontWeight: 600,
        }
      },

      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: "#a1aab2",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#a1aab2",
        },
      },
      title:{
        text:"No. of Txns",
        style:{
          color: "#14B8A6",
          fontSize: "14px",
          fontWeight: 600,
        }
      },
      min: 0,
      
      tickAmount: 4,
    },

    fill: {
      opacity: 1,
      colors: ["var(--color-primary)", "var(--color-secondary)"],
    },
    tooltip: {
      theme: "dark",
    },
    legend: {
      show: false,
    },

    responsive: [
      {
        breakpoint: 767,
        options: {
          stroke: {
            show: false,
            width: 5,
            colors: ["transparent"],
          },
        },
      },
    ],

      }
      console.log(optionData.series);
      
      
      setOptionblock(optionData)
    
     console.log(optionBlock?.series);
     
  }

  const SubChart=async()=>{
    setSelected("last10")

    const last10Days = Array.from({ length: 10 }, (_, i) =>
      dayjs().subtract(i, "day").format("DD/MM") // Format: 01/03, 02/03...
    ).reverse(); // Reverse to maintain order
    setLabels(last10Days);
    const counts = []
    console.log(last10Days.length);

    for (let j = 0; j < last10Days.length; j++) {
      counts[j] = 0;
    }
    
      const response = await fetch("http://127.0.0.1:8080/tenday");
      console.log(response);
      if (response.status == 400) {

      }
      else {
        const data = await response.json();
        console.log(data);

        data.forEach((x:any) => {
          console.log(x.Day);

          const date = new Date(x.Day);
          console.log(date);



          const day = String(date.getDate()).padStart(2, '0'); // Ensures two digits: "06"
          const month = String(date.getMonth() + 1).padStart(2, '0'); // JS months are 0-indexed
          console.log(month);
          const dayformat = day + "/" + month;
          console.log(dayformat);
          console.log("labelslength", labels.length);


          for (let i = 0; i < last10Days.length; i++) {

            if (dayformat == last10Days[i]) {
              console.log(x.TransCount);
              counts[i] = x.TransCount

            }
          }

        }
        );
        console.log(counts);

        
      }
    

    
      const dataB:any[]=[]
      counts.forEach((x:any)=>{
        console.log("count",x);
        
         dataB.push(x)
      })
      console.log(dataB);
      
      const optionData: any={
        series:[
          {
            name:"No. of Transactions",
            data:dataB
          }]
        ,
        chart: {
          fontFamily: "inherit",
          type: "bar",
          height: 350,
          offsetY: 10,
          offsetX: -18,
          toolbar: {
            show: false,
          },
        },
        grid: {
          show: true,
          strokeDashArray: 3,
          borderColor: "rgba(0,0,0,.1)",
        },
        colors: ["var(--color-primary)", "var(--color-secondary)"],
    plotOptions: {
      bar: {
        borderRadius: 5,
        horizontal: false,
        columnWidth: "50%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 5,
      colors: ["transparent"],
    },
    xaxis: {
      
      type: "category",
      categories: last10Days,
     
      title:{
        text:"Days",
        style:{
          color: "#14B8A6",
          fontSize: "14px",
          fontWeight: 600,
        }
      },

      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: "#a1aab2",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#a1aab2",
        },
      },
      title:{
        text:"No. of Txns",
        style:{
          color: "#14B8A6",
          fontSize: "14px",
          fontWeight: 600,
        }
      },
      min: 0,
      
      tickAmount: 4,
    },

    fill: {
      opacity: 1,
      colors: ["var(--color-primary)", "var(--color-secondary)"],
    },
    tooltip: {
      theme: "dark",
    },
    legend: {
      show: false,
    },

    responsive: [
      {
        breakpoint: 767,
        options: {
          stroke: {
            show: false,
            width: 5,
            colors: ["transparent"],
          },
        },
      },
    ],

      }
      console.log(optionData?.series);
      
      
      setOptionblock(optionData)
    
     console.log(optionBlock?.series);
     
  }


  return (
   
    
    <CardBox className="min-h-[450px]">
      <div className="flex justify-between ">
        <h5 className="card-title">Transactions</h5>
        <div className="inline-flex rounded-full border border-gray-300 overflow-hidden">
      <button
        onClick={() =>MainChart()}
        className={`px-8 py-2 text-sm font-medium focus:outline-none ${
          selected === "today"
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-800"
        } rounded-l-full`}
      >
        Today
      </button>

      <button
        onClick={() =>SubChart()}
        className={`px-4 py-2 text-sm font-medium focus:outline-none border-l border-gray-300 ${
          selected === "last10"
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-800"
        } rounded-r-full`}
      >
        Last 10 Days
      </button>
    </div>
      </div>
        <div>
        {optionBlock && optionBlock.series && (
  <Chart
    options={optionBlock}
    series={optionBlock.series}
    type="bar"
    height="315px"
    width="100%"
  />
)}
        </div>
    </CardBox>
  );
};

export default SalesProfit;

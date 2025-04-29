import { Icon } from "@iconify/react";
import { useState,useEffect } from "react";

const TotalContract = () => {
 
    const [totalContractCount,setTotalContractCount]=useState(0)

  useEffect(()=>{
    async function fetchContractCount(){
        console.log("hello");
      
      const response = await fetch("http://127.0.0.1:8080/contractCount")
      console.log("hi");
      
      const contra= await response.json()
      console.log("Latest",contra);
      
      if(contra!=null){
         setTotalContractCount(contra)
      }
      else{
         console.log("Error Fetching Contratc count");
         
      }
      
      }
      fetchContractCount();
},[])
 
  return (
    <>
      <div className="bg-lighterror rounded-lg p-6 relative w-full break-words">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-14 h-10 rounded-full flex items-center justify-center  bg-error text-white">
              <Icon icon="f7:cube-fill" height={24} />
            </span>
            <h5 className="text-base opacity-70">Contract Count</h5>
          </div>
         
        </div>

        <div className="grid grid-cols-12 gap-[24px] items-end mt-2">
          <div className="xl:col-span-6 col-span-7 flex justify-center items-center">
            <h2 className="text-3xl mb-2 ml-28">{totalContractCount}</h2>
            
          </div>
          
        </div>
      </div>
    </>
  );
};

export default TotalContract;

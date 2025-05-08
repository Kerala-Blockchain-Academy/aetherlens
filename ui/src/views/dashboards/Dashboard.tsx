import { Link } from 'react-router';
import { useState,useEffect } from 'react';
import { Toast, ToastToggle } from "flowbite-react";
import { Icon } from '@iconify/react';
import TxReport from 'src/components/dashboard/TxReport';
import LatestBlock from 'src/components/dashboard/LatestBlock';
import TxCount from 'src/components/dashboard/TxCount';
import TotalContract from 'src/components/dashboard/TotalContract';

const Dashboard = () => {
  const [showAlert,setShowAlert] = useState(false)
  

   useEffect(() => {
      async function fetchLatestBlock() {
        const response = await fetch('/api/latestBlock');
        if(response.status==502 || response.status==500||response.status==400||response.status==403){
          setShowAlert(true);
        }
       
      }
      fetchLatestBlock();
    }, []);
  return (
    <>
     {showAlert && (
         <Toast>
         <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-500 dark:bg-pink-800 dark:text-pink-200">
           <Icon icon="line-md:alert-loop" className="h-5 w-5" />
         </div>
         <div className="ml-3 text-sm font-normal">Something went wrong with blockchain.</div>
         <ToastToggle onDismiss={() => setShowAlert(false)}/>
       </Toast>
      )}
    <div className="grid grid-cols-12 gap-6">
      <div className="lg:col-span-8 col-span-12">
        <TxReport />
      </div>
      <div className="lg:col-span-4 col-span-12">
        <div className="grid grid-cols-1 ">
          <div className="col-span-12 mb-4">
            <LatestBlock />
          </div>
          <div className="col-span-12 mb-4">
            <TxCount />
          </div>
          <div className="col-span-12 ">
            <TotalContract />
          </div>
        </div>
      </div>

      <div className="col-span-12 text-center">
        <p className="text-base">
          Design and Developed by{''}
          <Link
            to="https://kba.ai/"
            target="_blank"
            className="pl-1 text-primary underline decoration-primary"
          >
            Kerala Blockchain Academy
          </Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Dashboard;

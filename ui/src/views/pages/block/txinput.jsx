import { useEffect, useState } from "react";
import { Link, Outlet, useLocation,useParams } from "react-router-dom";
import { CFormInput,CForm,CFormLabel,CFormTextarea } from '@coreui/react'
// import ethers from 'ethers'

export default async function txInput(){
    const thash = useParams();
    console.log(thash.id);
    const[txHash,setTxHash]=useState("");
    const[txInput,setTxInput]=useState("");

    useEffect(()=>{
      setTxHash(thash.id)
    },[])

    useEffect(()=>{
      async function fetchInput(){
        console.log(txHash);
        
      const data1 = {
      
        "jsonrpc": "2.0",
        "method": "eth_getTransactionByHash",
        "params": [
            txHash
        ],
        "id": 1
    
    };
    let res = await fetch("http://127.0.0.1:8545", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data1),
    })
    console.log(res);
    
    let result = await res.json();
    console.log(result.result.input);
    
    setTxInput(result.result.input)
}
fetchInput()
},[txHash])
    
//  console.log(txInput);
    
    

    

    return(
        <>
     <CForm className="row">
  <div className="col-md-4 mb-3">
    <CFormLabel htmlFor="exampleFormControlTextarea1">Input Data</CFormLabel>
    <CFormTextarea id="exampleFormControlTextarea1" value={txInput} rows={20} aria-label="readonly input example" readOnly />
  </div>
  
  <div className="col-md-4 mb-3">
    <CFormLabel htmlFor="exampleFormControlTextarea2">Contract ABI</CFormLabel>
    <CFormTextarea id="exampleFormControlTextarea2" rows={20}  />
  </div>

  <div className="col-md-4 mb-3">
    <CFormLabel htmlFor="exampleFormControlTextarea2">Decoded Data</CFormLabel>
    <CFormTextarea id="exampleFormControlTextarea2" rows={20}  />
  </div>
</CForm>


     
        </>
    )
}
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { CToastBody, CToastClose, CFormLabel, CFormTextarea, CButton, CToast } from '@coreui/react';
import { AppContent, AppSidebar, AppFooter, AppHeader, PageHeader } from 'src/components/index'
import { ethers } from 'ethers'

export default function txInput() {
  const thash = useParams();
  console.log(thash.id);
  const [txHash, setTxHash] = useState("");
  const [txInput, setTxInput] = useState("");
  const [txOutput, setTxOutput] = useState({});
  const [abi, setAbi] = useState([])
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    if (thash.id)
      setTxHash(thash.id)
    setTxOutput({})
  }, [])



  useEffect(() => {
    if (!txHash) return; // Prevent API call if txHash is empty
    async function fetchInput() {
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
      console.log(result.error);
      if(result.error){
        console.log("Entering");
        
        setShowToast(true); 
      }
      else{

      setTxInput(result.result.input)
      }
    }
    fetchInput()
  }, [txHash])

  function handleChange(e) {

    console.log("hi");
    const abiC = e.target.value;
    console.log(typeof (abiC));
    setAbi(abiC)
  }

  function handleDecode() {
    console.log(abi);
    const iface = new ethers.Interface(abi)
    const decoded = iface.parseTransaction({ data: txInput })
    console.log(typeof decoded);

    const decodeJs = JSON.stringify(decoded, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
    const decodedJson = JSON.parse(decodeJs)
    console.log(decodedJson.args[1]);

    setTxOutput(decodedJson)

  }
  useEffect(() => {
    function decodeInput(){
      console.log("Entered decode",txOutput);
    const element = document.getElementById("decodedJson");
  
    let outputText = "";
    if (!txOutput || Object.keys(txOutput).length === 0 || !element) return outputText="Contract Created";
  
  
  
    // Add function name
    if (txOutput.name || txOutput["name"]) {
      console.log(".....Function name ...");
      console.log(txOutput.name);
      outputText += `<span style="color: #FFD700; font-weight: bold;">Function Name:</span> ${txOutput.name || txOutput["name"]}<br/><br/>`;
    };
      
  
    // Handle args
    Object.keys(txOutput)
      .filter(key => key.startsWith("args"))
      .sort((a, b) => parseInt(a.replace("args", "")) - parseInt(b.replace("args", "")))
      .forEach(key => {
        console.log(txOutput[key]);
        let val = txOutput[key];
        console.log(val);
  
        if (Array.isArray(val)) {

          // If it's an array of JSON strings or objects
          val = val.map(item => {
            console.log(typeof(item));
            if (typeof item === "object") {
              try {
                console.log(JSON.parse(item));
                return JSON.parse(item);
              } catch {
                return item;
              }
            }
            return item;
          });

          const formatted = JSON.stringify(val, null, 2)
        .replace(/"(.*?)":/g, '<span style="color: #f783ac;">"$1"</span>:') // keys
        .replace(/: "(.*?)"/g, ': <span style="color: #8ce99a;">"$1"</span>') // string values
        .replace(/: (\d+)/g, ': <span style="color: #91a7ff;">$1</span>'); // numbers

  
        outputText += `<span style="color: #FFB347; font-weight: bold;">${key}:</span><pre style="display:inline;">${formatted}</pre><br/><br/>`;
        } else if (typeof val === "object") {

          const formatted = JSON.stringify(val, null, 2)
        .replace(/"(.*?)":/g, '<span style="color: #f783ac;">"$1"</span>:')
        .replace(/: "(.*?)"/g, ': <span style="color: #8ce99a;">"$1"</span>')
        .replace(/: (\d+)/g, ': <span style="color: #91a7ff;">$1</span>');

        outputText += `<span style="color: #FFB347; font-weight: bold;">${key}:</span><pre style="display:inline;">${formatted}</pre><br/><br/>`;
        } else {
          outputText += `<span style="color: #FFB347; font-weight: bold;">${key}:</span> <span style="color: #ffffff;">${val}</span><br/><br/>`;
        }
      });
  
    element.innerHTML = outputText;
    }
    decodeInput()
  }, [txOutput]);

  

  //  console.log(txInput);





  return (
    <>
     {showToast && (
        <CToast
          autohide={false}
          visible={true}
          color="primary"
          className="text-white align-items-center position-fixed bottom-0 end-0 m-4"
        >
          <div className="d-flex">
            <CToastBody>
              Hello, world! This is a toast message.
            </CToastBody>
            <CToastClose className="me-2 m-auto" white onClick={() => setShowToast(false)} />
          </div>
        </CToast>
      )}

      <div className="wrapper d-flex flex-column min-vh-100">
        <PageHeader />
      
        <div className="row">
          <div className="col-md-4 mb-3">
            <CFormLabel htmlFor="exampleFormControlTextarea1" style={{color:'#DF6D14',fontFamily:'monospace'}}>Input Data</CFormLabel>
            <CFormTextarea id="exampleFormControlTextarea1" value={txInput} rows={20} aria-label="readonly input example" readOnly />
          </div>

          <div className="col-md-4 mb-3 ">
            <div className="mb-3">
              <CFormLabel htmlFor="abi" style={{color:'#DF6D14',fontFamily:'monospace'}}>Contract ABI</CFormLabel>
              <CFormTextarea id="abi" onChange={handleChange} rows={20} />
            </div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end ">
              <CButton type="button" onClick={handleDecode} className="rounded-pill" color="info">Decode</CButton>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <CFormLabel htmlFor="exampleFormControlTextarea2" style={{color:'#DF6D14',fontFamily:'monospace'}}>Decoded Data</CFormLabel>
            {/* <CFormTextarea id="exampleFormControlTextarea2" rows={20} aria-label="readonly input example" readOnly /> */}
            <div className="border rounded p-3 bg-transparent text-light" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <pre id="decodedJson" className="mb-0" style={{ whiteSpace: 'pre-wrap' }}></pre>
            </div>
          </div>
        </div>
      </div>
     
    </>
  )
}
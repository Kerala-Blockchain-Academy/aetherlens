import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { CFormInput, CForm, CFormLabel, CFormTextarea, CButton } from '@coreui/react';
import { AppContent, AppSidebar, AppFooter, AppHeader, PageHeader } from 'src/components/index'
import { func } from "prop-types";
import { ethers } from 'ethers'

export default function txInput() {
  const thash = useParams();
  console.log(thash.id);
  const [txHash, setTxHash] = useState("");
  const [txInput, setTxInput] = useState("");
  const [txOutput, setTxOutput] = useState({});
  const [abi, setAbi] = useState([])
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
      console.log(result);

      setTxInput(result.result.input)
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
    console.log(decoded);


    let inputData = {}
    if (decoded == null) {
      inputData = {
        "function-name": "Contract Created"

      }
    }
    else {

      inputData = {
        "function-name": decoded.name

      }
      decoded.args.forEach((value, index) => {
        if (value == null) {
          inputData[`args${index}`] = "No arguments";
        }
        else {
          if (typeof value === 'bigint') {
            value = value.toString();
          }
          inputData[`args${index}`] = value;
        }

      });
    }

    console.log(inputData);
    setTxOutput(inputData)

  }
  let PrettyPrintJson;
  useEffect(() => {
    function displayInput() {
      console.log(txOutput);

      const element = document.getElementById("decodedJson");
      if (element && txOutput) {
        
        // const jsonString = JSON.stringify(txOutput);


        // Optional: Simple inline syntax highlight (basic)
      //   const highlighted = jsonString
      //     .replace(/("(.*?)")(?=:)/g, '<span style="color: #c92c2c;">$1</span>') // keys
      //     .replace(/: "(.*?)"/g, ': <span style="color: #2f9c0a;">"$1"</span>') // string values
      //     .replace(/: (\d+)/g, ': <span style="color: #1c7ed6;">$1</span>'); // number values

      //   element.innerHTML = `<code>${highlighted}</code>`;
      // }

      // const element = document.getElementById("exampleFormControlTextarea2")
      // PrettyPrintJson = JSON.stringify(txOutput,null,2)
      // console.log(PrettyPrintJson);
      const dataStr = JSON.stringify(txOutput)
      element.innerHTML = prettyPrintJson(txOutput)
      console.log(element.value);

    }}
    function prettyPrintJson(obj) {
      const jsonString = JSON.stringify(obj, null, 2);
    
      return jsonString
        .replace(/("(.*?)")(?=:)/g, '<span style="color: #c92c2c;">$1</span>') // keys
        .replace(/: "(.*?)"/g, ': <span style="color: #2f9c0a;">"$1"</span>') // string values
        .replace(/: (\d+)/g, ': <span style="color: #1c7ed6;">$1</span>') // number values
        .replace(/: (\[.*?\])/gs, (match, group) => {
          // Recursively format nested arrays
          try {
            const parsed = JSON.parse(group);
            return `: <span style="color: #845ef7;">${JSON.stringify(parsed, null, 2)}</span>`;
          } catch {
            return match;
          }
        });
    }
    displayInput()
  }, [txOutput])

  

  //  console.log(txInput);





  return (
    <>

      <div className="wrapper d-flex flex-column min-vh-100">
        <PageHeader />
        <h2>Input Data</h2>

        <div className="row">
          <div className="col-md-4 mb-3">
            <CFormLabel htmlFor="exampleFormControlTextarea1">Input Data</CFormLabel>
            <CFormTextarea id="exampleFormControlTextarea1" value={txInput} rows={20} aria-label="readonly input example" readOnly />
          </div>

          <div className="col-md-4 mb-3 ">
            <div className="mb-3">
              <CFormLabel htmlFor="abi">Contract ABI</CFormLabel>
              <CFormTextarea id="abi" onChange={handleChange} rows={20} />
            </div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end ">
              <CButton type="button" onClick={handleDecode} className="rounded-pill" color="secondary">Decode</CButton>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <CFormLabel htmlFor="exampleFormControlTextarea2">Decoded Data</CFormLabel>
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
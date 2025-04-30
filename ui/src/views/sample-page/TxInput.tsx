// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { Link } from "react-router";
import { Label, Textarea } from "flowbite-react";
import { Button } from "flowbite-react";
import { ethers } from 'ethers';
import { useState,useEffect } from 'react';
import { Alert } from "flowbite-react"



const TxInput = () => {
    const [txInput, setTxInput] = useState("");
    const [searchInput, setSearchInput] = useState("");
     const [abi, setAbi] = useState([]);
      const [txOutput, setTxOutput] = useState<any>({});
      const [showAlert, setShowAlert] = useState(false);
    
    
      useEffect(()=>{
        const placeEl = document.getElementById("txButton")
        console.log(placeEl);
        if(placeEl){
          placeEl.innerHTML = "";
        }
      },[])

    function changeHandler(e:any) {
      console.log(e.target.value);
      
        setSearchInput(e.target.value);
    }

    const shortenHash = (hash:any) => {
        if (!hash) return '';
        return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
    };

    async function handleSearch(e:any) {
        e.preventDefault();
        console.log(searchInput);
        const placeEl = document.getElementById("txButton")
        console.log(placeEl);
        if(placeEl){
          placeEl.innerHTML = "";
        }
        

        let res = await fetch(`http://127.0.0.1:8080/txByNumber/${searchInput}`, {
            method: "GET",
            redirect: "follow"
        })
        console.log(res);

        let lblk = [];
        lblk = await res.json();
        console.log(lblk);
        if(lblk==null){
            
        }
        lblk.forEach((x:any) => {
            console.log(x.Hash);

            const hush = shortenHash(x.Hash)
            const bElement = document.createElement("Button");
            
            bElement.id="HashButton"
            bElement.setAttribute("data-hash", x.Hash);
            bElement.textContent = hush
            bElement.style.padding = "10px 20px";  // Adjust padding (size)
            bElement.style.fontSize = "16px";  // Adjust font size
            bElement.style.borderRadius = "5px";  // Rounded edges
            bElement.style.backgroundColor = "#007bff";  // Bootstrap Primary Color
            bElement.style.color = "white";  // Text color
            bElement.style.border = "none";  // Remove border
            bElement.onclick = handleClick;


            // console.log(bElement.nodeValue);

           

            if (placeEl) {
                placeEl.appendChild(bElement);
              } else {
                console.warn("Element with id 'txButton' not found.");
              }
        });

    }

    async function handleClick() {
        const bEl=document.getElementById("HashButton");
        const bHash=bEl?.getAttribute("data-hash")
        // const bHash = e.target.nodeValue;
        console.log(bHash);
        const data1 = {

            "jsonrpc": "2.0",
            "method": "eth_getTransactionByHash",
            "params": [
                bHash
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
        if(result.error){
          console.log("error");
          
          setShowAlert(true)
        }
        else{
          setTxInput(result.result.input)
        }

       

    }

    function handleChange(e:any) {
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
          const element = document.getElementById("Decoded");
        
          let outputText = "";
          if (txOutput === null) {
            outputText = `<span style="color: #FFB347; font-weight: bold;">Contract Created</span>`;
          } else if (Object.keys(txOutput).length === 0 || txOutput.name === "") {
            outputText = ""; // Leave blank
          }
          else{
        
        
        
          // Add function name
          if (txOutput.name || txOutput["name"]) {
            console.log(".....Function name ...");
            console.log(txOutput.name);
            outputText += `<span style="color: #800080; font-weight: bold;">Function Name:</span><span style="color: #333333;"> ${txOutput.name || txOutput["name"]}</span><br/><br/>`;
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
      
        
              outputText += `<span style="color: #800080; font-weight: bold;">${key}:</span><pre style="color: #333333;display:inline;">${formatted}</pre><br/><br/>`;
              } else if (typeof val === "object") {
      
                const formatted = JSON.stringify(val, null, 2)
              .replace(/"(.*?)":/g, '<span style="color: #f783ac;">"$1"</span>:')
              .replace(/: "(.*?)"/g, ': <span style="color: #8ce99a;">"$1"</span>')
              .replace(/: (\d+)/g, ': <span style="color: #91a7ff;">$1</span>');
      
              outputText += `<span style="color: #800080; font-weight: bold;">${key}:</span><pre style="display:inline;">${formatted}</pre><br/><br/>`;
              } else {
                outputText += `<span style="color: #800080; font-weight: bold;">${key}:</span> <span style="color: #ffffff;">${val}</span><br/><br/>`;
              }
            });
          }
          if(element!=null){
            element.innerHTML = outputText;
          }
          
          }
          decodeInput()
    }, [txOutput])

  return (
    <>
    {showAlert && (
        <Alert color="info" className="rounded-md">
          <span className="font-medium">Info:</span> Something went wrong!Please Check Blocknumber
        </Alert>
      )}
    <h5 className="card-title">Decoded Input</h5>
    <div className='grid'>
    <form className="w-full max-w-md mb-4" onSubmit={handleSearch} >   
    <label  className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div className="relative">
       
        <input type="search" id="default-search" onChange={changeHandler} className="block size-full p-4 ps-10 text-sm text-gray-900 border border-gray-300  bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search using Block Number....." required />
        <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
    </div>
</form>
<div id='txButton'></div>
    <div className='flex flex-wrap gap-12'>
    <div className="max-w-md w-full md:w-1/2">
    <div className="mb-2 block">
        
      <Label htmlFor="comment">Transaction Input</Label>
    </div>
    <Textarea id="comment"  value={txInput} required rows={20} readOnly/>
  </div>
  <div className="max-w-md w-full md:w-1/2">
    <div className="mb-2 block">
        
      <Label htmlFor="comment">ABI</Label>
    </div>
    <Textarea id="comment" onChange={handleChange} placeholder="Paste ABI here..." required rows={20} />
  </div>
  </div>
  <div className="flex flex-wrap gap-2 mt-2 item-center justify-center">
  <Button onClick={handleDecode} color="error">Decode</Button>
  </div>
  <div className="w-full">
    <div className="mb-2 block">
        
      <Label htmlFor="comment">Decoded Output</Label>
    </div>
   
    <div className="border rounded p-3 bg-transparent text-light" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <pre id="Decoded" className="mb-0" style={{ whiteSpace: 'pre-wrap' }}></pre>
            </div>
  </div>
  

  </div>
  <div className="col-span-12 text-center">
      <p className="text-base">
        Design and Developed by{""}
        <Link
          to="https://kba.ai/"
          target="_blank"
          className="pl-1 text-primary underline decoration-primary"
        >
          Kerala Blockchain Academy
        </Link>
      </p>
    </div>
  </>
  );
};

export default TxInput;

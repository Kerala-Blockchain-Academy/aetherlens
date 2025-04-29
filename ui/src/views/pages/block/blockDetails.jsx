import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CFormLabel, CFormTextarea, CButton, CInputGroup, CFormInput } from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { PageHeader } from 'src/components/index'
import { ethers } from 'ethers'
import { func } from "prop-types";

export default function blkDetails() {

    const [searchInput, setSearchInput] = useState("");
    const [txInput, setTxInput] = useState("");
    const [txOutput, setTxOutput] = useState({});
    const [abi, setAbi] = useState({})

    useEffect(() => {
        setAbi([])
        setTxOutput({})
    }, [])

    function handleChange(e) {
        console.log("hi");
        const abiC = e.target.value;
        console.log(typeof (abiC));
        setAbi(abiC)
    }
    function changeHandler(e) {
        setSearchInput(e.target.value);
    }
    const shortenHash = (hash) => {
        if (!hash) return '';
        return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
    };
    async function handleSearch() {
        console.log(searchInput);

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
        lblk.forEach(x => {
            console.log(x.Hash);

            const hush = shortenHash(x.Hash)
            const bElement = document.createElement("Button");
            
            bElement.value = x.Hash
            bElement.textContent = hush
            bElement.style.padding = "10px 20px";  // Adjust padding (size)
            bElement.style.fontSize = "16px";  // Adjust font size
            bElement.style.borderRadius = "5px";  // Rounded edges
            bElement.style.backgroundColor = "#007bff";  // Bootstrap Primary Color
            bElement.style.color = "white";  // Text color
            bElement.style.border = "none";  // Remove border
            bElement.onclick = handleClick;

            console.log(bElement.value);

            const placeEl = document.getElementById("txs")
            console.log(placeEl);

            placeEl.appendChild(bElement)
        });

    }



    async function handleClick(e) {
        const bHash = e.target.value;
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

        setTxInput(result.result.input)

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

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.readAsText(file);

        reader.onload = (e) => {
            const readArray=[]
            try {
                let rawText = e.target.result;
    
                // Strip BOM if exists
                // if (rawText.charCodeAt(0) === 0xFEFF) {
                //     rawText = rawText.slice(1);
                // }

                // rawText = rawText
                // .replace(/[\u00A0]/g, ' ')   // Replace non-breaking spaces with space
                // .replace(/\r/g, '')          // Remove carriage returns
                // .replace(/\t/g, '')          // Remove tabs
                // .replace(/^\s+|\s+$/g, '');  // Trim leading/trailing whitespace
    
                const parsedAbi = JSON.stringify(rawText);
                console.log(parsedAbi);
                const parsedAbiJson = JSON.parse(parsedAbi)
                console.log(parsedAbiJson);
                const abiData = {
                    "abi":[parsedAbiJson]
                }
                console.log(abiData);
                
                // readArray.push(JSON.parse(parsedAbi))
                // console.log(readArray);
                // setAbi(parsedAbiJson)
                
                // if (Array.isArray(parsedAbi)) {
                //     // ✅ ABI is correctly formatted as an array
                //     setAbi(parsedAbi);
                //     console.log("ABI loaded successfully:", parsedAbi);
                // } else {
                //     console.error("ABI file does not contain an array");
                // }
            } catch (error) {
                console.error("Failed to parse ABI file:", error.message);
            }
        };
    
        reader.onerror = (e) => {
            console.error("Error reading file:", e);
        };
    
       
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
    }, [txOutput])

    return (
        <>

            <div className="wrapper d-flex flex-column min-vh-100">
                <PageHeader />
                <h2>Input Data</h2>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <CInputGroup
                            className="mb-3 mt-4 shadow-sm"
                            size="lg"
                            style={{
                                maxWidth: "600px", // Controls width, like Google
                                margin: "auto", // Centers the search bar
                                borderRadius: "50px", // Ensures smooth rounded edges
                                overflow: "hidden", // Prevents child elements from breaking the design
                                border: "1px solid #ccc",
                            }}
                        >
                            <CFormInput
                                placeholder="Search using BlockNumber"
                                aria-label="Search"
                                aria-describedby="button-addon2"
                                onChange={changeHandler}
                                style={{
                                    border: "none", // Removes all borders for a seamless look
                                    padding: "12px 20px", // Matches Google's padding
                                    fontSize: "16px",
                                    borderTopLeftRadius: "50px",
                                    borderBottomLeftRadius: "50px",
                                }}
                            />
                            <CButton
                                type="button"
                                color="secondary"
                                variant="outline"
                                id="button-addon2"
                                onClick={handleSearch}
                                style={{
                                    border: "none", // Removes borders
                                    borderTopRightRadius: "50px",
                                    borderBottomRightRadius: "50px",
                                    padding: "12px 20px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                Search
                            </CButton>
                        </CInputGroup>
                        <div id="txs"></div>
                        <div >
                            <CFormTextarea id="exampleFormControlTextarea1" value={txInput} rows={20} aria-label="readonly input example" readOnly />
                        </div>
                    </div>

                    <div className="col-md-4 mb-3 ">
                        <div className="mb-3">
                            <CFormLabel htmlFor="abi">Contract ABI</CFormLabel>
                            <CFormTextarea id="abi" onChange={handleChange} rows={20} />
                            <CFormInput type="file" onChange={handleFileChange} />

                        </div>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end ">
                            <CButton type="button" onClick={handleDecode} className="rounded-pill" color="secondary">Decode</CButton>
                        </div>
                    </div>

                    <div className="col-md-4 mb-3">
                        <CFormLabel htmlFor="exampleFormControlTextarea2">Decoded Data</CFormLabel>
                        <CFormTextarea id="exampleFormControlTextarea2" rows={20} aria-label="readonly input example" readOnly />
                    </div>
                </div>
            </div>
        </>
    )
}
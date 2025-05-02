import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Label, Textarea } from 'flowbite-react';
import { Button, Alert } from 'flowbite-react';
import { ethers } from 'ethers';

export default function BlkTx() {
  const thash = useParams();
  console.log(thash.id);
  interface TxOutput {
    name: string;
    args: any[];
  }
  const [txHash, setTxHash] = useState('');
  const [txInput, setTxInput] = useState('');
  const [txOutput, setTxOutput] = useState<TxOutput>({ name: '', args: [] });
  const [abi, setAbi] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    console.log(thash.id);

    if (thash.id) setTxHash(thash.id);
    // setTxOutput({name:"",
    //              args:[]
    // })
  }, []);

  useEffect(() => {
    if (!txHash) return; // Prevent API call if txHash is empty
    async function fetchInput() {
      console.log(txHash);

      const data1 = {
        jsonrpc: '2.0',
        method: 'eth_getTransactionByHash',
        params: [txHash],
        id: 1,
      };
      let res = await fetch('http://127.0.0.1:8545', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data1),
      });
      console.log(res);

      let result = await res.json();
      console.log(result.error);
      if (result.error) {
        console.log('Entering');
        setShowAlert(true);
      } else {
        setTxInput(result.result.input);
      }
    }
    fetchInput();
  }, [txHash]);

  function handleChange(e: any) {
    console.log('hi');
    const abiC = e.target.value;
    console.log(typeof abiC);
    setAbi(abiC);
  }

  function handleDecode() {
    console.log(abi);
    const iface = new ethers.Interface(abi);
    const decoded = iface.parseTransaction({ data: txInput });
    console.log(typeof decoded);

    const decodeJs = JSON.stringify(decoded, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value,
    );
    const decodedJson = JSON.parse(decodeJs);
    console.log(decodedJson);
    if (decodedJson == null) {
    }

    setTxOutput(decodedJson);
  }
  useEffect(() => {
    function decodeInput() {
      console.log('Entered decode', txOutput);

      const element = document.getElementById('Decoded');

      let outputText = '';
      if (txOutput === null) {
        outputText = `<span style="color: #FFB347; font-weight: bold;">Contract Created</span>`;
      } else if (Object.keys(txOutput).length === 0 || txOutput.name === '') {
        outputText = ''; // Leave blank
      } else {
        // Add function name
        console.log(txOutput.name);

        if (txOutput.name || txOutput['name']) {
          console.log('.....Function name ...');
          console.log(txOutput.name);
          outputText += `<span style="color: #FFD700; font-weight: bold;">Function Name:</span><span style="color: #f783ac;"> ${txOutput.name || txOutput['name']}</span><br/><br/>`;
        }

        // Handle args
        Object.keys(txOutput)
          .filter((key) => key.startsWith('args'))
          .sort((a, b) => parseInt(a.replace('args', '')) - parseInt(b.replace('args', '')))
          .forEach((key) => {
            console.log(txOutput[key as keyof typeof txOutput]);
            let val = txOutput[key as keyof typeof txOutput];
            console.log(val);

            if (Array.isArray(val)) {
              // If it's an array of JSON strings or objects
              val = val.map((item) => {
                console.log(typeof item);
                if (typeof item === 'object') {
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
            } else if (typeof val === 'object') {
              const formatted = JSON.stringify(val, null, 2)
                .replace(/"(.*?)":/g, '<span style="color: #f783ac;">"$1"</span>:')
                .replace(/: "(.*?)"/g, ': <span style="color: #8ce99a;">"$1"</span>')
                .replace(/: (\d+)/g, ': <span style="color: #91a7ff;">$1</span>');

              outputText += `<span style="color: #FFB347; font-weight: bold;">${key}:</span><pre style="display:inline;">${formatted}</pre><br/><br/>`;
            } else {
              outputText += `<span style="color: #FFB347; font-weight: bold;">${key}:</span> <span style="color: #f783ac;">${val}</span><br/><br/>`;
            }
          });
      }

      if (element != null) {
        element.innerHTML = outputText;
      }
    }
    decodeInput();
  }, [txOutput]);

  //  console.log(txInput);

  return (
    <>
      {showAlert && (
        <Alert color="info" className="rounded-md">
          <span className="font-medium">Info:</span> Something went wrong!Please Check Blocknumber
        </Alert>
      )}
      <h5 className="card-title">Decoded Input</h5>
      <div className="grid">
        <div className="flex flex-wrap gap-12">
          <div className="max-w-md w-full md:w-1/2">
            <div className="mb-2 block">
              <Label htmlFor="comment">Transaction Input</Label>
            </div>
            <Textarea id="comment" value={txInput} required rows={20} readOnly />
          </div>
          <div className="max-w-md w-full md:w-1/2">
            <div className="mb-2 block">
              <Label htmlFor="comment">ABI</Label>
            </div>
            <Textarea
              id="comment"
              onChange={(e) => {
                handleChange(e);
              }}
              placeholder="Paste ABI here..."
              required
              rows={20}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 item-center justify-center">
          <Button onClick={handleDecode} color="error">
            Decode
          </Button>
        </div>
        <div className="w-full">
          <div className="mb-2 block">
            <Label htmlFor="comment">Decoded Output</Label>
          </div>

          <div
            className="border rounded p-3 bg-transparent text-light"
            style={{ maxHeight: '500px', overflowY: 'auto' }}
          >
            <pre id="Decoded" className="mb-0" style={{ whiteSpace: 'pre-wrap' }}></pre>
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
    </>
  );
}

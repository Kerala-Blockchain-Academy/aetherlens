
import { Icon } from "@iconify/react";
import { Table } from "flowbite-react";
import { useParams, Link } from "react-router";
import { useState,useEffect } from "react";
import SimpleBar from "simplebar-react";


const TxDetails = () => {
    const [txDetails, setTxDetails] = useState([])
    const [count, setCount] = useState(0)
    const blk = useParams();
    console.log(blk.id);

    useEffect(() => { TxD()} , [blk.id]);
    async function TxD() {
  
      let res = await fetch(`http://127.0.0.1:8080/txByNumber/${blk.id}`, {
        method: "GET",
        redirect: "follow"
      })
      console.log(res);
  
      let lblk = [];
      lblk = await res.json();
      console.log(lblk);
      const k =JSON.stringify(lblk) 
      const l = JSON.parse(k)

      setTxDetails(l)
  
    }

    const shortenHash = (hash:any) => {
        if (!hash) return '';
        return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
      };

      const handleCopy = async (text:any) => {
        if (document.hasFocus()) {
          try {
            await navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
          } catch (err) {
            console.error('Failed to copy:', err);
          }
        } else {
          alert('Please focus the page and try again.');
        }
      };
      useEffect(()=>{
        setCount(0)
        let c=0;
        txDetails.forEach(x=>{
            c++;
            
        })
        setCount(c)
      },[txDetails])

   
    
      return (
        <>
               
          <div className="rounded-lg dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray py-6 px-0 relative w-full break-words">
            <div className="px-6">
              <h5 className="card-title">Transaction Details</h5>
              <p className="card-subtitle">{`For Block ${blk.id}`}</p>
            </div>
            <SimpleBar className="max-h-[450px]">
           

              <div className="overflow-x-auto">
              <p className="card-subtitle">Total {count} transactions found</p>
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell className="p-6">TxHash</Table.HeadCell>
                    <Table.HeadCell>From</Table.HeadCell>
                    <Table.HeadCell>To</Table.HeadCell>
                    <Table.HeadCell>Input Data</Table.HeadCell>
                    <Table.HeadCell>Amount</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y divide-border dark:divide-darkborder">
                        {txDetails.map((x, index) => {
                            const xString = JSON.stringify(x);
                            const xParsed = JSON.parse(xString);
                            return(
                                <Table.Row key={index}>
                                  <Table.Cell className="whitespace-nowrap ps-6">
                                    <div className="flex gap-3 items-center">
                                      
                                      <div className="truncat line-clamp-2 sm:text-wrap max-w-56">
                                      
                                        <h6 className="text-sm"><span className="inline-flex items-center gap-1">{shortenHash(xParsed.Hash)}<Icon icon="material-symbols:ad-group-sharp" onClick={() => { handleCopy(xParsed.Hash) }} height="18" className="text-dark" />
                                        </span>
                                        </h6>
                                      </div>
                                    </div>
                                  </Table.Cell>
                                  <Table.Cell className="whitespace-nowrap ps-6">
                                  <div className="flex gap-3 items-center">
                                      
                                      <div className="truncat line-clamp-2 sm:text-wrap max-w-56">
                                    <h5 className="text-base text-wrap"><span className="inline-flex items-center gap-1">
                                      {shortenHash(xParsed.From)}<Icon icon="material-symbols:ad-group-sharp" onClick={() => { handleCopy(xParsed.From) }} height="18" className="text-dark" /></span>
                                    </h5>
                                   </div>
                                   </div>
                                   
                                  </Table.Cell>
                                  <Table.Cell className="whitespace-nowrap ps-6">
                                  <div className="flex gap-3 items-center">
                                      
                                      <div className="truncat line-clamp-2 sm:text-wrap max-w-56">
                                    <Link to={`/blkTxInput/${xParsed.Hash}`}  className="underline decoration-solid text-cyan-500"> Click Here</Link>
                                     
                                    
                                   </div>
                                   </div>
                                   
                                  </Table.Cell>
                                  <Table.Cell>
                                    <h5 className="text-base text-wrap"><span className="inline-flex items-center gap-1">
                                      {shortenHash(xParsed.To)}<Icon icon="material-symbols:ad-group-sharp" onClick={() => { handleCopy(xParsed.To) }} height="18" className="text-dark" />
                                    </span>
                                    </h5>
                                   
                                   
                                  </Table.Cell>
                                  <Table.Cell>
                                    <h5 className="text-base text-wrap"><span className="inline-flex items-center gap-1">
                                      {xParsed.Value} Ethers
                                      </span>
                                    </h5>
                                   
                                   
                                  </Table.Cell>
                                 
                                </Table.Row>
                                  );
                        })}
                </Table.Body>

                </Table>
              </div>
            </SimpleBar>
          </div> 
        </>
                
      );
};

export default TxDetails;

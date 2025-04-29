import { Icon } from "@iconify/react";
import { Table } from "flowbite-react";
import { useParams,useNavigate, Link } from "react-router";
import { useState,useEffect } from "react";
import SimpleBar from "simplebar-react";


const BlockDetails = () => {

    const navigate = useNavigate();
    const blk = useParams();
    const [blockDetails, setBlockDetails] = useState({
        blocknumber: "",
        blockhash: "",
        parenthash: "",
        gaslimit: "",
        transactions: 0,
        time: "",
        size: ""
      })

      useEffect(() => { BlockD() }, []);
      async function BlockD() {
    
        let res = await fetch(`http://127.0.0.1:8080/block/${blk.id}`, {
          method: "GET",
          redirect: "follow"
        })
        console.log(res);
    
        let lblk;
    
        lblk = await res.json();
        console.log(lblk.ID);
        if(lblk.ID==0){
          navigate('/auth/404')
        }
    
    
        let result = await fetch(`http://127.0.0.1:8080/txCountbyNumber/${blk.id}`)
        console.log(result);
    
        let count;
        count = await result.json();
        console.log(count);
        const btime = lblk.Time * 1000;
        console.log(btime);
        const date = new Date(btime);
        console.log(date);
        const cdate = Date.now()
        console.log("date", cdate);
        const diff = (cdate - btime);
        console.log(diff);
        let ago;
        if (diff > 59) {
          const sec = Math.floor(diff / 1000);
          console.log(sec);
          if (sec > 59) {
            const min = Math.floor(sec / 60)
            console.log(min);
            if (min > 59) {
              const hr = Math.floor(min / 60)
              console.log(hr);
              if (hr > 23) {
                const ddy = Math.floor(hr / 24)
                console.log(ddy);
                ago = `${ddy} days ago`
              }
              else {
                ago = `${hr} hr ago`
              }
            }
            else {
              ago = `${min} min ago`
            }
    
          }
          else {
            ago = `${sec} secs ago`
          }
    
        }
        else {
          ago = `${diff} msecs ago`
        }
    
    
    
    
        const block = {
          blocknumber: lblk.Number,
          blockhash: lblk.Hash,
          parenthash: lblk.ParentHash,
          gaslimit: lblk.GasLimit,
          transactions: count,
          time: ago,
          size: lblk.Size
        }
    
        setBlockDetails(block)
    
    
    
      }

      const shortenHash = (hash:string) => {
        if (!hash) return '';
        return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
      };
    
      const handleCopy = async (text:string) => {
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

 
  return (
    <>
      <div className="rounded-lg dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray py-6 px-0 relative w-full break-words">
        <div className="px-6">
          <h5 className="card-title">{`Block #${blk.id}`} </h5>
        </div>
        <SimpleBar className="max-h-[450px]">
          <div className="overflow-x-auto">
            <Table hoverable>
             
              <Table.Body className="divide-y divide-border dark:divide-darkborder ">

                  <Table.Row >
                    <Table.Cell className="ps-2 py-2">
                      <div className="flex gap-0.5 items-center"> 
                        <div className="truncate max-w-48">
                          <h6 className="text-sm">Block Height 
                          <span className="text-dark opacity-70">
                          <span className="text-dark opacity-70 mx-1">:</span>
                        </span>
                      </h6>
                        </div>
                      </div>
                    </Table.Cell>
                     <Table.Cell className="ps-2 py-2">
                      <h5 className="text-base text-wrap">
                        {blockDetails.blocknumber}
                      </h5>
                    </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                    <Table.Cell className="ps-2 py-2">
                      <div className="flex gap-0.5 items-center"> 
                        <div className="truncate max-w-48">
                          <h6 className="text-sm">Block Hash 
                          <span className="text-dark opacity-70">
                          <span className="text-dark opacity-70 mx-1">:</span>
                        </span>
                      </h6>
                        </div>
                      </div>
                    </Table.Cell>
                     <Table.Cell className="ps-2 py-2">
                      <h5 className="text-base text-wrap flex"><span className="inline-flex items-center gap-1">
                        {shortenHash(blockDetails.blockhash)}<Icon icon="material-symbols:ad-group-sharp" onClick={() => { handleCopy(blockDetails.blockhash) }} height="18" className="text-dark" /></span>
                      </h5>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="ps-2 py-2">
                      <div className="flex gap-0.5 items-center"> 
                        <div className="truncate max-w-48">
                          <h6 className="text-sm">Parent Hash 
                          <span className="text-dark opacity-70">
                          <span className="text-dark opacity-70 mx-1">:</span>
                        </span>
                      </h6>
                        </div>
                      </div>
                    </Table.Cell>
                     <Table.Cell className="ps-2 py-2">
                      <h5 className="text-base text-wrap flex"><span className="inline-flex items-center gap-1">
                        {shortenHash(blockDetails.parenthash)}<Icon icon="material-symbols:ad-group-sharp" onClick={() => { handleCopy(blockDetails.parenthash) }} height="18" className="text-dark" /></span>
                      </h5>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="ps-2 py-2">
                      <div className="flex gap-0.5 items-center"> 
                        <div className="truncate max-w-48">
                          <h6 className="text-sm">Gas Limit 
                          <span className="text-dark opacity-70">
                          <span className="text-dark opacity-70 mx-1">:</span>
                        </span>
                      </h6>
                        </div>
                      </div>
                    </Table.Cell>
                     <Table.Cell className="ps-2 py-2">
                      <h5 className="text-base text-wrap flex">
                        {blockDetails.gaslimit}
                      </h5>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="ps-2 py-2">
                      <div className="flex gap-0.5 items-center"> 
                        <div className="truncate max-w-48">
                          <h6 className="text-sm">Transactions
                          <span className="text-dark opacity-70">
                          <span className="text-dark opacity-70 mx-1">:</span>
                        </span>
                      </h6>
                        </div>
                      </div>
                    </Table.Cell>
                     <Table.Cell className="ps-2 py-2">
                      {/* <h5 className="text-base text-wrap flex"> */}
                       <Link  className="underline decoration-solid text-cyan-500"to={`/blkTx/${blk.id}`}>{blockDetails.transactions}</Link>
                      {/* </h5> */}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="ps-2 py-2">
                      <div className="flex gap-0.5 items-center"> 
                        <div className="truncate max-w-48">
                          <h6 className="text-sm">Time 
                          <span className="text-dark opacity-70">
                          <span className="text-dark opacity-70 mx-1">:</span>
                        </span>
                      </h6>
                        </div>
                      </div>
                    </Table.Cell>
                     <Table.Cell className="ps-2 py-2">
                      <h5 className="text-base text-wrap flex">
                        {blockDetails.time}
                      </h5>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="ps-2 py-2">
                      <div className="flex gap-0.5 items-center"> 
                        <div className="truncate max-w-48">
                          <h6 className="text-sm">Size 
                          <span className="text-dark opacity-70">
                          <span className="text-dark opacity-70 mx-1">:</span>
                        </span>
                      </h6>
                        </div>
                      </div>
                    </Table.Cell>
                     <Table.Cell className="ps-2 py-2">
                      <h5 className="text-base text-wrap flex">
                        {blockDetails.size} bytes
                      </h5>
                    </Table.Cell>
                  </Table.Row>
                 
              </Table.Body>
            </Table>
          </div>
        </SimpleBar>
      </div>
    </>
  );
};

export default BlockDetails;

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { Icon } from '@iconify/react';
import { Table } from 'flowbite-react';

import SimpleBar from 'simplebar-react';

const ContractTxns = () => {
  console.log('Hello');
  const blk = useParams();
  console.log(blk.id);

  const [txDetails, setTxDetails] = useState([]);

  useEffect(() => {
    TxD();
  }, []);
  async function TxD() {
    console.log('HEEELoo');

    let res = await fetch(`/api/contractTx/${blk.id}`, {
      method: 'GET',
      redirect: 'follow',
    });
    console.log(res);

    let lblk = [];
    lblk = await res.json();
    console.log(lblk);

    const updatedTxDetails = lblk.map((tx: any) => {
      // Assuming `tx.Time` is a UNIX timestamp in seconds
      const timestamp = tx.Time * (tx.Time.toString().length === 10 ? 1000 : 1);
      tx.Time = timeAgo(timestamp);
      return tx;
    });

    setTxDetails(updatedTxDetails);
  }
  const timeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000); // difference in seconds
  
    if (diff < 60) return `${diff} sec${diff !== 1 ? 's' : ''} ago`;
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
    const months = Math.floor(days / 30);
     if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
     const years = Math.floor(months / 12);
     return `${years} year${years !== 1 ? 's' : ''} ago`;
  };

  // const [contractCalls, setContractCalls] = useState([])
  // const [count, setCount] = useState(0)
  // useEffect(() => { ContractCall() }, []);
  // async function ContractCall() {

  //   let res = await fetch("/api/allContracts", {
  //     method: "GET",
  //     redirect: "follow"
  //   })
  //   console.log(res);

  //   let lblk = [];
  //   lblk = await res.json();
  //   console.log(lblk);
  //   const lblks = JSON.stringify(lblk);
  //   const lblkp = JSON.parse(lblks)
  //   setContractCalls(lblkp)

  // }

  // useEffect(()=>{
  //     let c=0;
  //     contractCalls.forEach(x=>{
  //         c++;

  //     })
  //     setCount(c);
  // },[contractCalls])

  const shortenHash = (hash: any) => {
    if (!hash) return '';
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  };

  const handleCopy = async (text: any) => {
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
          <h5 className="card-title">Contract Transactions</h5>
        </div>
        <SimpleBar className="max-h-[450px]">
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell className="p-6">Transaction Hash</Table.HeadCell>
                <Table.HeadCell>Block</Table.HeadCell>
                <Table.HeadCell>From</Table.HeadCell>
                <Table.HeadCell>To</Table.HeadCell>
                <Table.HeadCell>Input Data</Table.HeadCell>
                <Table.HeadCell>Time</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-border dark:divide-darkborder ">
                {txDetails.map((item, index) => {
                  const it = JSON.stringify(item);
                  const itm = JSON.parse(it);
                  console.log(itm);

                  return (
                    <Table.Row key={index}>
                      <Table.Cell className="whitespace-nowrap ps-6">
                        <div className="flex gap-3 items-center">
                          <div className="truncat line-clamp-2 sm:text-wrap max-w-56">
                            <h6 className="text-sm">
                              <span className="inline-flex items-center gap-1">
                                {shortenHash(itm.Hash)}
                                <Icon
                                  icon="material-symbols:ad-group-sharp"
                                  onClick={() => {
                                    handleCopy(itm.Hash);
                                  }}
                                  height="18"
                                  className="text-dark"
                                />
                              </span>
                            </h6>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap ps-6">
                        <div className="flex gap-3 items-center">
                          <div className="truncat line-clamp-2 sm:text-wrap max-w-56">
                            <h6 className="text-sm">{itm.BlockNumber} </h6>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap ps-6">
                        <div className="flex gap-3 items-center">
                          <div className="truncat line-clamp-2 sm:text-wrap max-w-56">
                            <h6 className="text-sm">
                              <span className="inline-flex items-center gap-1">
                                {shortenHash(itm.From)}
                                <Icon
                                  icon="material-symbols:ad-group-sharp"
                                  onClick={() => {
                                    handleCopy(itm.From);
                                  }}
                                  height="18"
                                  className="text-dark"
                                />
                              </span>
                            </h6>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap ps-6">
                        <div className="flex gap-3 items-center">
                          <div className="truncat line-clamp-2 sm:text-wrap max-w-56">
                            <h6 className="text-sm">
                              <span className="inline-flex items-center gap-1">
                                {shortenHash(itm.To)}
                                <Icon
                                  icon="material-symbols:ad-group-sharp"
                                  onClick={() => {
                                    handleCopy(itm.To);
                                  }}
                                  height="18"
                                  className="text-dark"
                                />
                              </span>
                            </h6>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap ps-6">
                        <div className="flex gap-3 items-center">
                          <div className="truncat line-clamp-2 sm:text-wrap max-w-56">
                            <h6 className="text-sm">
                              <Link
                                to={`/blkTxInput/${itm.Hash}`}
                                className="underline decoration-solid text-cyan-500"
                              >
                                {' '}
                                Click Here
                              </Link>
                            </h6>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap ps-6">
                        <div className="flex gap-3 items-center">
                          <div className="truncat line-clamp-2 sm:text-wrap max-w-56">
                            <h6 className="text-sm">{itm.Time} </h6>
                          </div>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </div>
        </SimpleBar>
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
};

export default ContractTxns;

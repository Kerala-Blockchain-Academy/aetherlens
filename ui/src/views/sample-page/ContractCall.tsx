import { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router';
import { Icon } from '@iconify/react';
import { Table } from 'flowbite-react';

import SimpleBar from 'simplebar-react';

const ContractCall = () => {
  console.log('Hello');
  const navigate = useNavigate()
  const [contractCalls, setContractCalls] = useState([]);
  const [count, setCount] = useState(0);
  useEffect(() => {
     async function getUser(){
    const response = await fetch("http://127.0.0.1:8080/verify",{
      credentials:'include'
    })
    console.log(response);
    

    if(response.status!=200){
      alert('Sorry!You are not allowed')
      navigate('/')
    }

    const data = await response.json();
    console.log(data);
    
  }
  getUser()
    ContractCall();
  }, []);
  async function ContractCall() {
    let res = await fetch('/api/allContracts', {
      method: 'GET',
      redirect: 'follow',
      credentials:'include'
    });
    console.log(res);
    if(res.status==400||res.status==404||res.status==500){
      console.log("Data not available at DB or Internal server error");
      setCount(0)
    }
    else if(res.status==401){
      console.log("Unauthorized access");
      setCount(0)
    }
    else{

    let lblk = [];
    lblk = await res.json();
    console.log(lblk);
    const lblks = JSON.stringify(lblk);
    const lblkp = JSON.parse(lblks);
    setContractCalls(lblkp);
  }}

  useEffect(() => {
    let c = 0;
    contractCalls.forEach((x) => {
      console.log(x);

      c++;
    });
    setCount(c);
  }, [contractCalls]);

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
          <h5 className="card-title">Contract Calls</h5>
          <p className="card-subtitle">Total {count} Contract Created</p>
        </div>
        <SimpleBar className="max-h-[450px]">
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell className="p-6">Contract</Table.HeadCell>
                <Table.HeadCell>Calls</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-border dark:divide-darkborder ">
                {contractCalls.map((item, index) => {
                  const it = JSON.stringify(item);
                  const itm = JSON.parse(it);
                  console.log(itm.Address);

                  return (
                    <Table.Row key={index}>
                      <Table.Cell className="whitespace-nowrap ps-6">
                        <div className="flex gap-3 items-center">
                          <div className="truncat line-clamp-2 sm:text-wrap max-w-56">
                            <h6 className="text-sm">
                              <span className="inline-flex items-center gap-1">
                                {shortenHash(itm.Address)}
                                <Icon
                                  icon="material-symbols:ad-group-sharp"
                                  onClick={() => {
                                    handleCopy(itm.Address);
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
                                to={`/ctxns/${itm.Address}`}
                                className="underline decoration-solid text-cyan-500"
                              >
                                {itm.Call}
                              </Link>
                            </h6>
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

export default ContractCall;

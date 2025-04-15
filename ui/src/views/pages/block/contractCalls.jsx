import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { AppContent, AppSidebar, AppFooter, AppHeader, PageHeader } from 'src/components/index'
// import styles from "./style/Home.module.css";
import { useNavigate } from "react-router-dom";
import CIcon from '@coreui/icons-react'
import { cilClone } from '@coreui/icons'
import { CTable } from '@coreui/react'
function contractCalls() {
  console.log("Hello");
  const [contractCalls, setContractCalls] = useState([])
  const [items, setItems] = useState([])
  useEffect(() => { ContractCall() }, []);
  async function ContractCall() {

    let res = await fetch("http://127.0.0.1:8080/allContracts", {
      method: "GET",
      redirect: "follow"
    })
    console.log(res);

    let lblk = [];
    lblk = await res.json();
    console.log(lblk);
    setContractCalls(lblk)

  }



  //   console.log(txDetails);
  const columns = [
    {
      key: 'id',
      label: '#',
      _props: { scope: 'col' },
    },
    {
      key: 'ContractAccount',
      _props: { scope: 'col' },
    },
    {
      key: 'Calls',
      label: 'Calls',
      _props: { scope: 'col' },
    },



  ]



  let c = 1;
  useEffect(() => {
    const newItems = []
    function ContractDetailsFn() {
      console.log(contractCalls);
      console.log(typeof items);
      // let k=0;
      // txDetails.map(x=>{
      //   console.log(x);
      //   k++;
      // })
      // console.log(k);

      contractCalls.forEach(x => {

        console.log(x);

        let itemDetails =
        {
          id: c,
          ContractAccount: <div>{x.Address}</div>,
          Calls: <Link to={`/contractTrxs/${x.Address}`} >{x.Call}</Link>,
          // To: <div>{shortenHash(x.To)} <CIcon icon={cilClone} onClick={() => { handleCopy(blockDetails.blockhash) }} height={15} /></div>,
          // InputData: <Link to={`/trxInput/${x.Hash}`}>View Data</Link>,
          // Value: x.Value,
          _cellProps: { id: { scope: 'row' } },
        }

        console.log(itemDetails);

        newItems.push(itemDetails)
        setItems(newItems)
        c++;

      });
      console.log(items);


    }
    ContractDetailsFn()
  }, [contractCalls])


  // contractCalls.forEach(x => {


  //   items = [
  //     {
  //       id: c,
  //       ContractAccount: <div>{x.Address}</div>,
  //       Calls: <Link to={`/contractTrxs/${x.Address}`} >{x.Call}</Link>,
  //       // To: <div>{shortenHash(x.To)} <CIcon icon={cilClone} onClick={() => { handleCopy(blockDetails.blockhash) }} height={15} /></div>,
  //       // InputData: <Link to={`/trxInput/${x.Hash}`}>View Data</Link>,
  //       // Value: x.Value,
  //       _cellProps: { id: { scope: 'row' } },
  //     },



  //   ]
  //   c++;

  // });

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <PageHeader />
        <h2>Contract Calls</h2>


        <CTable columns={columns} items={items} />
        {/* <Link to="transactions">trr</Link> */}

      </div>
    </div>
  )

}
export default contractCalls;
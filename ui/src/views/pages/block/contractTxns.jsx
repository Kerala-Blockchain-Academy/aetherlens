import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { AppContent, AppSidebar, AppFooter, AppHeader, PageHeader } from 'src/components/index'
// import styles from "./style/Home.module.css";
import { useNavigate } from "react-router-dom";
import CIcon from '@coreui/icons-react'
import { cilClone } from '@coreui/icons'
import { CTable } from '@coreui/react'
function contractTxns() {
  console.log("Hello");
  const cAddress = useParams()
  console.log(cAddress.id);

  const [items, setItems] = useState([])
  const [txDetails, setTxDetails] = useState([])
  useEffect(() => { TxD() }, []);
  async function TxD() {
    console.log("HEEELoo");

    let res = await fetch(`http://127.0.0.1:8080/contractTx/${cAddress.id}`, {
      method: "GET",
      redirect: "follow"
    })
    console.log(res);

    let lblk = [];
    lblk = await res.json();
    console.log(lblk);
    setTxDetails(lblk)

  }



  console.log(txDetails);
  const columns = [
    {
      key: 'id',
      label: '#',
      _props: { scope: 'col' },
    },
    {
      key: 'TxHash',
      _props: { scope: 'col' },
    },
    {
      key: 'From',
      label: 'From',
      _props: { scope: 'col' },
    },
    {
      key: 'To',
      label: 'To',
      _props: { scope: 'col' },
    },
    {
      key: 'InputData',
      label: 'Input Data',
      _props: { scope: 'col' },
    },
    {
      key: 'Value',
      label: 'Value',
      _props: { scope: 'col' },
    },
  ]

  let c = 1;
  const shortenHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  };

  const handleCopy = async (text) => {
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

  useEffect(() => {
    const newItems = []
    function txDetailsFn() {
      console.log(txDetails);
      console.log(typeof items);
      // let k=0;
      // txDetails.map(x=>{
      //   console.log(x);
      //   k++;
      // })
      // console.log(k);

      txDetails.forEach(x => {

        console.log(x);

        let itemDetails =
        {
          id: c,
          TxHash: <div>{shortenHash(x.Hash)} <CIcon icon={cilClone} onClick={() => { handleCopy(blockDetails.blockhash) }} height={15} /></div>,
          From: <div>{shortenHash(x.From)} <CIcon icon={cilClone} onClick={() => { handleCopy(blockDetails.blockhash) }} height={15} /></div>,
          To: <div>{shortenHash(x.To)} <CIcon icon={cilClone} onClick={() => { handleCopy(blockDetails.blockhash) }} height={15} /></div>,
          InputData: <Link to={`/trxInput/${x.Hash}`}>View Data</Link>,
          Value: x.Value,
          _cellProps: { id: { scope: 'row' } },
        }

        console.log(itemDetails);

        newItems.push(itemDetails)
        setItems(newItems)
        c++;

      });
      console.log(items);


    }
    txDetailsFn()
  }, [txDetails])

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <PageHeader />
        <h2>Block Details</h2>


        <CTable columns={columns} items={items} />
        {/* <Link to="transactions">trr</Link> */}

      </div>
    </div>
  )


}
export default contractTxns;
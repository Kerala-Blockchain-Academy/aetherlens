import { useEffect, useState } from "react";
import { Link, Outlet, useLocation,useParams } from "react-router-dom";
import { AppContent, AppSidebar, AppFooter, AppHeader } from 'src/components/index'
// import styles from "./style/Home.module.css";
import { useNavigate  } from "react-router-dom";
import CIcon from '@coreui/icons-react'
import { cilClone } from '@coreui/icons'
import { CTable } from '@coreui/react'
function transactions() {
  console.log("Hello");
  const blk = useParams()
  console.log(blk);
  
  const[txDetails,setTxDetails]=useState([])
  useEffect(() => { TxD() }, []);
  async function TxD() {
   
    let res = await fetch(`http://127.0.0.1:8080/txByNumber/${blk.id}`,{
          method: "GET",
         redirect: "follow"
    })
    console.log(res);
    
    let lblk=[];
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

  let items=[];
  
  let c=1;
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

  
  txDetails.forEach(x => {

    
    items = [
       {
    id: c,
    TxHash:<div>{shortenHash(x.Hash)} <CIcon icon={cilClone} onClick={()=>{handleCopy(blockDetails.blockhash)}} height={15} /></div>,
    From:<div>{shortenHash(x.From)} <CIcon icon={cilClone} onClick={()=>{handleCopy(blockDetails.blockhash)}} height={15} /></div>,
    To: <div>{shortenHash(x.To)} <CIcon icon={cilClone} onClick={()=>{handleCopy(blockDetails.blockhash)}} height={15} /></div>,
    InputData:<Link to={`/trxInput/${x.Hash}`}>View Data</Link>,
    Value:x.Value,
    _cellProps: { id: { scope: 'row' } },
  },

     
      
    ]
    c++;
  
  });

  return(
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
      <h2>Block Details</h2>
    

  <CTable columns={columns} items={items} />
     {/* <Link to="transactions">trr</Link> */}

    </div>
    </div>
  ) 

}
export default transactions;
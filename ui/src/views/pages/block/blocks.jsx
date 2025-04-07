import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { AppContent, AppSidebar, AppFooter, PageHeader } from 'src/components/index'
// import styles from "./style/Home.module.css";
import { useNavigate } from "react-router-dom";
import CIcon from '@coreui/icons-react'
import { cilClone } from '@coreui/icons'
import { CTable } from '@coreui/react'
function blocks() {
  console.log("Hello");
  const blk = useParams()
  console.log(blk);

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
    console.log(lblk);


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
  useEffect(() => {
    function getTime() {

    }
  }, [blockDetails])
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




  const columns = [
    {
      key: 'BlockDetails',
      label: 'BlockDetails',
      _props: { scope: 'col' },
    },
    {
      key: 'Values',
      _props: { scope: 'col' },
    },


  ]
  const items = [
    {
      id: 1,

      BlockDetails: 'BlockNumber',
      Values: blockDetails.blocknumber,
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: 2,
      BlockDetails: 'BlockHash',
      Values: <div>{shortenHash(blockDetails.blockhash)} <CIcon icon={cilClone} onClick={() => { handleCopy(blockDetails.blockhash) }} height={15} /></div>,
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: 3,
      BlockDetails: 'ParentHash',
      Values: <div>{shortenHash(blockDetails.parenthash)} <CIcon icon={cilClone} onClick={() => { handleCopy(blockDetails.parenthash) }} height={15} /></div>,
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: 3,
      BlockDetails: 'GasLimit',
      Values: blockDetails.gaslimit,
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: 3,
      BlockDetails: 'Transactions',
      Values: <div style={{ display: 'flex' }}><Link to={`/trxns/${blockDetails.blocknumber}`}><h5>{blockDetails.transactions}</h5></Link>&nbsp;&nbsp;  transactions</div>,
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: 3,
      BlockDetails: 'Time',
      Values: blockDetails.time,
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: 3,
      BlockDetails: 'Size',
      Values: blockDetails.size,
      _cellProps: { id: { scope: 'row' } },
    },
  ]


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

  //   }

}
export default blocks;
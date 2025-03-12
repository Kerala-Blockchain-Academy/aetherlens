import { useEffect, useState } from "react";
import { Link, Outlet, useLocation,useParams } from "react-router-dom";
// import styles from "./style/Home.module.css";
import { useNavigate  } from "react-router-dom";
function blocks() {
    console.log("hi");
    const location = useLocation();
    const blk = location.state
    
  
//   const navigate = useNavigate();
//   const [isMounted,setIsMounted] =useState(false);
//   const [blockdetails, setblockdetails] = useState([]);
//   const [transCount, settransCount] = useState();
  useEffect(() => { BlockD() }, []);
  async function BlockD() {
   
    let res = await fetch("http://127.0.0.1:8080/blockDetails/",{
          method: "GET",
         redirect: "follow"
    })
    console.log(res);
    
    let lblk =[]
    lblk = await res.json();
    console.log(lblk);
}
 
//  lblk.forEach(element => {
    
//  });
 
  return (
    <div>
      <h2>Block Details</h2>
      <table border="1">
    <thead>
       
    </thead>
    <tbody>
        <tr><td><p>Block Height:</p></td><td>{blk}</td></tr>
        <tr><td><p>Block Hash:</p></td><td></td></tr>
        <tr><td><p>Block Timestamp:</p></td><td></td></tr>
        <tr><td><p>Transactions:</p></td><td></td></tr>
        <tr><td><p>Size:</p></td><td></td></tr> 
        <tr><td><p>Difficulty:</p></td><td></td></tr> 
        <tr><td><p>Miner:</p></td><td></td></tr> 
        <tr><td><p>Gas:</p></td><td></td></tr> 
        <tr><td><p>Gas Limit:</p></td><td></td></tr> 
        <tr><td><p>Nonce:</p></td><td></td></tr> 
        <tr><td><p>Total Difficulty:</p></td><td></td></tr> 
        <tr><td><p>Parent Hash:</p></td><td></td></tr>
        <tr><td><p>Receipts Root:</p></td><td></td></tr> 
        <tr><td><p>State Root:</p></td><td></td></tr> 
        <tr><td><p>Sha3Uncles:</p></td><td></td></tr>
    </tbody>
    <tfoot>
        <tr>
            <td colSpan="2" style={{ textAlign: "center", fontWeight: "bold" }}>End of Block Details</td>
        </tr>
    </tfoot>
</table>
     {/* <Link to="transactions">trr</Link> */}

    </div>
   )
//   }

}
export default blocks;
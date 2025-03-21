import React, { useEffect, useRef ,useState} from 'react'
import PropTypes from 'prop-types'
import { cil3d,cilFile,cilListRich, cibTwitter, cilCalendar } from '@coreui/icons'
import {
  CRow,
  CCol,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import CubeIcon  from '@heroicons/react/24/outline/CubeIcon'
import { CWidgetStatsD,CWidgetStatsF } from '@coreui/react/dist/esm'

const WidgetsDropdown = (props) => {

  const [latestBlock,setLatestBlock]=useState(0);
  const [totalTransCount,setTotalTransCount]=useState(0)
  const [totalContractCount,setTotalContractCount]=useState(0)

  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)

  // const url = import.meta.env.VITE_APP_CHAIN_URL
  // console.log(url);
  

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])

  useEffect(()=>{
    async function fetchLatestBlock(){
    
     const response = await fetch("http://127.0.0.1:8080/latestBlock" )
     const blk= await response.json()
     console.log("Latest",blk);
     
     if(blk!=null){
         setLatestBlock(blk)
     }
     else{
         console.log("Error Fetching block");
         
     }
     
 }

 async function fetchTotalTrans(){
  console.log("hello");

const response = await fetch("http://127.0.0.1:8080/transCount")
console.log("hi",response);

const trans= await response.json()
console.log("Latest",trans);

if(trans!=null){
   setTotalTransCount(trans)
}
else{
   console.log("Error Fetching transaction count");
   
}

}

async function fetchContractCount(){
  console.log("hello");

const response = await fetch("http://127.0.0.1:8080/contractCount")
console.log("hi");

const contra= await response.json()
console.log("Latest",contra);

if(contra!=null){
   setTotalContractCount(contra)
}
else{
   console.log("Error Fetching Contratc count");
   
}

}

fetchContractCount();
fetchTotalTrans();
 fetchLatestBlock();
 },[])
 console.log("Latest Block",latestBlock);

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      
     
      <CCol sm={6} xl={4} xxl={3}>
      <CWidgetStatsF
            className="mb-3 "
            color="primary"
            icon={<CIcon icon={cil3d} height={40} />}
            title={<span style={{ fontSize:'17px' }}>Latest Block</span>}

            value={<span style={{ fontSize:'30px' }}>{latestBlock}</span>}
          />   
      </CCol>

      <CCol sm={6} xl={4} xxl={3}>
      <CWidgetStatsF
            className="mb-3"
            // style={{ height: "150px" }}
            color="primary"
            icon={<CIcon icon={cilListRich} height={40} />}
            title={<span style={{ fontSize:'17px' }}>Transaction Count</span>}
            value={<span style={{ fontSize:'30px' }}>{totalTransCount}</span>}
          />   
      </CCol>

      <CCol sm={6} xl={4} xxl={3}>
      <CWidgetStatsF
            className="mb-3"
            // style={{ height: "150px" }}
            color="primary"
            icon={<CIcon icon={cilFile} height={40} />}
            title={<span style={{ fontSize: "17px" }}>Contract Created</span>}
            value={<span style={{ fontSize: "30px" }}>{totalContractCount}</span>}
          />   
      </CCol>

    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown

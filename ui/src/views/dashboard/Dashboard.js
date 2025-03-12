import React, { useState } from 'react'
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCloudDownload,
} from '@coreui/icons'

import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import SubChart from './SubChart'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate();
 
 
  const[stateChart,setStateChart]=useState("Today");
  function handleNavigate(value){
    if(value == "Today"){
      navigate('/MainChart')
    }
    else{
      navigate('/SubChart')
    }
  }
  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Transaction Count
              </h4>
              <div className="small text-body-secondary">Today</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Last 10days', 'Today'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value == stateChart}
                    onClick={()=>{setStateChart(value)}}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          {stateChart === "Today" ? <MainChart /> : <SubChart />}
        </CCardBody>
       
      </CCard>
     
      
    </>
  )
}

export default Dashboard

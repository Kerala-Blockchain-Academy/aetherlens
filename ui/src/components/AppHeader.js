import React, { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate  } from "react-router-dom";
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
  cilZoom,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'

const AppHeader = () => {
  const navigate = useNavigate();
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [searchInput, setSearchInput] = useState("");
  async function changeHandler(e){
      setSearchInput(e.target.value);
    };
  async function handleSearch(){
    console.log(searchInput);
    
      console.log(searchInput.length)
      if(searchInput.length==64 || searchInput.length == 66)
      {
          console.log("hai",searchInput);
          // navigate("/transdetails", { state: searchInput  });
          }
      else{
          // let hexStr =  Number(searchInput).toString(16);
          //     hexStr= "0x"+ hexStr
          //  console.log(hexStr);
          
          // console.log("hello",Number(searchInput))
          console.log(searchInput);
          
          navigate("/blocks",{state:searchInput});
      }
  }

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        {/* <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink to="/dashboard" as={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem> */}
          {/* <CNavItem>
            <CNavLink href="#">Users</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Settings</CNavLink>
          </CNavItem> */}
          {/* import { FaSearch } from "react-icons/fa"; */}
{/* <CNavItem>

</CNavItem>
        </CHeaderNav> */}
        {/* <CHeaderNav className="ms-auto">
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav> */}
        <CHeaderNav>
          <CNavItem>
          <div style={{
    display: "flex",
    alignItems: "center",
    padding: "10px",
    height: "50px", // Increased height
    width: "400px", // Reduced width
    fontSize: "16px",
    background: "#222", // Slightly dark background
    borderRadius: "10px", // Rounded corners
    border: "1px solid #555", // Border color
    boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)", // 3D Effect
    outline: "none",
    transition: "all 0.3s ease-in-out",
    position: "relative"
}}>
    {/* Input Field */}
    <input
        type="text"
        id="inputField"
        name="inputField"
        maxLength="120"
        placeholder="Search by Txn Hash / Block"
        required
        onChange={changeHandler}
        style={{
            flex: 1, // Takes available space
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "16px",
            color: "white",
            paddingLeft: "10px", // Space from left
            paddingRight: "40px", // Space for icon on right
        }}
    />

    {/* Search Icon on the Right */}
    <CIcon 
        icon={cilZoom} 
        height={20} 
        onClick={handleSearch}
        style={{ 
            color: "white", 
            position: "absolute", 
            right: "10px" // Moves icon to the right
        }} 
        
    />
        

</div>



          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader

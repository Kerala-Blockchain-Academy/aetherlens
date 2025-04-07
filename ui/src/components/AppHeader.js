import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import { CButton, CFormInput, CInputGroup } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
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
  async function changeHandler(e) {
    setSearchInput(e.target.value);
  };
  async function handleSearch() {
    console.log(searchInput);

    console.log(searchInput.length)
    if (searchInput.length == 64 || searchInput.length == 66) {
      console.log("hai", searchInput);
      // navigate("/transdetails", { state: searchInput  });
    }
    else {
      // let hexStr =  Number(searchInput).toString(16);
      //     hexStr= "0x"+ hexStr
      //  console.log(hexStr);

      // console.log("hello",Number(searchInput))
      console.log(searchInput);

      navigate(`/blocks/${searchInput}`);
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        {/* <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler> */}

        <CHeaderNav className="mx-auto">
          <CNavItem>
            <CInputGroup></CInputGroup>



            <CInputGroup
              className="mb-3 mt-4 shadow-sm"
              size="lg"
              style={{
                maxWidth: "600px", // Controls width, like Google
                margin: "auto", // Centers the search bar
                borderRadius: "50px", // Ensures smooth rounded edges
                overflow: "hidden", // Prevents child elements from breaking the design
                border: "1px solid #ccc",
              }}
            >
              <CFormInput
                placeholder="Search using BlockNumber"
                aria-label="Search"
                aria-describedby="button-addon2"
                onChange={changeHandler}
                style={{
                  border: "none", // Removes all borders for a seamless look
                  padding: "12px 20px", // Matches Google's padding
                  fontSize: "16px",
                  borderTopLeftRadius: "50px",
                  borderBottomLeftRadius: "50px",
                }}
              />
              <CButton
                type="button"
                color="secondary"
                variant="outline"
                id="button-addon2"
                onClick={handleSearch}
                style={{
                  border: "none", // Removes borders
                  borderTopRightRadius: "50px",
                  borderBottomRightRadius: "50px",
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CIcon icon={cilZoom} height={20} />
              </CButton>
            </CInputGroup>




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
              )
                : (
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

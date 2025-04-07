import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCardTitle,
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilZoom } from '@coreui/icons'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/" className="d-flex align-items-center gap-2 text-decoration-none">
          <CIcon customClassName="sidebar-brand-full" icon={cilZoom} height={32} />
          <span className="fw-bold">AetherLens</span>
        </CSidebarBrand>
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        {/* <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        /> */}
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

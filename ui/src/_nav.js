import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBook,
  cilAddressBook,
  cilSpeedometer,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,

  },
  {
    component: CNavTitle,
    name: 'BlockChain',
  },
  {
    component: CNavItem,
    name: 'Data',
    to: '/blkTx',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Accounts',
    to: '/theme/colors',
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
  },

]

export default _nav

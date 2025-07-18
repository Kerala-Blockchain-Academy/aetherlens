// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router';
import Loadable from 'src/layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const MinimalLayout = Loadable(lazy(() => import('../layouts/full/MinimalLayout'))); 
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

// Dashboard
const Dashboard = Loadable(lazy(() => import('../views/dashboards/Dashboard')));
const Block = Loadable(lazy(() => import('../views/blocks/blockDetails')));
const TxInput = Loadable(lazy(() => import('../views/sample-page/TxInput')));
const BlkTx = Loadable(lazy(() => import('../views/blocks/txDetails')));
const TxDetails = Loadable(lazy(() => import('../views/sample-page/TxHashDetails')));
const BlkTxInput = Loadable(lazy(() => import('../views/blocks/BlkTx')));
const CCalls = Loadable(lazy(() => import('../views/sample-page/ContractCall')));
const CTxns = Loadable(lazy(() => import('../views/sample-page/ContractTxns')));

// utilities
const Typography = Loadable(lazy(() => import('../views/typography/Typography')));
const Table = Loadable(lazy(() => import('../views/tables/Table')));
const Form = Loadable(lazy(() => import('../views/forms/Form')));
const Alert = Loadable(lazy(() => import('../views/alerts/Alerts')));

// icons
const Solar = Loadable(lazy(() => import('../views/icons/Solar')));

// authentication
const Login = Loadable(lazy(() => import('../views/auth/login/Login')));
const Register = Loadable(lazy(() => import('../views/auth/register/Register')));

const Error = Loadable(lazy(() => import('../views/auth/error/Error')));

const Router = [
   {
    path:'/',
    element:<MinimalLayout />,
    children:[
      { path:'/',exact:true,element:<Login/>}
    ]
  },
  {
    path: '/',
    element: <FullLayout />,
    children: [
      // { path: '/', exact: true, element: <Dashboard /> },
      { path: '/dash', exact: true, element: <Dashboard /> },
      { path: '/ui/typography', exact: true, element: <Typography /> },
      { path: '/ui/table', exact: true, element: <Table /> },
      { path: '/ui/form', exact: true, element: <Form /> },
      { path: '/ui/alert', exact: true, element: <Alert /> },
      { path: '/icons/solar', exact: true, element: <Solar /> },
      { path: '/txInput', exact: true, element: <TxInput /> },
      { path: '/blocks/:id', exact: true, element: <Block /> },
      { path: '/blkTx/:id', exact: true, element: <BlkTx /> },
      { path: '/txDetails/:id', exact: true, element: <TxDetails /> },
      { path: '/blkTxInput/:id', exact: true, element: <BlkTxInput /> },
      { path: '/ccall', exact: true, element: <CCalls /> },
      { path: '/ctxns/:id', exact: true, element: <CTxns /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      // { path: '/auth/login', element: <Login /> },
      { path: '/auth/register', element: <Register /> },
      { path: '404', element: <Error /> },
      { path: '/auth/404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router);

export default router;

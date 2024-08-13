import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));
const ChangePassword3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/ChangePassword3')));
const SalesLogin = Loadable(lazy(() => import('views/pages/authentication/authentication3/salesLogin')));




// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      // path: '/pages/login/login3',
      path: '/login',
      element: <AuthLogin3 />
    },
    {
      // path: '/pages/login/login3',
      path: '/counterLogin',
      element: <SalesLogin />
    },
    {
      // path: '/pages/register/register3',
      path: '/register',
      element: <AuthRegister3 />
    },
    
    {
      // path: '/pages/register/register3',
      path: '/change-password',
      element: <ChangePassword3/>
    }
  ]
};

export default AuthenticationRoutes;

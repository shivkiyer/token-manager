import { createBrowserRouter } from 'react-router-dom';

import RootComponent from './components/root-component/root-component';
import Homepage from './components/homepage/homepage';
import LoginPage from './components/login-page/login-page';
import Dashboard from './components/dashboard/dashboard';
import Wallets from './components/dashboard/wallets/wallets';
import Tokens from './components/dashboard/tokens/tokens';
import Account from './components/dashboard/account/account';
import ListAccounts from './components/dashboard/account/list-accounts';
import RegisterAccount from './components/dashboard/account/register-account';
import Settings from './components/dashboard/settings/settings';
import ErrorPage from './components/ErrorPage/error-page';

import { authToken } from './utils/auth/auth';

import loginActionHandler from './components/login-page/login-action-handler';
import accountsListLoader from './components/dashboard/account/accountsListLoader';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootComponent />,
    id: 'root-app',
    loader: authToken,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Homepage /> },
      { path: 'login', element: <LoginPage />, action: loginActionHandler },
      {
        path: 'dashboard',
        element: <Dashboard />,
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Wallets /> },
          { path: 'tokens', element: <Tokens /> },
          {
            path: 'account',
            element: <Account />,
            children: [
              {
                path: 'list',
                element: <ListAccounts />,
                loader: accountsListLoader,
              },
              { path: 'create', element: <RegisterAccount /> },
            ],
          },
          { path: 'settings', element: <Settings /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

import { createBrowserRouter } from 'react-router-dom';

import RootComponent from './components/root-component/root-component';
import LoginPage from './components/login-page/login-page';
import Dashboard from './components/dashboard/dashboard';
import ErrorPage from './components/ErrorPage/error-page';

import loginActionHandler from './components/login-page/login-action-handler';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootComponent />,
    errorElement: <ErrorPage />,
    children: [
      { path: 'login', element: <LoginPage />, action: loginActionHandler },
      { path: '/dashboard', element: <Dashboard /> },
    ],
  },
]);

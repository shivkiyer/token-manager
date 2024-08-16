import { createBrowserRouter } from 'react-router-dom';

import RootComponent from './components/root-component/root-component';
import LoginPage from './components/login-page/login-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootComponent />,
    children: [{ path: 'login', element: <LoginPage /> }],
  },
]);

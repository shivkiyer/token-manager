import { RouterProvider } from 'react-router-dom';

import AppContextProvider from './app/context/app-context-provider';
import { router } from './routes';

function App() {
  return (
    <AppContextProvider>
      <RouterProvider router={router}></RouterProvider>
    </AppContextProvider>
  );
}

export default App;

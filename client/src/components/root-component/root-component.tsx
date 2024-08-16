import { Outlet } from 'react-router-dom';

import NavigationBar from '../navigation-bar/navigation-bar';

function RootComponent() {
  return (
    <>
      <NavigationBar />
      <Outlet></Outlet>
    </>
  );
}

export default RootComponent;

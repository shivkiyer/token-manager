import { redirect } from 'react-router-dom';

import fetchWalletData from './fetch-wallet-data';
import { clearToken } from '../../../../utils/auth/auth';

// Comments (old code) to be removed after testing

// import apiCall from '../../../../utils/http/api-call';
// import { authToken, clearToken } from '../../../../utils/auth/auth';

// const manageWalletLoader = async ({ params }: any) => {
//   const userToken = authToken();

//   if (userToken === null) {
//     redirect('/login');
//   }

//   const { id } = params;

//   try {
//     const response = await apiCall(
//       `${process.env.REACT_APP_BASE_API_URL}/api/wallets/${id}`,
//       'GET',
//       { Authorization: userToken || '' },
//       null
//     );

//     const responseData = await response.json();
//     if (
//       responseData.message !== null &&
//       responseData.message !== undefined &&
//       responseData.message.includes('Authorization failed')
//     ) {
//       clearToken();
//       return redirect('/login');
//     }
//     return responseData;
//   } catch (e) {
//     return null;
//   }
// };

const manageWalletLoader = async ({ params }: any) => {
  const { id } = params;

  const data = await fetchWalletData(id);
  if (data === null) {
    clearToken();
    return redirect('/login');
  }
  return data;
};

export default manageWalletLoader;

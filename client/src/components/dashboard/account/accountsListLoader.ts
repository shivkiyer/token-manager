import { redirect } from 'react-router-dom';

import apiCall from '../../../utils/http/api-call';
import { authToken, clearToken } from '../../../utils/auth/auth';

async function accountsListLoader() {
  const userToken = authToken();
  if (userToken === null) {
    return redirect('/login');
  }
  try {
    const response = await apiCall(
      `${process.env.REACT_APP_BASE_API_URL}/api/eth-accounts/`,
      'GET',
      { Authorization: userToken },
      null
    );
    const responseData = await response.json();
    if (
      responseData.message !== null &&
      responseData.message !== undefined &&
      responseData.message.includes('Authorization failed')
    ) {
      clearToken();
      return redirect('/login');
    }
    return responseData;
  } catch (e) {
    return null;
  }
}

export default accountsListLoader;

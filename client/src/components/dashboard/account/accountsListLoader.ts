import { redirect } from 'react-router-dom';

import apiCall from '../../../utils/http/api-call';
import { authToken } from '../../../utils/auth/auth';

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
    return responseData;
  } catch (e) {
    return null;
  }
}

export default accountsListLoader;

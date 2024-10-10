import apiCall from '../../../utils/http/api-call';
import { authToken } from '../../../utils/auth/auth';

async function accountsListLoader() {
  const userToken = authToken();
  if (userToken === null) {
    return null;
  }
  try {
    const response = await apiCall(
      `${process.env.REACT_APP_BASE_API_URL}/api/eth-accounts/`,
      'GET',
      { Authorization: userToken },
      null
    );
    if (!response.ok) {
      return response;
    }
    const responseData = await response.json();
    return responseData;
  } catch (e) {
    return null;
  }
}

export default accountsListLoader;

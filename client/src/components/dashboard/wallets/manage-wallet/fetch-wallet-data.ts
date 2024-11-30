import apiCall from '../../../../utils/http/api-call';
import { authToken } from '../../../../utils/auth/auth';

const fetchWalletData = async (id: number) => {
  const userToken = authToken();

  if (userToken === null) {
    return null;
  }

  try {
    const response = await apiCall(
      `${process.env.REACT_APP_BASE_API_URL}/api/wallets/${id}`,
      'GET',
      { Authorization: userToken || '' },
      null
    );

    const responseData = await response.json();
    if (
      responseData.message !== null &&
      responseData.message !== undefined &&
      responseData.message.includes('Authorization failed')
    ) {
      return null;
    }
    return responseData;
  } catch (e) {
    return null;
  }
};

export default fetchWalletData;

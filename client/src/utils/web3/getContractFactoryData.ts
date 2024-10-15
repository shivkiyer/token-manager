import apiCall from '../http/api-call';
import { authToken } from '../auth/auth';

/**
 * Fetch contract factory data such as deployed address and ABI
 * @param {string} url
 * @returns {string|object} Address or ABI object
 */
const getContractFactoryData = async (url: string) => {
  try {
    const userToken = authToken();
    const authHeader = { Authorization: userToken || '' };
    const response = await apiCall(
      `${process.env.REACT_APP_BASE_API_URL}/api/contract-factory/${url}`,
      'GET',
      authHeader,
      null
    );
    const responseData = await response.json();
    if (responseData.data !== null || response.data !== undefined) {
      return responseData.data;
    }
  } catch (e) {}
  return null;
};

export default getContractFactoryData;

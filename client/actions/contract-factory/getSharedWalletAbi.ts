'use server';

import apiCall from '@/utils/http/api-call';
import { getSession } from '../auth/session';

/**
 * Fetch shared wallet data such as deployed address and ABI
 * @param {string} url
 * @returns {string|object} Address or ABI object
 */
const getSharedWalletData = async (url: string) => {
  try {
    const userToken = await getSession();
    const authHeader = { Authorization: userToken || '' };
    const response = await apiCall(
      `${process.env.REACT_APP_BASE_API_URL}/wallets/${url}`,
      'GET',
      authHeader,
      null
    );
    const responseData = await response.json();
    return responseData;
  } catch (e) {}
  return {
    message: 'Shared wallet data could not be fetched',
  };
};

export default getSharedWalletData;

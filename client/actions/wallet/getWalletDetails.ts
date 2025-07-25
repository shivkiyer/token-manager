'use server';

import { getSession } from '../auth/session';
import apiCall from '@/utils/http/api-call';
import getResponseOrRedirect from '@/utils/http/getResponseOrRedirect';

/**
 * Get details of shared wallet
 * @param {string} address Wallet address
 * @returns {Object} Response data and message
 */
export default async function getWalletDetails(address: string) {
  try {
    const userToken = await getSession();

    const response = await apiCall(
      `${process.env.REACT_APP_BASE_API_URL}/wallets/${address}`,
      'GET',
      { Authorization: userToken || '' },
      null
    );
    return await getResponseOrRedirect(response);
  } catch (e) {
    return null;
  }
}

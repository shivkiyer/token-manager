'use server';

import { getSession } from '../auth/session';
import apiCall from '@/utils/http/api-call';
import getResponseOrRedirect from '@/utils/http/getResponseOrRedirect';

/**
 * Get the users of a shared wallet
 * @param {string} address Wallet address
 * @returns {Object} Response data and message
 */
export default async function getWalletUsers(address: string) {
  try {
    const userToken = await getSession();

    const response = await apiCall(
      `${process.env.REACT_APP_BASE_API_URL}/wallets/${address}/get-users`,
      'GET',
      { Authorization: userToken || '' },
      null
    );
    return await getResponseOrRedirect(response);
  } catch (e) {
    return {
      message: 'Wallet users could not be fetched',
    };
  }
}

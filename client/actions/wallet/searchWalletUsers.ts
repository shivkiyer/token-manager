'use server';

import { getSession } from '../auth/session';
import apiCall from '@/utils/http/api-call';
import getResponseOrRedirect from '@/utils/http/getResponseOrRedirect';

/**
 * Search for users for a wallet
 * @param {string} address Wallet address
 * @param {string} search Search parameter
 * @returns {Object} Response data and message
 */
export default async function searchWalletUsers(
  address: string,
  search: string
) {
  try {
    const userToken = await getSession();

    const response = await apiCall(
      `${process.env.REACT_APP_BASE_API_URL}/wallets/search-users?` +
        new URLSearchParams({
          search: search,
          wallet: address,
        }),
      'GET',
      { Authorization: userToken || '' },
      null
    );
    return await getResponseOrRedirect(response);
  } catch (e) {
    return {
      message: 'Users could not be found',
    };
  }
}

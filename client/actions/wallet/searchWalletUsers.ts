'use server';

import { redirect } from 'next/navigation';

import { getSession, deleteSession } from '../auth/session';
import apiCall from '@/utils/http/api-call';

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

    if (userToken === null) {
      redirect('/login');
    }
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

    const responseData = await response.json();
    if (
      responseData.message !== null &&
      responseData.message !== undefined &&
      responseData.message.includes('Authorization failed')
    ) {
      await deleteSession();
      return redirect('/login');
    }
    return responseData;
  } catch (e) {
    return {
      message: 'Users could not be found',
    };
  }
}

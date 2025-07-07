'use server';

import { redirect } from 'next/navigation';

import { getSession, deleteSession } from '../auth/session';
import apiCall from '@/utils/http/api-call';

/**
 * Remove users from a shared wallet
 * @param {string} address Wallet address
 * @param {string[]} accountAddresses Addresses of users
 * @returns {Object} Response data and message
 */
export default async function removeWalletUsers(
  address: string,
  accountAddresses: string[]
) {
  try {
    const userToken = await getSession();

    const response = await apiCall(
      `${process.env.REACT_APP_BASE_API_URL}/wallets/${address}/remove-user`,
      'POST',
      { Authorization: userToken || '' },
      { accounts: accountAddresses }
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
      message: 'One or more users could not be removed from the wallet',
    };
  }
}

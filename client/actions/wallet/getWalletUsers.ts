'use server';

import { redirect } from 'next/navigation';

import { getSession, deleteSession } from '../auth/session';
import apiCall from '@/utils/http/api-call';

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
      message: 'Wallet users could not be fetched',
    };
  }
}

'use server';

import { redirect } from 'next/navigation';

import { getSession, deleteSession } from '../auth/session';
import apiCall from '@/utils/http/api-call';

/**
 * Get details of shared wallet
 * @param {string} address Wallet address
 * @returns {Object} Response data and message
 */
export default async function getWalletDetails(address: string) {
  try {
    const userToken = await getSession();

    if (userToken === null) {
      redirect('/login');
    }

    const response = await apiCall(
      `${process.env.REACT_APP_BASE_API_URL}/wallets/${address}`,
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
    return null;
  }
}

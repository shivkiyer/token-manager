'use server';

import { redirect } from 'next/navigation';

import { getSession, deleteSession } from '../auth/session';
import apiCall from '@/utils/http/api-call';

/**
 * Fetch wallets for a user from the backend
 * @returns {Object} Array of wallets
 */
export default async function fetchWallets() {
  const userToken = await getSession();
  if (userToken === null) {
    return redirect('/login');
  }

  try {
    const response = await apiCall(
      `${process.env.REACT_APP_BASE_API_URL}/wallets/`,
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

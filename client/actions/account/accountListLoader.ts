'use server';

import { redirect } from 'next/navigation';

import apiCall from '@/utils/http/api-call';
import { getSession, deleteSession } from '../auth/session';

/**
 * Fetch ETH accounts from the backend
 * @returns {object} Response from API
 */
async function accountsListLoader() {
  const userToken = await getSession();

  try {
    const response = await apiCall(
      `${process.env.REACT_APP_BASE_API_URL}/eth-accounts/`,
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

export default accountsListLoader;

'use server';

import { getSession } from '../auth/session';
import apiCall from '@/utils/http/api-call';
import getResponseOrRedirect from '@/utils/http/getResponseOrRedirect';

/**
 * Fetch wallets for a user from the backend
 * @returns {Object} Array of wallets
 */
export default async function fetchWallets() {
  const userToken = await getSession();

  try {
    const response = await apiCall(
      `${process.env.REACT_APP_BASE_API_URL}/wallets/`,
      'GET',
      { Authorization: userToken || '' },
      null
    );
    return await getResponseOrRedirect(response);
  } catch (e) {
    return {
      message: 'Wallets could not be fetched',
    };
  }
}

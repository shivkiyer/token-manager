'use server';

import apiCall from '@/utils/http/api-call';
import { getSession } from '../auth/session';
import getResponseOrRedirect from '@/utils/http/getResponseOrRedirect';

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
    return await getResponseOrRedirect(response);
  } catch (e) {
    return {
      message: 'Unable to fetch accounts',
    };
  }
}

export default accountsListLoader;

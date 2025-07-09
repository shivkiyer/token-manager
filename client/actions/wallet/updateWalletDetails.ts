'use server';

import { WalletForm } from '@/interfaces/wallet';
import { getSession } from '../auth/session';
import apiCall from '@/utils/http/api-call';
import getResponseOrRedirect from '@/utils/http/getResponseOrRedirect';

/**
 * Get details of shared wallet
 * @param {string} address Wallet address
 * @param {Object} values Form data with wallet details
 * @returns {Object} Response data and message
 */
export default async function updateWalletDetails(
  address: string,
  values: WalletForm
) {
  try {
    const userToken = await getSession();

    const response = await apiCall(
      `${process.env.REACT_APP_BASE_API_URL}/wallets/${address}`,
      'PATCH',
      { Authorization: userToken || '' },
      values
    );
    return await getResponseOrRedirect(response);
  } catch (e) {
    return null;
  }
}

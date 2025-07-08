'use server';

import { getSession } from '../auth/session';
import apiCall from '@/utils/http/api-call';
import getResponseOrRedirect from '@/utils/http/getResponseOrRedirect';

/**
 * Creates a wallet in the database linking it to an account
 * @param {string} ownerAccount
 * @param {string} newWalletAddress
 * @param {Object} formData Wallet details
 * @returns
 */
export default async function createWallet(
  ownerAccount: string | null,
  newWalletAddress: string,
  formData: any
) {
  try {
    if (!ownerAccount)
      return {
        message: 'Account not selected in Metamask',
        success: false,
      };
    const userToken = await getSession();

    const authHeader = { Authorization: userToken || '' };

    const response = await apiCall(
      `${process.env.REACT_APP_BASE_API_URL}/wallets/create`,
      'POST',
      authHeader,
      {
        name: formData.name.trim(),
        description: formData.description.trim(),
        maxLimit: Number(formData.maxLimit),
        address: newWalletAddress,
        owner: ownerAccount,
      }
    );
    return await getResponseOrRedirect(response);
  } catch (e) {
    return {
      message: 'Wallet could not be created.',
    };
  }
}

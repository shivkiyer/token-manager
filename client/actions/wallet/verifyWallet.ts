'use server';

import { getSession } from '../auth/session';
import apiCall from '@/utils/http/api-call';
import getResponseOrRedirect from '@/utils/http/getResponseOrRedirect';

/**
 * Verifies whether a wallet of the same name exists for an account
 * @param ownerAccount
 * @param formData
 * @returns
 */
export default async function verifyWallet(
  ownerAccount: string | null,
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
      `${process.env.REACT_APP_BASE_API_URL}/wallets/verify-wallet`,
      'POST',
      authHeader,
      { name: formData.name.trim(), owner: ownerAccount }
    );

    if (!response.ok) {
      return await getResponseOrRedirect(response);
    }
    return null;
  } catch (e) {
    return {
      message: 'Wallet could not be created',
    };
  }
}

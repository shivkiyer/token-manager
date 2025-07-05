'use server';

import { redirect } from 'next/navigation';

import { getSession, deleteSession } from '../auth/session';
import apiCall from '@/utils/http/api-call';

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
    const verificationResponse = await apiCall(
      `${process.env.REACT_APP_BASE_API_URL}/wallets/verify-wallet`,
      'POST',
      authHeader,
      { name: formData.name.trim(), owner: ownerAccount }
    );

    if (!verificationResponse.ok) {
      const verificationResponseData = await verificationResponse.json();
      if (
        verificationResponseData.message !== undefined &&
        verificationResponseData.message !== null
      ) {
        if (verificationResponseData.message.includes('Authorization failed')) {
          await deleteSession();
          redirect('/login');
        }
        return {
          message: verificationResponseData.message,
          success: false,
        };
      }
      return {
        message: 'Wallet could not be created',
        success: false,
      };
    }
  } catch (e) {
    return {
      message: 'Wallet could not be created',
      success: false,
    };
  }
}

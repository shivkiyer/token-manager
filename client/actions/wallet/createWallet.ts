'use server';

import { getSession } from '../auth/session';
import apiCall from '@/utils/http/api-call';

/**
 * Creates a wallet in the database linking it to an account
 * @param ownerAccount
 * @param newWalletAddress
 * @param formData
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

    const writeWalletResponse = await apiCall(
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

    if (!writeWalletResponse.ok) {
      const errorMessage = await writeWalletResponse.json();
      if (errorMessage.message !== null && errorMessage.message !== undefined) {
        console.log(errorMessage);
        return {
          message: errorMessage.message,
          success: false,
        };
      } else {
        return {
          message: 'Wallet not written to database.',
          success: false,
        };
      }
    } else {
      return {
        message:
          'Wallet created successfully. Go to the LIST tab to view wallets.',
        success: true,
      };
    }
  } catch (e) {
    return {
      message: 'Wallet could not be created.',
      success: false,
    };
  }
}

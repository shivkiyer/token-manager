'use server';

import { redirect } from 'next/navigation';

import apiCall from '@/utils/http/api-call';
import { getSession, deleteSession } from '../auth/session';

export default async function registerAccount(
  accounts: string[],
  formData: {
    name: string;
    address: string;
  }
): Promise<{ message: string; success: boolean } | undefined> {
  if (!accounts.includes(formData.address)) {
    return {
      message: 'Account is not linked in Metamask.',
      success: false,
    };
  }

  const userToken = await getSession();

  try {
    const authHeader = { Authorization: userToken || '' };
    const response = await apiCall(
      `${process.env.REACT_APP_BASE_API_URL}/eth-accounts/add`,
      'POST',
      authHeader,
      {
        accountName: formData.name.trim(),
        accountAddress: formData.address.trim(),
      }
    );
    const responseData = await response.json();
    if (!response.ok) {
      if (responseData.message !== null || responseData.message !== undefined) {
        if (responseData.message.includes('Authorization failed')) {
          await deleteSession();
          redirect('/login');
        }
        return {
          message: responseData.message,
          success: false,
        };
      } else {
        throw new Error();
      }
    } else {
      return {
        message:
          'Account successfully added! Go to the LIST tab to view accounts.',
        success: true,
      };
    }
  } catch (e) {
    return {
      message:
        'Account could not be added. Please try again later or contact the admin.',
      success: false,
    };
  }
}

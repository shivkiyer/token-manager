'use server';

import apiCall from '@/utils/http/api-call';
import { getSession } from '../auth/session';
import getResponseOrRedirect from '@/utils/http/getResponseOrRedirect';

export default async function registerAccount(
  accounts: string[],
  formData: {
    name: string;
    address: string;
  }
): Promise<{ message: string } | undefined> {
  if (!accounts.includes(formData.address)) {
    return {
      message: 'Account is not linked in Metamask.',
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
    return await getResponseOrRedirect(response);
  } catch (e) {
    return {
      message: 'Account could not be added.',
    };
  }
}

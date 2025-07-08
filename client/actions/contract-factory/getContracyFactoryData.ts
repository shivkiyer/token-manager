'use server';

import apiCall from '@/utils/http/api-call';
import { getSession } from '../auth/session';
import getResponseOrRedirect from '@/utils/http/getResponseOrRedirect';

/**
 * Fetch contract factory data such as deployed address and ABI
 * @returns {object} Address and ABI object
 */
export default async function getContractFactoryData() {
  try {
    const userToken = await getSession();
    const authHeader = { Authorization: userToken || '' };
    const response = await apiCall(
      `${process.env.REACT_APP_BASE_API_URL}/contract-factory/`,
      'GET',
      authHeader,
      null
    );

    return await getResponseOrRedirect(response);
  } catch (e) {
    return {
      message: 'Contract data could not be fetched'
    };
  }
}

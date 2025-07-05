'use server';

import apiCall from '@/utils/http/api-call';
import { getSession } from '../auth/session';

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
    const responseData = await response.json();
    if (responseData.data !== null || response.data !== undefined) {
      return responseData.data;
    }
  } catch (e) {}
  return null;
};


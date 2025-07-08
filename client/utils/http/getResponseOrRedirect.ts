'use server';

import { redirect } from 'next/navigation';

import { deleteSession } from '@/actions/auth/session';

/**
 * Returns JSON response data or redirects to login page if authentication failed
 * @param {Object} response Response from API
 * @returns {Object} JSON response data
 */
export default async function getResponseOrRedirect(response: Response) {
  const responseData = await response.json();
  if (responseData?.message?.includes('Authorization failed')) {
    await deleteSession();
    return redirect('/login');
  }
  return responseData;
}

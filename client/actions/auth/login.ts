'use server';

import { createSession } from './session';
import apiCall from '@/utils/http/api-call';

/**
 * Login a user at the backend and if successful stores JWT in cookie
 * @param {Object} formData With username and password fields
 * @returns null if successul and error message if not
 */
export default async function loginActionHandler(formData: {
  username: string;
  password: string;
}) {
  const { username, password } = formData;

  const response = await apiCall(
    `${process.env.REACT_APP_BASE_API_URL}/auth/login`,
    'POST',
    null,
    { username, password }
  );

  const responseData = await response.json();
  if (responseData.data) {
    await createSession(responseData.data);
  }

  return responseData;
}

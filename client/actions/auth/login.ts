'use server';

import createSession from './session';

/**
 * Login a user at the backend and if successful stores JWT in cookie
 * @param {Object} formData With username and password fields
 * @returns null if successul and error message if not
 */
export default async function loginActionHandler(formData: {
  username: string;
  password: string;
}) {
  const response = await fetch(`${process.env.BASE_API_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      username: formData['username'],
      password: formData['password'],
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseData = await response.json();
  if (responseData.data) {
    await createSession(responseData.data);
  }

  return response.ok ? null : responseData.message;
}

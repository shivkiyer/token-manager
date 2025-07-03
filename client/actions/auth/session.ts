'use server';

import { cookies } from 'next/headers';

/**
 * Creates a cookie in the browser
 * @param {string} token JWT token
 */
export async function createSession(token: string) {
  const expiresAt = new Date(
    Date.now() + parseInt(process.env.SESSION_EXPIRY ?? '120') * 60 * 1000
  );
  const cookieStore = await cookies();

  cookieStore.set('session', token, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

/**
 * Fetches JWT token from stored cookie
 * @returns {string} JWT token
 */
export async function getSession(): Promise<string | null> {
  const session = (await cookies()).get('session')?.value ?? null;
  return session;
}

/**
 * Deletes JWT token from session cookie to log the user out
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

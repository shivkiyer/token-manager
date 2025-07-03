import 'server-only';
import { cookies } from 'next/headers';

/**
 * Creates a cookie in the browser
 * @param {string} token JWT token 
 */
export default async function createSession(token: string) {
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

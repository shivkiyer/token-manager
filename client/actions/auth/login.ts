'use server';

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

  return response.ok ? null : responseData.message;
}

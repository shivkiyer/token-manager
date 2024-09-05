import { redirect } from 'react-router-dom';

const loginActionHandler = async ({ request }: { request: Request }) => {
  const data = await request.formData();
  const username = data.get('username');
  const password = data.get('password');
  const response = await fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    return response;
  }
  const responseData = await response.json();
  if (response.ok) {
    if (responseData.data !== null) {
      localStorage.setItem('token', responseData.data);
      return redirect('/dashboard');
    }
  }

  throw { message: 'Unexpected error' };
};

export default loginActionHandler;

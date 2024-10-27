import { redirect } from 'react-router-dom';

import apiCall from '../../utils/http/api-call';

const loginActionHandler = async ({ request }: { request: Request }) => {
  const data = await request.formData();
  const username = data.get('username');
  const password = data.get('password');
  const response = await apiCall(
    `${process.env.REACT_APP_BASE_API_URL}/api/auth/login`,
    'POST',
    null,
    { username, password }
  );
  if (!response.ok) {
    return response;
  }
  const responseData = await response.json();
  if (response.ok) {
    if (responseData.data !== null) {
      localStorage.setItem('token', responseData.data);
      return redirect('/dashboard/wallet');
    }
  }

  throw Object.assign(new Error('An unexpected error occurred.'));
};

export default loginActionHandler;

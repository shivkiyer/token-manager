import { useEffect } from 'react';
import { useRouteLoaderData, useNavigate } from 'react-router-dom';

/**
 * Route guard which returns JWT if user is logged in
 * or redirects to homepage if no JWT is found
 * @returns {string} JWT
 */
function useTokenAuthentication() {
  const navigate = useNavigate();
  const userToken = useRouteLoaderData('root-app');

  useEffect(() => {
    if (userToken === null || userToken === undefined) {
      navigate('/');
    }
  }, [userToken, navigate]);

  return userToken;
}

export default useTokenAuthentication;

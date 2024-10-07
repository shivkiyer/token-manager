import { useEffect } from 'react';
import { useRouteLoaderData, useNavigate } from 'react-router-dom';

/**
 * Route guard which returns JWT if user is logged in
 * or redirects to homepage if no JWT is found
 * @returns {string} JWT
 */
function useTokenAuthentication(): string | null {
  const navigate = useNavigate();
  const userToken: string | null = useRouteLoaderData('root-app') as
    | string
    | null;

  useEffect(() => {
    if (userToken === null || userToken === undefined) {
      navigate('/');
    }
  }, [userToken, navigate]);

  return userToken;
}

export default useTokenAuthentication;

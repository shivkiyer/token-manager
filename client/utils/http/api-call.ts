interface HttpOptions {
  method: string;
  headers: { [key: string]: string };
  body?: any;
}

/**
 * Wrapper function that calls the fetch function
 * @param {string} url
 * @param {string} method
 * @param {Object} headers
 * @param {any} body
 * @returns {Promise} Response
 */
function apiCall(
  url: string,
  method: string,
  headers: { [key: string]: string } | null,
  body: any
): Promise<any> {
  const httpHeaders: { [key: string]: string } = {
    'Content-Type': 'application/json',
    ...headers,
  };
  const httpOptions: HttpOptions = {
    method,
    headers: httpHeaders,
  };
  let httpBody: any = null;
  if (body !== null) {
    httpBody = JSON.stringify(body);
    httpOptions.body = httpBody;
  }
  return fetch(url, httpOptions);
}

export default apiCall;

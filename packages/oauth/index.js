async function transformRequest(request, auth) {
  if (auth && auth.token) {
    request.headers.set('Authorization') = `Bearer ${auth.token}`;
  } else if (auth && auth.user && auth.password) {
    const encoded = btoa(`${auth.user}:${auth.password}`);
    request.headers.Authorization = `Basic ${encoded}`;
  }
}

function getStorageItem(storage, key) {
  switch (storage.toLowerCase()) {
    case 'local':
      return localStorage.getItem(key);
    case 'session':
      return sessionStorage.getItem(key);
    case 'cookie':
      const value = document.cookie
        .match('(^|[^;]+)\\s*' + key + '\\s*=\\s*([^;]+)');
      return value ? value.pop() : null;
    default:
      throw new Error('Storage not supported');
  }
}

function getAuthFromStorage({
  storage = 'local',
  key,
} = {}) {
  const token = getStorageItem(storage, key);
  return token ? { token } : null;
}

/**
 * Returns a fetch-middlewares middleware
 * @param {object?} [{
 *   getAuth,
 *   user,
 *   password,
 *   token,
 *   storage,
 * }={}] options
 * @param {(Function|AsyncFunction)?} options.getAuth Custom function to get authorization that returns an auth object.
 * @param {string?} options.user Username value if using Basic Authorization.
 * @param {string?} options.password Password value if using Basic Authorization.
 * @param {string?} options.token Access token value if using Bearer Authorization.
 * @param {object?} [{
 *   storage = 'local',
 *   key,
 * }={}] options.storage Storage options to get Bearer Authorization.
 * @param {string?='local'} options.storage.local The storage type to get token authorization. Possible values are 'local', 'session' or 'cookie'.
 * @param {string} options.storage.key Storage key to get authorization. Example: 'accessToken'.
 * @returns {AsyncFunction} fetch-middlewares
 * @example
 * import oauth from '@fetch-run/oauth';
 *  
 */
function buildMiddleware({
  getAuth,
  user,
  password,
  token,
  storage,
} = {}) {
  return (next) => async (request) => {
    let auth;

    if (storage) {
      auth = getAuthFromStorage(storage);
    } else if (getAuth) {
      auth = await (async () => getAuth());
    } else if (token) {
      auth = { token };
    } else if (user && password) {
      auth = { user, password };
    }

    transformRequest(request, auth);
    return next(req);
  }
}

export default buildMiddleware;

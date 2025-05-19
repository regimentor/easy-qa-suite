import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
});

api.interceptors.response.use(
  (res) => {
    if (res.config.url === '/login' && res.status === 201) {
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
    }

    return res;
  },
  (error) => Promise.reject(error),
);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers.set('authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');

      return api
        .post('/refresh-token', {refreshToken})
        .then((res) => {
          if (res.status === 201) {
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);

            originalRequest.headers['Authorization'] =
              'Bearer ' + res.data.accessToken;

            return api(originalRequest);
          }
        })
        .catch(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          const url = new URL(`${location.protocol}//${location.host}/sign-in`);
          if (!location.pathname.includes('/sign-in')) {
            url.searchParams.set(
              'fallbackUrl',
              location.pathname + location.search!,
            );
            window.location.href = url.toString();
          }
        });
    }

    return Promise.reject(error);
  },
);

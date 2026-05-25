import { useAuthStore } from "~/store/auth.store";

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiBase,

    async onRequest({ options }) {
      if (authStore.token && ['/auth', '/auth/refresh'].every((endpoint) => !options.baseURL?.includes(endpoint))) {
        const headers = new Headers(options.headers);
        headers.set('Authorization', `Bearer ${authStore.token}`);
        options.headers = headers;
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        authStore.logout();
      }
      // if (response.status === 401) {
      //   try {
      //     const refreshResponse = await AuthService.refreshToken();
      //     authStore.setToken(refreshResponse.token);
      //     return $fetch(response.url, {
      //       ...options,
      //       method: options.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      //       headers: {
      //         ...options.headers,
      //         Authorization: `Bearer ${refreshResponse.token}`,
      //       },
      //     });
      //   } catch (err) {
      //     authStore.logout();
      //     throw err;
      //   }
      // }
    },
  });
  return {
    provide: {
      api,
    },
  };
});

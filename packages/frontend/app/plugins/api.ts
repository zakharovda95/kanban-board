import { useUserStore } from '~/stores/user.store.ts';

export default defineNuxtPlugin(nuxtApp => {
  const api = $fetch.create({
    onRequest({ options }) {
      if (!import.meta.server) return;

      // после await контекст Nuxt может потеряться — биндим через runWithContext()
      nuxtApp.runWithContext(() => {
        const { cookie } = useRequestHeaders(['cookie']);
        if (!cookie) return;

        // { ...option.headers, ...cookie } - не собирает объект заголовков как ожидается
        // обязательно делаем через header.set(...) с присваиванием в опцию header
        const headers = new Headers(options.headers as HeadersInit | undefined);
        headers.set('cookie', cookie);
        options.headers = headers;
      });
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        // биндим накст контекст через runWithContext()
        await nuxtApp.runWithContext(() => {
          useUserStore().resetStore();
          navigateTo('/auth/login');
        });
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});

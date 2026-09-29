import VueSkeletor from 'vue-skeletor';

import 'vue-skeletor/dist/vue-skeletor.css';

export default defineNuxtPlugin(({ vueApp }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vueApp.use(VueSkeletor as any, { shimmer: true });
});

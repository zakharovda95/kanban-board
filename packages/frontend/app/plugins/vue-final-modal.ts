import { createVfm, type Vfm } from 'vue-final-modal';

export default defineNuxtPlugin(({ vueApp }) => {
  const vfm: Vfm = createVfm();
  vueApp.use(vfm);
});

import VueTippy from 'vue-tippy';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(VueTippy, {
    defaultProps: {
      placement: 'auto',
      theme: 'light',
    },
  });
});

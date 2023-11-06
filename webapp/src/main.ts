import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { router } from './router';
import { i18n } from './i18n';
// @ts-expect-error no types for the package
import VueYandexMetrika from 'vue3-yandex-metrika';

const app = createApp(App);

app.use(router);

app.use(i18n);

if (import.meta.env.VITE_YA_METRIKA_ID !== undefined) {
  app.use(VueYandexMetrika, {
    id: import.meta.env.VITE_YA_METRIKA_ID,
    router,
    // @ts-expect-error no types
    env: process.env.NODE_ENV,
    // other options
  });
}

app.mount('#app');

import { type RouteLocationNormalized, createRouter, createWebHistory } from 'vue-router';

import StickersetView from './views/StickersetView.vue';
import NewStickerView from './views/NewStickerView.vue';

const routes = [
  { path: '/', component: StickersetView },
  {
    path: '/new-sticker/:back?',
    name: 'New Sticker',
    component: NewStickerView,
    props: (route: RouteLocationNormalized) => ({ back: route.params.back === 'true' }),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

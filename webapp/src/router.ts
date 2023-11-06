import { type RouteLocationNormalized, createRouter, createWebHistory } from 'vue-router';

import StickersetView from './views/StickersetView.vue';
import NewStickerView from './views/NewStickerView.vue';

const routes = [
  { path: '/', component: StickersetView },
  {
    path: '/new-sticker',
    name: 'New Sticker',
    component: NewStickerView,
    props: (route: RouteLocationNormalized) => {
      const props: any = {
        back: route.query.back === 'true',
      };

      if (route.query.inline_query_id !== undefined) {
        props.inlineModeData = {
          queryId: route.query.inline_query_id,
          queryText: route.query.inline_query_text,
          userId: route.query.user_id,
        };
      }

      return props;
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

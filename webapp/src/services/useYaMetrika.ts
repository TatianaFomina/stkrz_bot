import { useRouter, type Router } from 'vue-router';
import { createSharedComposable } from '@vueuse/core';

interface YaMetrika {
  setUserID: (userId: string) => void;
  userParams: (params: Record<string, string>) => void;
  hit: (url: string, params: { referer: string }) => void;
  reachGoal: (goalId: string) => void;
}

declare let Ya: { Metrika2: new (params: { id: string } & typeof CONFIG.options) => YaMetrika };

/**
 * Available Yandex Metrika goals
 */
type YaMetrikaGoals = 'generate-single-sticker-inline' | 'generate-single-sticker-pm' | 'generate-stickerpack-pm';

const CONFIG = {
  options: {
    accurateTrackBounce: true,
    clickmap: true,
    defer: false,
    ecommerce: false,
    params: [],
    userParams: {},
    trackHash: false,
    trackLinks: true,
    type: 0,
    webvisor: false,
    triggerEvent: false,
  },
  router: null,
  env: 'development',
  scriptSrc: 'https://mc.yandex.ru/metrika/tag.js',
  debug: false,
  ignoreRoutes: [] as string[],
  skipSamePath: true,
};

export const useYaMetrika = createSharedComposable((): {
  init: () => Promise<void>;
  setUserId: (userId: string) => void;
  reachGoal: (goalId: YaMetrikaGoals) => void;
} => {
  let yaMetrika: YaMetrika | undefined;
  const router = useRouter();

  async function init(): Promise<void> {
    if (import.meta.env.VITE_YA_METRIKA_ID === undefined) {
      return;
    }

    await loadScript(CONFIG.scriptSrc);

    yaMetrika = new Ya.Metrika2({ id: import.meta.env.VITE_YA_METRIKA_ID, ...CONFIG.options });
    startTracking(router, yaMetrika);
  }

  /**
   * Save user id for statistics
   * @param userId - id of the user
   */
  function setUserId(userId: string): void {
    yaMetrika?.userParams({ UserID: userId });
  }

  /**
   * Loggs goal completion
   * @param goalId - goal id
   */
  function reachGoal(goalId: YaMetrikaGoals): void {
    yaMetrika?.reachGoal(goalId);
  }

  return {
    init,
    setUserId,
    reachGoal,
  };
});

/**
 * Loads Yandex Metrika script
 * @param scriptSrc - script source
 */
async function loadScript(scriptSrc: string): Promise<void> {
  await new Promise((resolve, reject) => {
    const head = document.head !== undefined ? document.head : document.getElementsByTagName('head')[0];
    const script = document.createElement('script');

    script.async = true;
    script.charset = 'utf-8';
    script.src = scriptSrc;

    head.appendChild(script);

    script.onload = resolve;
    script.onerror = reject;
  });
}

/**
 * Sends hits to Yandex Metrika on each route change
 * @param router - app router instance
 * @param metrika - Yandex Metrika instance
 * @returns
 */
function startTracking(router: Router, metrika: YaMetrika): void {
  if (router === undefined) {
    return;
  }
  // Starts autotracking if router is passed
  router.afterEach((to, from) => {
    // check if route is in ignoreRoutes
    if (CONFIG.ignoreRoutes.includes(to.name as string)) { return; }

    // do not track page visit if previous and next routes URLs match
    if (CONFIG.skipSamePath && to.path === from.path) { return; }

    // track page visit
    metrika.hit(to.path, { referer: from.path });
  });
}

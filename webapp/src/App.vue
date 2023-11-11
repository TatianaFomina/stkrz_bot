<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { useTelegramWebApp } from './services/useTelegramWebApp';
import { useYaMetrika } from './services/useYaMetrika';
import { useLocale } from './services/useLocale';

const { ready, language, platform, userId } = useTelegramWebApp();
const { init: initYaMetrika, setUserId } = useYaMetrika();
const { setLocale } = useLocale();

onMounted(async () => {
  ready();

  if (platform !== undefined) {
    window.document.body.setAttribute('platform', platform);
  }

  if (language !== undefined) {
    setLocale(language);
  }

  await initYaMetrika();

  if (userId !== undefined) {
    setUserId(userId);
  }
});
</script>

<style scoped lang="postcss">
.app {
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
  background: var(--color-background);
}
</style>

<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { useTelegramWebApp } from './services/useTelegramWebApp';
import { useLocale } from './services/useLocale';

const { ready, language, platform } = useTelegramWebApp();
const { setLocale } = useLocale();

onMounted(() => {
  ready();

  if (platform !== undefined) {
    window.document.body.setAttribute('platform', platform);
  }

  if (language !== undefined) {
    setLocale(language);
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

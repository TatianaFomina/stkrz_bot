<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { useTelegramWebApp } from './services/useTelegramWebApp';
import { useLocale } from './services/useLocale';

const { ready, language } = useTelegramWebApp();
const { setLocale } = useLocale();

onMounted(() => {
  ready();

  if (language !== undefined) {
    setLocale(language);
  }
});
</script>

<style scoped lang="postcss">
.app {
  max-width: 640px;
}
</style>

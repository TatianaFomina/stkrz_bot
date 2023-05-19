<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { useTelegramWebApp } from './services/useTelegramWebApp';

const { ready } = useTelegramWebApp();

onMounted(() => {
  ready();
});
</script>

<style scoped lang="postcss">
.app {
  max-width: 640px;
}
</style>

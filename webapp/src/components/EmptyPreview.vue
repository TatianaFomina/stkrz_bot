<template>
  <div
    class="empty-preview"
  >
    <LottieAnimation
      class="empty-preview__animation"
      :animation-data="EyesAnimation"
      :auto-play="true"
      :loop="true"
      :speed="1"
    />
    <p class="empty-preview__title">
      {{ text }}
    </p>
  </div>
</template>

<script lang='ts' setup>
import { LottieAnimation } from 'lottie-web-vue';
import EyesAnimation from '../assets/animations/eyes.json';

defineProps<{
  text: string;
}>();
</script>

<style lang="postcss">
.empty-preview {
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  padding: 10px 50px;
  height: 200px;
  box-sizing: border-box;

  &__title {
    font-weight: 500;
    font-size: 16px;
    margin-top: 12px;
  }

  &__subtitle {
    font-size: var(--font-size-default);
    margin-top: 4px;
  }

  &__animation {
    width: 90px;
    height: 90px;
  }
}
</style>

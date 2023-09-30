<template>
  <div class="font-selector">
    <button
      v-for="font in fonts"
      :key="font.name"
      :class="[
        'font-selector__item',
        modelValue === font.name && 'font-selector__item--active'
      ]"
      @click="onSelect(font.name)"
    >
      <img
        :src="font.image"
        class="font-selector__item-image"
      >
    </button>
  </div>
</template>

<script lang='ts' setup>
import { Font } from '../services/useFonts';

defineProps<{
  modelValue: Font;
}>();

const emit = defineEmits<{(eventName: 'update:modelValue', value: Font): void }>();

const fonts = [
  { name: Font.Kosko, image: new URL('../assets/font-previews/Kosko.png', import.meta.url).href },
  { name: Font.Airfool, image: new URL('../assets/font-previews/Airfool.png', import.meta.url).href },
  { name: Font.Durik, image: new URL('../assets/font-previews/Durik.png', import.meta.url).href },
  { name: Font.Shadow, image: new URL('../assets/font-previews/Shadow.png', import.meta.url).href },
  { name: Font.Swampy, image: new URL('../assets/font-previews/Swampy.png', import.meta.url).href },
];

function onSelect(fontName: Font): void {
  emit('update:modelValue', fontName);
}
</script>

<style lang="postcss">
.font-selector {
  background-color: var(--color-background-secondary);
  padding: 10px 17px;
  display: flex;
  overflow: auto;
  scrollbar-width: none;

  /** Hide scrollbar */
  &::-webkit-scrollbar{
    display: none;
    -webkit-appearance: none;
    scrollbar-width: none;
  }

  &__item {
    background-color: var(--color-background);
    width: 60px;
    height: 60px;
    border-radius: 100%;
    box-sizing: border-box;
    outline: none;
    flex-shrink: 0;
    padding: 0px;

    &:not(:first-child) {
      margin-left: 10px;
    }

    &--active {
      border: 2px solid var(--color-accent);

      .font-selector__item-image {
        animation: 250ms scale;
      }
    }
  }

  &__item-image {
    width: 100%;
    height: 100%;
  }
}

@keyframes scale {
  0% {
    transform: scale(1, 1);
  }

  60% {
    transform: scale(1.2, 1.2);

  }

  100% {
    transform: scale(1, 1);
  }
}
</style>

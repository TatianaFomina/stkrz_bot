<template>
  <div class="font-selector">
    <button
      v-for="(font, i) of fonts"
      ref="buttons"
      :key="font.name"
      :class="[
        'font-selector__item',
        modelValue === font.name && 'font-selector__item--active'
      ]"
      @click="onSelect(i, font.name)"
    >
      <img
        :src="font.image"
        class="font-selector__item-image"
      >
    </button>
  </div>
</template>

<script lang='ts' setup>
import { ref, nextTick } from 'vue';
import { Font } from '../services/useFonts';

defineProps<{
  modelValue: Font;
}>();

const emit = defineEmits<{(eventName: 'update:modelValue', value: Font): void }>();

const buttons = ref<HTMLElement[]>([]);

const fonts = [
  { name: Font.Airfool, image: new URL('../assets/font-previews/Airfool.png', import.meta.url).href },
  { name: Font.Kosko, image: new URL('../assets/font-previews/Kosko.png', import.meta.url).href },
  { name: Font.Lepka, image: new URL('../assets/font-previews/Lepka.png', import.meta.url).href },
  { name: Font.EuropeExtended, image: new URL('../assets/font-previews/EuropeExtended.png', import.meta.url).href },
  { name: Font.Fibre, image: new URL('../assets/font-previews/Fibre.png', import.meta.url).href },
  { name: Font.Durik, image: new URL('../assets/font-previews/Durik.png', import.meta.url).href },
  { name: Font.Shadow, image: new URL('../assets/font-previews/Shadow.png', import.meta.url).href },
  { name: Font.Swampy, image: new URL('../assets/font-previews/Swampy.png', import.meta.url).href },
];

async function onSelect(i: number, fontName: Font): Promise<void> {
  emit('update:modelValue', fontName);

  await nextTick();

  animate(i);
}

function animate(index: number) {
  const el = buttons.value[index];

  el.classList.add('font-selector__item--animating');
  el.addEventListener('animationend', () => {
    el.classList.remove('font-selector__item--animating');
  }, { once: true });
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
    width: 52px;
    height: 52px;
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
    }

    &--animating {
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

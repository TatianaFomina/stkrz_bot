<template>
  <div class="new-sticker">
    <ImagePreview
      v-if="text"
      class="new-sticker__preview"
      :text="text"
      :text-size="textSize"
      :font="font"
      @update="onImageDataUpdate"
    />

    <EmptyPreview
      v-else
      class="new-sticker__empty"
    />

    <Textarea
      v-model="text"
      class="new-sticker__input"
      placeholder="Text"
    />

    <p class="new-sticker__input-hint">
      Enter text you wish to see on the sticker
    </p>

    <div class="new-sticker__size-input">
      <p class="new-sticker__size-small">
        A
      </p>
      <Slider
        v-model="textSize"
        class="new-sticker__slider"
        :min="72"
        :max="136"
        :step="8"
      />
      <p class="new-sticker__size-big">
        A
      </p>
    </div>

    <FontSelector
      v-model="font"
      class="new-sticker__font-selector"
    />

    <p class="new-sticker__input-hint">
      Select text style
    </p>
  </div>
</template>

<script lang='ts' setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useTelegramWebApp, useTelegramWebAppBackButton, useTelegramWebAppMainButton } from '../services/useTelegramWebApp';
import { useStore } from '../services/useStore';
import ImagePreview from '../components/ImagePreview.vue';
import EmptyPreview from '../components/EmptyPreview.vue';
import Slider from '../components/Slider.vue';
import FontSelector from '../components/FontSelector.vue';
import { Font } from '../services/useFonts';
import Textarea from '../components/Textarea.vue';

const {
  impactOccurred,
} = useTelegramWebApp();

const {
  showMainButton,
  hideMainButton,
  setMainButtonText,
  addMainButtonClickHandler,
  removeMainButtonClickHandler,
} = useTelegramWebAppMainButton();

const {
  showBackButton,
  hideBackButton,
  addBackButtonClickHandler,
  removeBackButtonClickHandler,
} = useTelegramWebAppBackButton();

const { addStickerData: addStickerToStore } = useStore();
const router = useRouter();

const props = defineProps<{
  /**
   * True if back button should be displayed
   */
   back?: boolean;
}>();

const text = ref<string>('Hey You Lazy');
const textSize = ref<number>(104);
const font = ref<Font>(Font.Kosko);
const imageData = ref<Blob | null>(null);

onMounted(async () => {
  setMainButtonText(props.back ? 'ADD' : 'CREATE STICKER');
  showMainButton();
  addMainButtonClickHandler(onClick);

  if (props.back) {
    showBackButton();
    addBackButtonClickHandler(onBackClick);
  }
});

onUnmounted(() => {
  removeMainButtonClickHandler(onClick);
  removeBackButtonClickHandler(onBackClick);
  hideBackButton();
  hideMainButton();
});

/**
 * Update main button active state based on enterred text content
 */
watch(text, () => {
  if (text.value === '' || text.value === null || text.value === undefined) {
    hideMainButton();
  } else {
    showMainButton();
  }
});

/**
 * Play vibration when text size changes
 */
watch(textSize, () => {
  impactOccurred('light');
});

async function onClick(): Promise<void> {
  if (imageData.value === null) {
    return;
  }

  addStickerToStore(imageData.value);
  router.push('/');
}

function onBackClick(): void {
  router.push('/');
}

function onImageDataUpdate(data: Blob | null): void {
  imageData.value = data;
}
</script>

<style lang="postcss">
.new-sticker {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;

  & > *:not(:first-child) {
    margin-top: 28px;
  }

  &__preview, &__empty {
    width: 200px;
    height: 200px;
    box-sizing: border-box;
  }

  &__empty {
    color: var(--color-text-secondary);
    padding: 30px;
  }

  &__input {
    align-self: stretch;
  }

  &__input-hint {
    color: var(--color-text-secondary);
    font-size: 14px;
    margin-top: 6px !important;
    align-self: start;
    margin-left: 12px;
  }

  &__size-input {
    align-self: stretch;
    display: flex;
    align-items: center;
    padding: 0 14px;

  }

  &__slider {
    flex: 1;
  }

  &__size-small {
    color: var(--color-text-secondary);
    font-size: 16px;
    line-height: 16px;
    margin-right: 16px;
  }

  &__size-big {
    color: var(--color-text-secondary);
    font-size: 28px;
    line-height: 24px;
    margin-left: 16px;
  }

  &__font-selector {
    align-self: stretch;
  }

}
</style>

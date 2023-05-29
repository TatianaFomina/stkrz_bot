<template>
  <div class="new-sticker">
    <ImagePreview
      v-if="text"
      class="new-sticker__preview"
      :text="text"
      :text-size="textSize"
      :stroke-size="strokeSize"
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
      :placeholder="t('editor.text_placeholder')"
    />

    <p class="new-sticker__input-hint">
      {{ t('editor.text_prompt') }}
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

    <p class="new-sticker__input-hint">
      {{ t('editor.size_hint') }}
    </p>

    <FontSelector
      v-model="font"
      class="new-sticker__font-selector"
    />

    <p class="new-sticker__input-hint">
      {{ t('editor.style_prompt') }}
    </p>

    <div class="new-sticker__stroke-size-input">
      <p class="new-sticker__stroke-size-small">
        0
      </p>

      <Slider
        v-model="strokeSize"
        class="new-sticker__slider"
        :min="0"
        :max="40"
        :step="8"
      />

      <p class="new-sticker__stroke-size-big">
        Max
      </p>
    </div>

    <p class="new-sticker__input-hint">
      {{ t('editor.stroke_hint') }}
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
import { useLocale } from '../services/useLocale';

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

const { t } = useLocale();

const props = defineProps<{
  /**
   * True if back button should be displayed
   */
   back?: boolean;
}>();

const text = ref<string>(t('editor.start_text'));
const textSize = ref<number>(104);
const strokeSize = ref<number>(24);
const font = ref<Font>(Font.Kosko);
const imageData = ref<Blob | null>(null);

onMounted(async () => {
  setMainButtonText(props.back ? t('editor.add') : t('editor.create'));
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
watch([textSize, font, strokeSize], () => {
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
    background-color: var(--color-background-secondary);
    border-radius: 10px;
    align-self: stretch;
    display: flex;
    align-items: center;
    padding: 16px 14px;
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

  &__stroke-size-input {
    align-self: stretch;
    background-color: var(--color-background-secondary);
    border-radius: 10px;
    padding: 16px 14px;
    display: flex;
    align-items: center;
  }

  &__stroke-size-small {
    color: var(--color-text-secondary);
    margin-right: 16px;
    font-weight: 500;
  }

  &__stroke-size-big {
    color: var(--color-text-secondary);
    margin-left: 16px;
    font-weight: 500;
  }

}
</style>

<template>
  <div class="new-sticker">
    <div class="new-sticker__gallery">
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
    </div>

    <div class="new-sticker__tools">
      <Textarea
        v-model="text"
        class="new-sticker__input"
        :placeholder="t('editor.text_placeholder')"
        :hint=" t('editor.text_prompt')"
      />

      <FontSelector
        v-show="currentTab === 'font'"
        v-model="font"
        class="new-sticker__font-selector"
      />

      <StrokeSizeInput
        v-if="currentTab === 'stroke'"
        v-model="strokeSize"
      />

      <TextSizeInput
        v-if="currentTab === 'size'"
        v-model="textSize"
      />

      <Toolbar v-model="currentTab" />
    </div>
  </div>
</template>

<script lang='ts' setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useTelegramWebApp, useTelegramWebAppBackButton, useTelegramWebAppMainButton } from '../services/useTelegramWebApp';
import { useStore } from '../services/useStore';
import ImagePreview from '../components/ImagePreview.vue';
import EmptyPreview from '../components/EmptyPreview.vue';
import FontSelector from '../components/FontSelector.vue';
import { Font } from '../services/useFonts';
import Textarea from '../components/textarea';
import { useLocale } from '../services/useLocale';
import Toolbar from '../components/toolbar/Toolbar.vue';
import { Tool } from '../components/toolbar/Tool';
import TextSizeInput from '../components/TextSizeInput.vue';
import StrokeSizeInput from '../components/StrokeSizeInput.vue';

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
const currentTab = ref<Tool>('font');

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
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__preview, &__empty {
    width: 150px;
    height: 150px;
    box-sizing: border-box;
    background-color: var(--color-background);
    border-radius: 10px;
    box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.10), 0px 0px 5px 0px rgba(0, 0, 0, 0.10);
  }

  &__empty {
    color: var(--color-text-secondary);
    padding: 30px;
  }

  &__input {
    align-self: stretch;
    margin-left: 17px;
    margin-right: 17px;
    margin-bottom: 28px;
    margin-top: 28px;
  }

  &__font-selector {
    align-self: stretch;
  }

  &__gallery {
    padding: 17px 0;
    width: 100%;
    background-color: var(--color-background-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  }

  &__tools {
    align-self: stretch;
  }

}
</style>

<template>
  <div
    ref="container"
    class="new-sticker"
  >
    <ImagePreview
      v-if="text"
      class="new-sticker__preview"
      :text="text"
      :text-size="textSize"
      :stroke-size="strokeSize"
      :font="font"
      :text-color="textColor"
      @update="onImageDataUpdate"
    />

    <EmptyPreview
      v-else
      class="new-sticker__empty"
    />
  </div>

  <div
    ref="tools"
    class="new-sticker__tools"
  >
    <Textarea
      ref="textInput"
      v-model="text"
      class="new-sticker__input"
      :placeholder="t('editor.text_placeholder')"
      :hint=" t('editor.text_prompt')"
      @focus="onFocus"
      @blur="onBlur"
    />
    <div v-show="!isToolbarHidden">
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

      <ColorSelector
        v-if="currentTab === 'color'"
        v-model="textColor"
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
import ColorSelector from '../components/ColorSelector.vue';

const {
  impactOccurred,
  onViewportChange,
  getViewportHeight,
} = useTelegramWebApp();

const {
  showMainButton,
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
const font = ref<Font>(Font.Airfool);
const textColor = ref<string>('black');
const imageData = ref<Blob | null>(null);
const currentTab = ref<Tool>('font');

/**
 * True if toolbar should be hidden.
 * Used to hide keyboard on input focus
 */
const isToolbarHidden = ref(false);

const container = ref<HTMLElement | null>(null);
const tools = ref<HTMLElement | null>(null);
const textInput = ref<InstanceType<typeof Textarea>>(null);

/**
 * Sticker preview height
*/
const previewHeight = ref(0);

/**
 * Tools top indent for fixed positioning
 */
const toolsTop = ref(0);

onMounted(async () => {
  setMainButtonText(props.back ? t('editor.add') : t('editor.create'));
  showMainButton();
  addMainButtonClickHandler(onClick);

  if (props.back) {
    showBackButton();
    addBackButtonClickHandler(onBackClick);
  }

  updateSizes();

  onViewportChange(() => {
    updateSizes();
  });
});

onUnmounted(() => {
  removeMainButtonClickHandler(onClick);
  removeBackButtonClickHandler(onBackClick);
  hideBackButton();
});

/**
 * Updates indents and heights of fixed positioned elements.
 */
function updateSizes(): void {
  if (tools.value === null) {
    return;
  }
  const viewportHeight = getViewportHeight() || 0;

  previewHeight.value = viewportHeight - tools.value.offsetHeight;
  toolsTop.value = previewHeight.value;
}

/**
 * Update main button active state based on enterred text content
 */
watch(text, () => {
  if (text.value === '' || text.value === null || text.value === undefined) {
    // hideMainButton();
  } else {
    // showMainButton();
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

/**
 * Hides software keyboard on mobile devices
*/
function hideKeyboard(): void {
  textInput.value.blur();

  window.scrollTo(0, 0);
}

/**
 * Handles input focus
 */
function onFocus(): void {
  isToolbarHidden.value = true;

  setMainButtonText('Continue');

  addMainButtonClickHandler(() => {
    hideKeyboard();
  });
}

function onBlur() {
  isToolbarHidden.value = false;
}
</script>

<style lang="postcss">
.new-sticker {
  height: 100vh;
  max-height: v-bind('previewHeight + "px"');
  position: fixed;
  overflow: hidden;
  /* top: calc(var(--tg-viewport-stable-height)) - v-bind('toolsHeight + "px"'); */
  top: 0;
  left: 0;
  right: 0;
  will-change: top, height, max-height;
  transition: max-height 200ms ease;
  z-index: 100;

  background-color: var(--color-background-secondary);
  display: flex;
  align-items: center;
  justify-content: center;

  &__preview {
    width: 200px;
    height: 200px;
    box-sizing: border-box;
  }

  &__input {
    margin-left: 17px;
    margin-right: 17px;
    margin-bottom: 28px;
    margin-top: 28px;
  }

  &__tools {
    position: fixed;
    top: v-bind('toolsTop + "px"');
    left: 0;
    right: 0;
    z-index: 2;
    background-color: var(--color-background);
    transition: top 200ms ease;
    will-change: top;
  }

}
</style>

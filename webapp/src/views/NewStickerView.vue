<template>
  <div
    ref="container"
    class="new-sticker"
  >
    <div class="new-sticker__gallery">
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
  </div>
  <div
    ref="tools"
    class="new-sticker__tools"
  >
    {{ viewportHeight }} / {{ previewHeight }} /  {{ toolsHeight }}
    <Textarea
      ref="textInput"
      v-model="text"
      class="new-sticker__input"
      :placeholder="t('editor.text_placeholder')"
      :hint=" t('editor.text_prompt')"
      @focus="onFocus"
    />
    <template v-if="!isToolbarHidden">
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
    </template>
  </div>
</template>

<script lang='ts' setup>
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
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
import { watchOnce } from '@vueuse/core';

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
const font = ref<Font>(Font.Airfool);
const textColor = ref<string>('black');
const imageData = ref<Blob | null>(null);
const currentTab = ref<Tool>('font');

const container = ref<HTMLElement | null>(null);
const tools = ref<HTMLElement | null>(null);
const viewportHeight = ref(0);

const previewHeight = ref(0);

onMounted(async () => {
  setMainButtonText(props.back ? t('editor.add') : t('editor.create'));
  showMainButton();
  addMainButtonClickHandler(onClick);

  if (props.back) {
    showBackButton();
    addBackButtonClickHandler(onBackClick);
  }

  window.visualViewport?.addEventListener('resize', (event) => {
    viewportHeight.value = event.target?.height;

    if (tools.value !== null) {
      previewHeight.value = viewportHeight.value - tools.value.offsetHeight;
    }

    // container.value.style.height = viewportHeight.value + 'px';
  });

  previewHeight.value = viewportHeight.value;

  updateToolsHeight();

  // window.Telegram?.WebApp.onEvent('viewportChanged', (params) => {
  //   if (!params.isStateStable) {
  //     return;
  //   }

  //   viewportHeight.value = window.Telegram?.WebApp.viewportStableHeight;
  // });
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

const isToolbarHidden = ref(false);

const textInput = ref<InstanceType<typeof Textarea>>(null);

function hideKeyboard(): void {
  textInput.value.blur();
  window.scrollTo(0, 0);
}

const toolsHeight = ref(0);

function updateToolsHeight(): void {
  if (tools.value) {
    toolsHeight.value = tools.value.offsetHeight;
  }
}

function onFocus(): void {
  // setTimeout(() => {

  // watchOnce(viewportHeight, () => {
  //   alert('change');
  //   container.value.style.height = viewportHeight.value + 'px';
  // });

  // window.scrollTo(0, 0);
  // container.value?.scrollIntoView(true);
  // nextTick(() => {
  isToolbarHidden.value = true;
  requestAnimationFrame(() => {
    updateToolsHeight();
    // window.scrollTo(0, 0);
  });
  // });

  // setTimeout(() => {
  //   container.value.style.height = viewportHeight.value + 'px';
  // }, 1000);
  // nextTick(() => {
  //   container.value.style.height = viewportHeight.value + 'px';
  // });
  // updateHeight();

  // container.value.style.height = viewportHeight.value + 'px';
  // window.scrollTo(0, 0);
  // }, 100);

  setMainButtonText('Continue');
  removeMainButtonClickHandler(onClick);
  addMainButtonClickHandler(() => {
    hideKeyboard();
    container.value?.click();
  });
}

// function updateHeight() {
//   window.visualViewport?.addEventListener('resize', (event) => {
//     viewportHeight.value = event.target?.height;
//     container.value.style.height = viewportHeight.value + 'px';
//   }, { once: true });
// }

function onBlur(): void {

}
</script>

<style lang="postcss">
.new-sticker {
  /* height: 100vh; */
  /* height: var(--tg-viewport-stable-height); */
  height: v-bind('previewHeight + "px"');
  /* transition: height 0.2s ease-in-out; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: coral;
  position: fixed;
  top: calc(var(--tg-viewport-stable-height)) - v-bind('toolsHeight + "px"');
  will-change: height;
  transition: height 200ms ease;

  &__preview {
    width: 150px;
    height: 150px;
    box-sizing: border-box;
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
    width: 100%;
    background-color: var(--color-background-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: red;
    /* flex: 1; */
  }

  &__tools {
    position: fixed;
    top: calc(var(--tg-viewport-stable-height) - v-bind('toolsHeight + "px"'));
    /* transform: translateY(-100%); */
    left: 0;
    right: 0;
    z-index: 2;
    background-color: var(--color-background);
    transform: translateZ(0);
    /* align-self: stretch; */
    /* position: fixed;
    top: var(--tg-viewport-stable-height);
    transition: top 0.2s ease-in-out;
    transform: translateY(-100%);
    left: 0;
    right: 0;
     */
  }

}
</style>

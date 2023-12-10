<template>
  <div
    ref="container"
    class="new-sticker"
  >
    <div
      class="new-sticker__gallery"
      @touchstart="onTouchStart"
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
        :text="t('editor.empty')"
        class="new-sticker__empty"
      />
    </div>

    <Textarea
      ref="textInput"
      v-model="text"
      class="new-sticker__input"
      :placeholder="t('editor.text_placeholder')"
      :hint="t('editor.text_prompt')"
      @focus="onFocus"
    />

    <div
      v-show="!isToolbarHidden"
      ref="tools"
      class="new-sticker__tools"
    >
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
import { onMounted, onUnmounted, ref, watch, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTelegramWebApp, useTelegramWebAppBackButton, useTelegramWebAppMainButton } from '../services/useTelegramWebApp';
import { useStore } from '../services/useStore';
import ImagePreview from '../components/ImagePreview.vue';
import EmptyPreview from '../components/EmptyPreview.vue';
import FontSelector from '../components/FontSelector.vue';
import { Font } from '../services/useFonts';
import Textarea from '../components/textarea/Textarea.vue';
import { useLocale } from '../services/useLocale';
import Toolbar from '../components/toolbar/Toolbar.vue';
import { Tool } from '../components/toolbar/Tool';
import TextSizeInput from '../components/TextSizeInput.vue';
import StrokeSizeInput from '../components/StrokeSizeInput.vue';
import ColorSelector from '../components/ColorSelector.vue';
import { MiniAppMode } from '../types/MiniAppMode';
import { useServer } from '../services/useServer';
import { useYaMetrika } from '../services/useYaMetrika';

const {
  impactOccurred,
  switchInlineQuery,
  isMobileClient,
} = useTelegramWebApp();

const {
  showMainButton,
  setMainButtonText,
  showProgress,
  hideProgress,
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
const { createSingleSticker } = useServer();
const router = useRouter();
const { setUserId, reachGoal } = useYaMetrika();

const { t } = useLocale();

const props = defineProps<{
  /**
   * True if back button should be displayed
   */
   back?: boolean;

   /**
    * Some additional data if case app was opened in inline mode
    */
   inlineModeData?: {
    queryId: string;
    queryText: string;
    userId: string;
   };
}>();

const text = ref<string>(props.inlineModeData?.queryText || t('editor.start_text'));
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
const textInput = ref<InstanceType<typeof Textarea> | null>(null);

onMounted(async () => {
  setMainButtonText(props.back ? t('editor.add') : t('editor.create'));
  showToolbar();
  addMainButtonClickHandler(submit);

  if (props.back) {
    showBackButton();
    addBackButtonClickHandler(onBackClick);
  }

  showMainButton();

  if (mode.value === MiniAppMode.INLINE && props.inlineModeData?.userId !== undefined) {
    setUserId(props.inlineModeData?.userId);
  }
});

onUnmounted(() => {
  removeMainButtonClickHandler(submit);
  removeBackButtonClickHandler(onBackClick);
  hideBackButton();
});

/**
 * Play vibration when text size changes
 */
watch([textSize, font, strokeSize, textColor], () => {
  impactOccurred('light');
});

/**
 * Mini app opening mode
 */
const mode = computed<MiniAppMode>(() => props.inlineModeData !== undefined ? MiniAppMode.INLINE : MiniAppMode.PM);

/**
 * Adds sticker to store and navigates to stickers list view in PM mode.
 * Creates sticker and returns to inline query in case of inline mode.
 */
async function submit(): Promise<void> {
  if (imageData.value === null) {
    return;
  }

  if (mode.value === MiniAppMode.PM) {
    addStickerToStore(imageData.value);
    router.push('/');
  } else if (mode.value === MiniAppMode.INLINE && props.inlineModeData !== undefined) {
    showProgress();

    const stickerId = await createSingleSticker({
      userId: props.inlineModeData?.userId,
      queryId: props.inlineModeData?.queryId,
      data: imageData.value,
    });

    if (stickerId !== undefined) {
      const goal = mode.value === MiniAppMode.INLINE ? 'generate-single-sticker-inline' : 'generate-single-sticker-pm';
      reachGoal(goal);

      await switchInlineQuery('id:' + stickerId);
    }

    hideProgress();
  }
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
  textInput.value?.blur();

  window.scrollTo(0, 0);
}

/**
 * Handles input focus
 * Hides toolbar and changes main button text and function on mobile for better accessibility
 */
function onFocus(): void {
  if (!isMobileClient.value) {
    return;
  }
  isToolbarHidden.value = true;

  setMainButtonText(t('editor.continue'));
  addMainButtonClickHandler(() => {
    hideKeyboard();
    showToolbar();
  });
}

/**
 * Shows toolbar and updates mauin button text.
 * Returns back hidden toolbar and assigns back main button text and function for better accessibility
 */
function showToolbar() {
  if (!isMobileClient.value) {
    return;
  }
  isToolbarHidden.value = false;

  setMainButtonText(props.back ? t('editor.add') : t('editor.create'));
  addMainButtonClickHandler(submit);
}

/**
 * Handles canvas touch start.
 * Hides canvas and shows toolbar
 */
function onTouchStart() {
  if (!isMobileClient.value) {
    return;
  }
  hideKeyboard();

  nextTick(() => {
    showToolbar();
  });
}

const toolbarHeight = computed(() => isToolbarHidden.value ? 0 : 139);
</script>

<style lang="postcss">
.new-sticker {
  height: calc(100vh - v-bind('toolbarHeight + "px"'));
  transition: height 300ms ease-in-out;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: end;

  &__preview {
    width: 200px;
    height: 200px;
    box-sizing: border-box;
  }

  &__gallery {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px
  }

  &__input {
    padding: 17px var(--margin-x) 17px;
    background-color: var(--color-background);
    background-color: var(--color-background-secondary);
  }

  &__tools {
    position: fixed;
    background-color: var(--color-background);
    bottom: 0;
    left: 0;
    right: 0;;
  }

}
</style>

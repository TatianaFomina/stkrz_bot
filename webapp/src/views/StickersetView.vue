<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="stickerset-view">
    <template v-if="!isLoading">
      <div class="stickerset-view__stickers">
        <div
          v-for="sticker in stickers"
          :key="sticker.emojis"
          class="stickerset-view__item"
        >
          <img
            class="stickerset-view__item-image"
            :src="getUrl(sticker.data)"
          >

          <button
            class="stickerset-view__delete-item"
            @click="deleteSticker(sticker)"
          >
            <Cross />
          </button>
        </div>

        <EmptyPreview
          v-if="stickers.length === 0"
          :text="t('stickers_view.empty')"
          class="stickerset-view__empty"
        />

        <button
          v-if="stickers.length <= maxStickers"
          class="stickerset-view__add"
          @click="addNewSticker"
        >
          <PlusIcon />
          {{ t('stickers_view.add_sticker') }}
        </button>

        <p
          v-else
          class="stickerset-view__message"
        >
          <span v-html="t('stickers_view.max_exceeded')" />
        </p>
      </div>

      <div class="stickerset-view__settings">
        <Input
          ref="titleInput"
          v-model="stickersetTitle"
          class="stickerset-view__input"
          :placeholder="t('stickers_view.title_placeholder')"
          :hint="t('stickers_view.title_hint')"
          @focus="onFocus"
          @blur="onBlur"
        />

        <Input
          ref="shortnameInput"
          v-model="stickersetName"
          pattern="[^-A-Za-z]"
          class="stickerset-view__input"
          :placeholder="t('stickers_view.name_placeholder')"
          :hint="t('stickers_view.name_hint')"
          @focus="onFocus"
          @blur="onBlur"
        />
      </div>
    </template>
    <Transition>
      <LottieAnimation
        v-if="isLoading"
        class="stickerset-view__loading-animation"
        :animation-data="DuckThinking"
        :auto-play="true"
        :loop="true"
        :speed="1"
      />
    </Transition>
  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Input from '../components/input/Input.vue';
import PlusIcon from '../icons/Plus.vue';
import { useTelegramWebApp, useTelegramWebAppMainButton } from '../services/useTelegramWebApp';
import { useRouter } from 'vue-router';
import { Sticker } from '../types/sticker';
import { useStore } from '../services/useStore';
import { useServer } from '../services/useServer';
import { useLocale } from '../services/useLocale';
import Cross from '../icons/Cross.vue';
import EmptyPreview from '../components/EmptyPreview.vue';
import { LottieAnimation } from 'lottie-web-vue';
import DuckThinking from '../assets/animations/duck.json';
import { useYaMetrika } from '../services/useYaMetrika';

const {
  userId,
  queryId,
  impactOccurred,
  close,
  isMobileClient,
} = useTelegramWebApp();

const {
  setMainButtonText,
  addMainButtonClickHandler,
  removeMainButtonClickHandler,
  showProgress,
  hideProgress,
  setMainButtonActive,
} = useTelegramWebAppMainButton();

const { reachGoal } = useYaMetrika();

const router = useRouter();

const { t } = useLocale();

const { getStickers, setStickers, getTitle, setTitle, getName, setName } = useStore();
const { createStickerset, checkStickersetName } = useServer();

const stickersetTitle = ref<string | null | undefined>();
const stickersetName = ref<string | null | undefined>();
const stickers = ref<Sticker[]>([]);
const maxStickers = 50;
const isLoading = ref(false);

const titleInput = ref<InstanceType<typeof Input> | null>(null);
const shortnameInput = ref<InstanceType<typeof Input> | null>(null);

onMounted(() => {
  setMainButtonText(t('stickers_view.publish'));
  addMainButtonClickHandler(submit);

  stickers.value = getStickers();
  stickersetName.value = getName();
  stickersetTitle.value = getTitle();
});

onUnmounted(() => {
  removeMainButtonClickHandler(submit);
  setMainButtonActive(true);
});

watch(stickersetTitle, value => {
  if (typeof value !== 'string') {
    return;
  }
  setTitle(value);
}, { immediate: true });

watch(stickersetName, value => {
  if (typeof value !== 'string') {
    return;
  }

  setName(value);
}, { immediate: true });

watch([stickersetName, stickersetTitle], () => {
  if (stickersetName.value === null || stickersetName.value === undefined || stickersetName.value.length === 0) {
    setMainButtonActive(false);
    return;
  }

  if (stickersetTitle.value === null || stickersetTitle.value === undefined || stickersetTitle.value.length === 0) {
    setMainButtonActive(false);
    return;
  }

  setMainButtonActive(true);
});

function addNewSticker(): void {
  impactOccurred('light');

  router.push({ name: 'New Sticker', query: { back: 'true' } });
}

function deleteSticker(sticker: Sticker): void {
  stickers.value = stickers.value.filter(item => item.data !== sticker.data);

  setStickers(stickers.value);
  impactOccurred('light');
}

async function submit(): Promise<void> {
  if (stickers.value.length === 0) {
    alert(t('stickers_view.no_stickers'));
    return;
  }
  if (userId === undefined || queryId === undefined || typeof stickersetName.value !== 'string' || typeof stickersetTitle.value !== 'string') {
    return;
  }

  try {
    isLoading.value = true;
    showProgress();

    const exists = await checkStickersetName(stickersetName.value);

    if (exists) {
      alert(t('stickers_view.stickerpask_exists'));

      return;
    }

    await createStickerset({
      userId,
      queryId,
      name: stickersetName.value,
      title: stickersetTitle.value,
      stickers: stickers.value,
    });

    reachGoal('generate-stickerpack-pm');

    close();
  } finally {
    isLoading.value = false;
    hideProgress();
  }
}

/**
 * Creates url from blob
 * @param data - sticker image blob
 */
function getUrl(data: Blob): string {
  return URL.createObjectURL(data);
}

/**
 * Handles input focus.
 * Updates mauin button text and function for better accesibility on mobile.
 */
function onFocus(): void {
  if (!isMobileClient.value) {
    return;
  }
  setMainButtonText(t('editor.continue'));
  addMainButtonClickHandler(() => {
    hideKeyboard();
  });
}

/**
 * Handles input blur.
 * Assigns back main button text and function for better accessibility on mobile
 */
function onBlur(): void {
  if (!isMobileClient.value) {
    return;
  }
  setMainButtonText(t('stickers_view.publish'));
  addMainButtonClickHandler(submit);
}

/**
 * Hides software keyboard on mobile devices
 */
function hideKeyboard(): void {
  titleInput.value?.blur();
  shortnameInput.value?.blur();

  window.scrollTo(0, 0);
}
</script>

<style lang="postcss">
.stickerset-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__stickers {
    --padding: 17px;

    width: calc(100% - var(--padding) * 2);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr;
    gap: var(--padding);
    background-color: var(--color-background);
    padding: var(--padding);
  }

  &__empty {
    grid-column: 1 / 4;
    grid-row: 1;
    text-align: center;
    align-self: center;
  }

  &__item {
    position: relative;
    background-color: var(--color-background-secondary);
    border-radius: var(--border-radius);
    box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.10), 0px 0px 5px 0px rgba(0, 0, 0, 0.10);
    aspect-ratio: 1 / 1;
  }

  &__item-image {
    object-fit: cover;
    width: 100%;
    max-height: 100%;
  }

  &__settings {
    background-color: var(--color-background-secondary);
    padding: 0 var(--margin-x);
    padding-top: var(--margin-y);
    flex: 1;

    & > *:not(:first-child) {
      margin-top: 28px;
    }
  }

  &__delete-item {
    background:  var(--color-background-secondary);
    color: var(--color-text-secondary);
    cursor: pointer;
    border-radius: 100%;
    flex-shrink: 0;
    align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -10px;
    right: -8px;
    cursor: pointer;
    width: 28px;
    height: 28px;
    svg {
      width: 28px;
      height: 28px;
    }
  }

  &__add {
    background-color: transparent;
    color: var(--color-link);
    font-size: var(--font-size-default);
    display: flex;
    align-items: center;
    margin: 0 auto;
    grid-column: 1 / 4;
    height: -webkit-max-content;

    svg {
      margin-right: 3px;
    }
  }

  &__message {
    text-align: center;
    color: var(--color-text-secondary);
    grid-column: 1 / 4;

  }

  &__loading-animation {
    width: 150px;
    height: 150px;
    margin: auto;
  }
}

/* classes for transition animation */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

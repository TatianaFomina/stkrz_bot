<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="stickerset-view">
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

      <div
        v-if="stickers.length === 0"
        class="stickerset-view__empty"
      >
        {{ t('stickers_view.empty') }}
      </div>
    </div>

    <div class="stickerset-view__settings">
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

      <Input
        v-model="stickersetTitle"
        class="stickerset-view__input"
        :placeholder="t('stickers_view.title_placeholder')"
        :hint="t('stickers_view.title_hint')"
      />

      <Input
        v-model="stickersetName"
        pattern="[^-A-Za-z]"
        class="stickerset-view__input"
        :placeholder="t('stickers_view.name_placeholder')"
        :hint="t('stickers_view.name_hint')"
      />
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Input from '../components/input/index.ts';
import PlusIcon from '../icons/Plus.vue';
import { useTelegramWebApp, useTelegramWebAppMainButton } from '../services/useTelegramWebApp';
import { useRouter } from 'vue-router';
import { Sticker } from '../types/sticker';
import { useStore } from '../services/useStore';
import { useServer } from '../services/useServer';
import { useLocale } from '../services/useLocale';
import Cross from '../icons/Cross.vue';

const {
  userId,
  queryId,
  impactOccurred,
  close,
} = useTelegramWebApp();

const {
  setMainButtonText,
  addMainButtonClickHandler,
  removeMainButtonClickHandler,
  showProgress,
  hideProgress,
  setMainButtonActive,
} = useTelegramWebAppMainButton();

const router = useRouter();

const { t } = useLocale();

const { getStickers, setStickers, getTitle, setTitle, getName, setName } = useStore();
const { createStickerset, checkStickersetName } = useServer();

const stickersetTitle = ref<string | null | undefined>();
const stickersetName = ref<string | null | undefined>();
const stickers = ref<Sticker[]>([]);
const maxStickers = 50;

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

watch([stickers, stickersetName, stickersetTitle], () => {
  if (stickers.value.length === 0) {
    setMainButtonActive(false);
    return;
  }

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

  router.push({ name: 'New Sticker', params: { back: 'true' } });
}

function deleteSticker(sticker: Sticker): void {
  stickers.value = stickers.value.filter(item => item.data !== sticker.data);

  setStickers(stickers.value);
  impactOccurred('light');
}

async function submit(): Promise<void> {
  if (userId === undefined || queryId === undefined || typeof stickersetName.value !== 'string' || typeof stickersetTitle.value !== 'string') {
    return;
  }

  try {
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

    close();
  } finally {
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
</script>

<style lang="postcss">
.stickerset-view {

  &__stickers {
    --padding: 17px;

    width: calc(100% - var(--padding) * 2);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--padding);
    background-color: var(--color-background-secondary);
    padding: 34px var(--padding);
    flex: 1;
  }

  &__empty {
    grid-column: 1 / 4;
    text-align: center;
    color: var(--color-text-secondary);
    opacity: 0.5;
  }

  &__item {
    position: relative;
    background-color: var(--color-background);
    border-radius: 10px;
    box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.10), 0px 0px 5px 0px rgba(0, 0, 0, 0.10);
    aspect-ratio: 1 / 1;
  }

  &__item-image {
    object-fit: cover;
    width: 100%;
    max-height: 100%;
  }

  &__settings {
    margin-top: 28px;
    padding: 0 17px;

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

    svg {
      margin-right: 3px;
    }
  }

  &__message {
    text-align: center;
    color: var(--color-text-secondary);
  }

}
</style>

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
    </div>

    <button
      v-if="stickers.length <= maxStickers"
      class="stickerset-view__add"
      @click="addNewSticker"
    >
      <PlusIcon />
      Add new sticker
    </button>

    <p
      v-else
      class="stickerset-view__message"
    >
      Maximum number of stickers in stickerset <br> exceeded
    </p>

    <Input
      v-model="stickersetTitle"
      class="stickerset-view__input"
      placeholder="Stickerset title"
    />

    <p class="stickerset-view__input-hint">
      Title that is displayed to the users of the stickerset
    </p>

    <Input
      v-model="stickersetName"
      pattern="[^-A-Za-z]"
      class="stickerset-view__input"
      placeholder="Stickerset short name"
    />

    <p class="stickerset-view__input-hint">
      Unique identifier used for referencing stickers. <br>Be cautious, stickerset name can not be changed later
    </p>
  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Input from '../components/Input.vue';
import PlusIcon from '../icons/Plus.vue';
import { useTelegramWebApp, useTelegramWebAppMainButton } from '../services/useTelegramWebApp';
import { useRouter } from 'vue-router';
import { Sticker } from '../types/sticker';
import { useStore } from '../services/useStore';
import { useServer } from '../services/useServer';
import Cross from '../icons/Cross.vue';

const {
  userId,
  queryId,
  impactOccurred,
  close,
} = useTelegramWebApp();

const {
  showMainButton,
  hideMainButton,
  setMainButtonText,
  addMainButtonClickHandler,
  removeMainButtonClickHandler,
  showProgress,
  hideProgress,
} = useTelegramWebAppMainButton();

const router = useRouter();

const { getStickers, setStickers, getTitle, setTitle, getName, setName } = useStore();
const { createStickerset, checkStickersetName } = useServer();

const stickersetTitle = ref<string | null | undefined>();
const stickersetName = ref<string | null | undefined>();
const stickers = ref<Sticker[]>([]);
const maxStickers = 50;

onMounted(() => {
  setMainButtonText('PUBLISH');
  addMainButtonClickHandler(submit);

  stickers.value = getStickers();
  stickersetName.value = getName();
  stickersetTitle.value = getTitle();
});

onUnmounted(() => {
  removeMainButtonClickHandler(submit);
});

watch(stickersetTitle, value => {
  if (typeof value !== 'string') {
    return;
  }
  setTitle(value);
});

watch(stickersetName, value => {
  if (typeof value !== 'string') {
    return;
  }

  setName(value);
});

watch([stickers, stickersetName, stickersetTitle], () => {
  if (stickers.value.length === 0) {
    hideMainButton();
    return;
  }

  if (stickersetName.value === null || stickersetName.value === undefined || stickersetName.value.length === 0) {
    hideMainButton();
    return;
  }

  if (stickersetTitle.value === null || stickersetTitle.value === undefined || stickersetTitle.value.length === 0) {
    hideMainButton();
    return;
  }

  showMainButton();
});

function addNewSticker(): void {
  impactOccurred('light');

  router.push({ name: 'New Sticker', params: { back: 'true' } });
}

function deleteSticker(sticker: Sticker): void {
  stickers.value = stickers.value.filter(item => item.data !== sticker.data);

  setStickers(stickers.value);
}

async function submit(): Promise<void> {
  if (userId === undefined || queryId === undefined || typeof stickersetName.value !== 'string' || typeof stickersetTitle.value !== 'string') {
    return;
  }

  try {
    showProgress();

    const exists = await checkStickersetName(stickersetName.value);

    if (exists) {
      alert('Stickerset with such short name already exists. Please, choose another one');

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
  padding: 16px;

  &__stickers {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
  }

  &__item {
    position: relative;
  }

  &__item-image {
    object-fit: cover;
    width: 100%;
    max-height: 100%;
  }

  & > *:not(:first-child) {
    margin-top: 28px;
  }

  &__input-hint {
    color: var(--color-text-secondary);
    font-size: 14px;
    margin-top: 6px !important;
    align-self: start;
    margin-left: 12px;
  }

  &__delete-item {
    background: var(--color-text-secondary);
    color: var(--color-background-secondary);
    border-radius: 12px;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -6px;
    right: -6px;
  }

  &__add {
    background-color: transparent;
    color: var(--color-link);
    font-size: 14px;
    display: flex;
    align-items: center;
    margin: 0 auto;

    svg {
      width: 18px;
      height: 18px;
      margin-right: 4px;
    }
  }

  &__message {
    text-align: center;
    color: var(--color-text-secondary);
  }
}
</style>

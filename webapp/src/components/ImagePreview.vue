<template>
  <canvas
    ref="containerRef"
    class="image-preview"
    :width="size"
    :height="size"
  />
</template>

<script lang='ts' setup>
import { onMounted, ref, watch } from 'vue';
import { useCanvas } from '../services/useCanvas';
import { Font } from '../services/useFonts';

const props = withDefaults(defineProps<{
  /**
   * Text to be displayed on canvas
   */
  text: string;

  /**
   * Size of the text displayed on the canvas
   */
  textSize?: number;

  /**
   * Size of the text stroke
   */
  strokeSize?: number;

  /**
   * Font family name of the text displayed on the canvas
   */
  font?: Font;

  /**
   * Canvas size in pixels
   */
  size?: number;

  /**
   * Color of the text
   */
  textColor: string;
}>(), {
  text: 'Sample text',
  size: 512,
  strokeSize: 16,
  textSize: 44,
  font: Font.Kosko,
});

const emit = defineEmits<{(eventName: 'update', data: Blob | null): void }>();

const containerRef = ref<HTMLCanvasElement | null>(null);

const { displayText, getImageData } = useCanvas(containerRef);

onMounted(async () => {
  await updateImage();
});

watch(() => [props.text, props.textSize, props.font, props.strokeSize, props.textColor], async () => {
  await updateImage();
}, { immediate: true });

async function updateImage(): Promise<void> {
  await displayText(props.text, {
    font: props.font,
    fontSize: props.textSize,
    strokeSize: props.strokeSize,
    fontColor: props.textColor,
  });

  setTimeout(async () => {
    const data = await getImageData();

    emit('update', data);
  }, 100);
}
</script>

<style lang="postcss">
.image-preview {

}
</style>

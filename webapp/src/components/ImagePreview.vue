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
   * Font family name of the text displayed on the canvas
   */
  font?: Font;

  /**
   * Canvas size in pixels
   */
  size?: number;
}>(), {
  text: 'Sample text',
  size: 512,
  textSize: 44,
  font: Font.Test,
});

const emit = defineEmits<{(eventName: 'update', data: Blob | null): void }>();

const containerRef = ref<HTMLCanvasElement | null>(null);

const { displayText, getImageData } = useCanvas(containerRef);

onMounted(async () => {
  await displayText(props.text, props.font, props.textSize);
});

watch(() => [props.text, props.textSize, props.font], async () => {
  await displayText(props.text, props.font, props.textSize);

  setTimeout(async () => {
    const data = await getImageData();

    emit('update', data);
  }, 100);
}, { immediate: true });
</script>

<style lang="postcss">
.image-preview {

}
</style>

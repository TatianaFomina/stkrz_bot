<template>
  <div class="slider">
    <input
      ref="input"
      class="slider__input"
      type="range"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      @input="onInput"
    >
    <div class="slider__ticks">
      <div
        v-for="i in ticksNumber + 1"
        :key="i"
        :class="[
          'slider__tick',
          min + i * step <= modelValue && 'slider__tick--active',
          isTickHidden(i) && 'slider__tick--hidden'
        ]"
      />
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  /**
   * slider value
   */
  modelValue: number;

  /**
   * Min value
   */
  min: number;

  /**
   * Max value
   */
  max: number;

  /**
   * Ticks step
   */
  step: number;
}>();

const emit = defineEmits<{(eventName: 'update:modelValue', value: number): void}>();

const input = ref<HTMLInputElement | null>(null);

const ticksNumber = computed(() => Math.floor((props.max - props.min) / props.step));

onMounted(() => {
  drawProgress(props.modelValue);
});

/**
 * Handles input
 * @param event - input event
 */
function onInput(event: Event): void {
  if (input.value === null) {
    return;
  }

  const value = parseInt((event.target as HTMLInputElement).value);

  drawProgress(value);

  emit('update:modelValue', value);
}

/**
 * Draws progress on the slider trask
 * @param value - current slider value
 */
function drawProgress(value: number): void {
  if (input.value === null) {
    return;
  }
  const progress = ((value - props.min) / (props.max - props.min)) * 100;

  input.value.style.background = `linear-gradient(to right, var(--color-accent) ${progress}%, var(--color-text-secondary) ${progress}%)`;
}

/**
 * Determines whether tick is overlapped by slider thumb and hence should be hidden
 * @param index - tick index starting with 1
 */
function isTickHidden(index: number): boolean {
  const tickValue = props.min + (index - 1) * props.step;

  if (tickValue !== props.modelValue) {
    return false;
  }

  if (tickValue === props.min || tickValue === props.max) {
    return true;
  }

  return false;
}
</script>

<style lang="postcss">
.slider {
  position: relative;
  height: 32px;

  &__input {
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    width: 100%;
    margin: 0;
    z-index: 1;
    position: relative;

    /*  styling the track  */
    height: 4px;

    &::-webkit-slider-thumb {
      /* removing default appearance */
      -webkit-appearance: none;
      appearance: none;
      height: 28px;
      width: 28px;
      border-radius: 50%;
      background: var(--color-text-secondary);
      cursor: grab;
      border: none;
      box-sizing: border-box;
    }
  }

  &__ticks {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__tick {
    width: 4px;
    height: 10px;
    background: var(--color-text-secondary);

    &--active {
      background: var(--color-accent);
    }

    &--hidden {
      opacity: 0;
    }
  }

}
</style>

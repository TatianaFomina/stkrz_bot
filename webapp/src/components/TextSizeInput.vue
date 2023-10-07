<template>
  <div
    class="text-size-input"
  >
    <p class="text-size-input__size-small">
      A
    </p>

    <Slider
      :model-value="modelValue"
      class="text-size-input__slider"
      :min="72"
      :max="136"
      :step="8"
      @input="onChange"
    />

    <p class="text-size-input__size-big">
      A
    </p>
  </div>
</template>

<script lang='ts' setup>
import Slider from '../components/Slider.vue';

defineProps<{
  modelValue: number;
}>();

const emit = defineEmits<{(eventName: 'update:modelValue', value: number): void }>();

function onChange(event: InputEvent): void {
  emit('update:modelValue', parseInt((event.target as HTMLInputElement)?.value));
}
</script>

<style lang="postcss">
.text-size-input {
    background-color: var(--color-background-secondary);
    align-self: stretch;
    display: flex;
    align-items: center;
    padding: 20px 17px;

    &__slider {
      flex: 1;
    }

    &__size-small {
      color: var(--color-text-secondary);
      font-size: 16px;
      line-height: 16px;
      margin-right: 16px;
      width: 28px;
      height: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__size-big {
      color: var(--color-text-secondary);
      font-size: 28px;
      line-height: 24px;
      margin-left: 16px;
      width: 28px;
      height: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>

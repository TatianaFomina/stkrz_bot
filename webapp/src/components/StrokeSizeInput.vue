<template>
  <div class="stroke-size-input">
    <IconThinLine class="stroke-size-input__stroke-size-small" />

    <Slider
      :model-value="modelValue"
      class="stroke-size-input__slider"
      :min="8"
      :max="40"
      :step="8"
      @input="onChange"
    />

    <IconThickLine class="stroke-size-input__stroke-size-big" />
  </div>
</template>

<script lang='ts' setup>
import Slider from '../components/Slider.vue';
import IconThinLine from '../icons/ThinLine.vue';
import IconThickLine from '../icons/ThickLine.vue';

defineProps<{
  modelValue: number;
}>();

const emit = defineEmits<{(eventName: 'update:modelValue', value: number): void }>();

function onChange(event: InputEvent): void {
  emit('update:modelValue', parseInt((event.target as HTMLInputElement)?.value));
}
</script>

<style lang="postcss">
  .stroke-size-input {
    align-self: stretch;
    background-color: var(--color-background-secondary);
    padding: 20px 17px;
    display: flex;
    align-items: center;

    &__slider {
      flex: 1;
    }

    &__stroke-size-small {
      color: var(--color-text-secondary);
      margin-right: 16px;
    }

    &__stroke-size-big {
      color: var(--color-text-secondary);
      margin-left: 16px;
    }
  }
</style>

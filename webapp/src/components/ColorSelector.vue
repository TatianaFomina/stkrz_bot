<template>
  <div class="color-selector">
    <button
      v-for="color of colors"
      ref="buttons"
      :key="color"
      :class="[
        'color-selector__item',
        modelValue === color && 'color-selector__item--active'
      ]"

      @click="onSelect(color)"
    >
      <div
        :style="`background: ${color}`"
        class="color-selector__sample"
      />
    </button>
  </div>
</template>

<script lang='ts' setup>
/**
 * Supported colors
 */
const colors = [
  'black',
  '#0064FF',
  '#00CA48',
  '#FFCA00',
  '#DF7C00',
  '#FF081B',
  '#CF25FC',
];

defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{(eventName: 'update:modelValue', value: string): void }>();

function onSelect(color: string): void {
  emit('update:modelValue', color);
}
</script>

<style lang="postcss">
.color-selector {
  background-color: var(--color-background-secondary);
  padding: 10px 17px;
  display: flex;
  overflow: auto;
  scrollbar-width: none;

  /** Hide scrollbar */
  &::-webkit-scrollbar{
    display: none;
    -webkit-appearance: none;
    scrollbar-width: none;
  }

  &__item {
    background-color: var(--color-background-secondary);
    width: 52px;
    height: 52px;
    border-radius: 100%;
    box-sizing: border-box;
    outline: none;
    flex-shrink: 0;
    padding: 0px;
    padding: 4px;

    &:not(:first-child) {
      margin-left: 10px;
    }

    &--active {
      border: 2px solid var(--color-accent);
    }
  }

  &__sample {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
}
</style>

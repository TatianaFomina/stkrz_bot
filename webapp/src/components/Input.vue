<template>
  <div class="input">
    <input
      ref="input"
      type="text"
      class="input__input"
      :value="modelValue"
      :placeholder="placeholder"
      @keyup="onInput"
      @keydown="validate"
    >
    <button
      v-if="modelValue"
      class="input__clear"
      @click="clear"
    >
      <Cross />
    </button>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue';
import Cross from '../icons/Cross.vue';

const props = defineProps<{
  modelValue: string | null | undefined;
  placeholder?: string;
  pattern?: string;
}>();

const emit = defineEmits<{(eventName: 'update:modelValue', value: string): void }>();

const input = ref< HTMLInputElement | null >(null);

/**
 * Handle input
 * @param event - input event
 */
function onInput(event: Event): void {
  const value = (event.target as HTMLInputElement)?.value;

  emit('update:modelValue', value);
}

/**
 * Disallow unwanted characters
 * @param event - keyboard event
 */
function validate(event: KeyboardEvent): void {
  if (props.pattern === undefined) {
    return;
  }
  const value = event.key;

  if (value.match(new RegExp(props.pattern, 'gi'))) {
    event.preventDefault();
  }
}

function clear(): void {
  emit('update:modelValue', '');
  input.value?.focus();
}
</script>

<style lang="postcss">
.input {
  background-color: var(--color-background-secondary);
  border-radius: 10px;
  display: flex;
  padding: 10px 12px;
  box-sizing: border-box;

  &__input {
    border: none;
    background: transparent;
    font-size: 16px;
    height: 100%;
    flex: 1;
    color: var(--color-text);
    padding: 0;
    height: 24px;

    &::placeholder {
      color: var(--color-text-secondary);
    }

    &:focus {
      outline: none;
    }
  }

  &__clear {
    background: var(--color-text-secondary);
    color: var(--color-background-secondary);
    border-radius: 12px;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

}
</style>

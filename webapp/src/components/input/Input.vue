<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="input">
    <div class="input-field">
      <input
        ref="input"
        type="text"
        class="input-field__input"
        :value="modelValue"
        :placeholder="placeholder"
        @keyup="onInput"
        @keydown="validate"
        @focus="emit('focus')"
        @blur="emit('blur')"
      >
      <button
        v-if="modelValue"
        class="input-field__clear"
        @click="clear"
      >
        <Cross />
      </button>
    </div>

    <p
      v-if="hint"
      class="input__hint"
      v-html="hint"
    />
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue';
import Cross from '../../icons/Cross.vue';

const props = defineProps<{
  modelValue: string | null | undefined;
  placeholder?: string;
  pattern?: string;
  hint?: string;
}>();

/* eslint-disable-next-line func-call-spacing */
const emit = defineEmits<{
  (eventName: 'update:modelValue', value: string): void;
  (eventName: 'clear'): void;
  (eventName: 'focus'): void;
  (eventName: 'blur'): void;
}>();

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
  emit('clear');
  input.value?.focus();
}

function blur(): void {
  input.value?.blur();
}

defineExpose({
  blur,
});
</script>

<style lang="postcss">
.input {
  &__hint {
    color: var(--color-text-secondary);
    font-size: 13px;
    margin-top: 8px !important;
    align-self: start;
    margin-left: 17px;
    margin-right: 17px;
  }
}

.input-field {
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  display: flex;
  padding-left: 17px;
  padding-right: 13px;
  box-sizing: border-box;
  height: 44px;

  &__input {
    border: none;
    background: transparent;
    font-size: 17px;
    height: 100%;
    flex: 1;
    color: var(--color-text);
    padding: 0;

    &::placeholder {
      color: var(--color-text-secondary);
      opacity: 0.5;
    }

    &:focus {
      outline: none;
    }
  }

  &__clear {
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    border-radius: 12px;
    flex-shrink: 0;
    align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

}
</style>

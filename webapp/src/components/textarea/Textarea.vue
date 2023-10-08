<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="textarea">
    <div class="textarea-field">
      <textarea
        ref="textarea"
        class="textarea-field__input"
        :value="modelValue"
        :placeholder="placeholder"
        @keyup="onInput"
        @blur="emit('blur')"
        @focus="emit('focus')"
      />

      <button
        v-if="modelValue"
        class="textarea-field__clear"
        @click="clear"
      >
        <Cross />
      </button>
    </div>

    <p
      v-if="hint"
      class="textarea__hint"
      v-html="hint"
    />
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue';
import Cross from '../../icons/Cross.vue';

const props = withDefaults(defineProps<{
  modelValue: string | undefined;
  placeholder?: string;
  maxHeight?: number;
  hint?: string;
}>(), {
  maxHeight: 200,
  placeholder: '',
  hint: '',
});

/* eslint-disable-next-line func-call-spacing */
const emit = defineEmits<{
  (eventName: 'update:modelValue', value: string): void;
  (eventName: 'clear'): void;
  (eventName: 'blur'): void;
  (eventName: 'focus'): void;
}>();

const textarea = ref< HTMLTextAreaElement | null >(null);

/**
 * Handle input
 * @param event - input event
 */
function onInput(event: Event): void {
  if (textarea.value === null) {
    return;
  }

  /** Adjust textarea height */
  textarea.value.style.height = ''; /* Reset the height */
  textarea.value.style.height = Math.min(textarea.value.scrollHeight, props.maxHeight) + 'px';

  const value = (event.target as HTMLTextAreaElement)?.value;

  emit('update:modelValue', value);
}

/**
 * Clears textarea content
 */
function clear(): void {
  if (textarea.value === null) {
    return;
  }

  emit('update:modelValue', '');
  emit('clear');
  textarea.value.focus();

  textarea.value.style.height = ''; /* Reset the height */
}

function blur(): void {
  textarea.value?.blur();
}

function focus(): void {
  textarea.value?.focus();
}

defineExpose({
  blur,
  focus,
});
</script>

<style lang="postcss">
.textarea {
  &__hint {
    color: var(--color-text-secondary);
    font-size: 13px;
    margin-top: 8px !important;
    align-self: start;
    margin-left: 17px;
    margin-right: 17px;
  }
}

.textarea-field {
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  display: flex;
  padding: 10px 17px;
  padding-left: 17px;
  padding-right: 13px;
  box-sizing: border-box;

  &__input {
    resize: none;
    border: none;
    background: transparent;
    font-size: 16px;
    line-height: 24px;
    height: 100%;
    flex: 1;
    color: var(--color-text);
    padding: 0;
    height: 24px;

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
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: flex-start;
    height: 24px;
  }
}
</style>

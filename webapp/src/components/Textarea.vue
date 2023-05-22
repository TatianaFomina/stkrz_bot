<template>
  <div class="textarea">
    <textarea
      ref="textarea"
      class="textarea__input"
      :value="modelValue"
      :placeholder="placeholder"
      @keyup="onInput"
    />

    <button
      v-if="modelValue"
      class="textarea__clear"
      @click="clear"
    >
      <Cross />
    </button>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue';
import Cross from '../icons/Cross.vue';

const props = withDefaults(defineProps<{
  modelValue: string | undefined;
  placeholder?: string;
  maxHeight?: number;
}>(), {
  maxHeight: 200,
  placeholder: '',
});

const emit = defineEmits<{(eventName: 'update:modelValue', value: string): void }>();

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
  textarea.value.focus();

  textarea.value.style.height = ''; /* Reset the height */
}
</script>

<style lang="postcss">
.textarea {
  background-color: var(--color-background-secondary);
  border-radius: 10px;
  display: flex;
  padding: 10px 12px;
  box-sizing: border-box;

  &__input {
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
    align-self: flex-start;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 4px;
  }
}
</style>

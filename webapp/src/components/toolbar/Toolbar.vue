<template>
  <div class="toolbar">
    <button
      v-for="tool of tools"
      :key="tool.label"
      :class="['toolbar__tool', isActive(tool) && 'toolbar__tool--active']"
      @click="onToolClick(tool)"
    >
      <component :is="tool.icon" />

      <span class="toolbar__tool-label">
        {{ tool.label }}
      </span>
    </button>
  </div>
</template>

<script lang='ts' setup>
import { Tool } from './Tool.ts';
import IconFont from '../../icons/Font.vue';
import IconFontSize from '../../icons/FontSize.vue';
import IconThinLine from '../../icons/ThinLine.vue';
import IconPalette from '../../icons/Palette.vue';
import { computed } from 'vue';
import { useLocale } from '../../services/useLocale';

const props = defineProps<{
  modelValue: Tool;
}>();

const emit = defineEmits<{(eventName: 'update:modelValue', value: Tool): void }>();

const { t } = useLocale();

const tools = computed(() => [
  {
    label: t('editor.tools.font'),
    name: 'font',
    icon: IconFont,
  },
  {
    label: t('editor.tools.color'),
    name: 'color',
    icon: IconPalette,
  },
  {
    label: t('editor.tools.size'),
    name: 'size',
    icon: IconFontSize,
  },
  {
    label: t('editor.tools.stroke'),
    name: 'stroke',
    icon: IconThinLine,
  },
]);

function isActive(tool: { name: string }): boolean {
  return tool.name === props.modelValue;
}

function onToolClick(tool: { name: string }): void {
  emit('update:modelValue', tool.name as Tool);
}
</script>

<style lang="postcss">
  .toolbar {
    background-color: var(--color-background-secondary);
    display: flex;
    padding-top: 12px;
    padding-bottom: 12px;
    justify-content: space-around;
    border-top: 1px rgba(128, 128, 128, 0.213) solid;

    &__tool {
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 100%;
      background-color: transparent;
      cursor: pointer;
      color: var(--color-text-secondary);
      font-size: 17px;
      width: 44px;

      &--active {
        color: var(--color-accent)
      }
    }

    &__tool-label {
      font-size: 12px;
      text-align: center;
    }

  }
</style>

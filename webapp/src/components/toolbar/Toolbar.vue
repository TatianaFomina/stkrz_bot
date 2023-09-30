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
import IconSettings from '../../icons/Settings.vue';

const props = defineProps<{
  modelValue: Tool;
}>();

const emit = defineEmits<{(eventName: 'update:modelValue', value: Tool): void }>();

const tools = [
  {
    label: 'Font',
    icon: IconFont,
  },
  {
    label: 'Stroke',
    icon: IconThinLine,
  },
  {
    label: 'Size',
    icon: IconFontSize,
  },
  {
    label: 'Color',
    icon: IconPalette,
  },
  {
    label: 'Settings',
    icon: IconSettings,
  },
];

function isActive(tool: { label: string }): boolean {
  return tool.label.toLowerCase() === props.modelValue;
}

function onToolClick(tool: { label: string }): void {
  emit('update:modelValue', tool.label.toLowerCase() as Tool);
}
</script>

<style lang="postcss">
.toolbar {
    width: calc(100% - 17px * 2);
    background-color: var(--color-background-secondary);
    display: flex;
    padding: 10px 17px;
    padding-bottom: 17px;
    justify-content: space-around;
    position: sticky;
    bottom: 0;

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
      margin-top: 5px;
    }

  }
</style>

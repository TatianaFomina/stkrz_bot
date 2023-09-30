import { type Component } from 'vue';
import { useTelegramWebApp, type Platform } from './useTelegramWebApp';

type ComponentVariants = Partial<Record<Platform, Component>>;

/**
 * Returns correct variant of component depending on current platform.
 * Otherwise returns iOS component version
 * @param components - map of platforms and components
 */
export function withPlatform(components: ComponentVariants): Component | undefined {
  const { platform } = useTelegramWebApp();

  if (platform === undefined) {
    return components.ios;
  }

  const component = components[platform];

  if (component !== undefined) {
    return component;
  }

  return components.ios;
}

import { Text as RNText } from 'react-native';
import type { ComponentType } from 'react';

type TextWithDefaults = ComponentType<React.ComponentProps<typeof RNText>> & {
  defaultProps?: { className?: string };
};
const TextComponent = RNText as TextWithDefaults;

export type TextSize = 'text-base' | 'text-lg' | 'text-xl';

// This function initializes the default text size for the Text component.
export function initTailwindTextSize(initial: TextSize = 'text-base') {
  TextComponent.defaultProps = {
    ...(TextComponent.defaultProps || {}),
    className: initial,
  };
}
// This function sets the default text size for the Text component.
export function setTailwindTextSize(size: TextSize) {
  TextComponent.defaultProps = {
    ...(TextComponent.defaultProps || {}),
    className: size,
  };
}
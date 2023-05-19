import postcssNested from 'postcss-nested';
import postcssPresetEnv from 'postcss-preset-env';
import postcssApply from 'postcss-apply';
import postcssHoverMediaFeature from 'postcss-hover-media-feature';

export default function () {
  return {
    plugins: [
      postcssNested(),
      postcssPresetEnv({
        importFrom: './src/modules/shared/presentation/styles/media.json',
        features: {
          'nesting-rules': false,
          'custom-properties': {
            disableDeprecationNotice: true,
          },
        },
      }),
      postcssApply(),
      postcssHoverMediaFeature(),
    ],
  };
}

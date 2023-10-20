import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
  ],
  webpackFinal: async (config) => {
    return {
      ...config,
      module: {
        // This section allows to support ?raw syntax
        // more info https://github.com/webpack/webpack/issues/12900#issuecomment-1479392726
        ...config.module,
        rules: [
          ...(config?.module?.rules as any).map((rule) => ({
            ...rule,
            resourceQuery: { not: [/raw/] },
          })),
          {
            resourceQuery: /raw/,
            type: 'asset/source',
          },
        ],
      },
    }
  },
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;

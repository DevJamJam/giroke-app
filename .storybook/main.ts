import { defineMain } from "@storybook/nextjs-vite/node";
import tailwindcss from "@tailwindcss/vite";

export default defineMain({
  framework: "@storybook/nextjs-vite",
  stories: ["../src/**/*.stories.tsx"],
  // 앱은 Turbopack loader로 Tailwind를 처리하므로 Storybook(Vite)에는 Vite 플러그인을 따로 붙인다
  viteFinal: (config) => ({ ...config, plugins: [...(config.plugins ?? []), tailwindcss()] }),
});

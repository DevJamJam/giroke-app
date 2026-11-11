import { definePreview } from "@storybook/nextjs-vite";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";

import "../src/app/globals.css";

export default definePreview({
  // 생략하면 addon 타입이 never로 추론되어 모든 story 타입이 깨진다(10.6.7)
  addons: [],
  globalTypes: {
    theme: {
      description: "테마",
      toolbar: { title: "Theme", icon: "mirror", items: ["light", "dark"], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, { globals }) => {
      // 앱과 같은 방식(data-theme)으로 토큰을 바꾼다
      document.documentElement.dataset.theme = globals.theme;
      document.body.classList.add("bg-background", "text-foreground");
      return <Story />;
    },
  ],
});

import preview from "../../../.storybook/preview";
import { Card } from "./card";

const meta = preview.meta({ title: "UI/Card", component: Card });

export const Default = meta.story({
  args: {
    className: "max-w-sm",
    children: (
      <>
        <h2 className="font-semibold">카드 제목</h2>
        <p className="mt-1 text-sm text-foreground-muted">surface 배경과 border 토큰을 씁니다.</p>
      </>
    ),
  },
});

import preview from "../../../.storybook/preview";
import { Button } from "./button";
import { Empty } from "./empty";

const meta = preview.meta({
  title: "UI/Empty",
  component: Empty,
  args: { title: "오늘 할 일이 없어요", description: "할 일을 추가하면 여기에 보여요." },
});

export const Default = meta.story({});
export const WithAction = meta.story({ args: { action: <Button>할 일 추가</Button> } });

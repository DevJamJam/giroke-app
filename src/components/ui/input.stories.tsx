import preview from "../../../.storybook/preview";
import { Input } from "./input";

const meta = preview.meta({
  title: "UI/Input",
  component: Input,
  args: { label: "제목", placeholder: "할 일을 입력해요" },
});

export const Default = meta.story({});
export const WithHint = meta.story({ args: { label: "메모", hint: "200자 이내" } });
export const WithError = meta.story({
  args: { label: "이메일", defaultValue: "wrong", error: "이메일 형식이 아니에요" },
});
export const Disabled = meta.story({ args: { disabled: true } });

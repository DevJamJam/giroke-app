import preview from "../../../.storybook/preview";
import { Button } from "./button";

const meta = preview.meta({ title: "UI/Button", component: Button, args: { children: "저장" } });

export const Primary = meta.story({});
export const Secondary = meta.story({ args: { variant: "secondary", children: "취소" } });
export const Danger = meta.story({ args: { variant: "danger", children: "삭제" } });
export const Disabled = meta.story({ args: { disabled: true } });
export const Loading = meta.story({ args: { loading: true, children: "저장 중" } });

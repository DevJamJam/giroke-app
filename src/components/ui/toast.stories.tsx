import preview from "../../../.storybook/preview";
import { Button } from "./button";
import { Toaster, toast } from "./toast";

const meta = preview.meta({ title: "UI/Toast", component: Toaster });

export const Default = meta.story({
  render: () => (
    <>
      <Button onClick={() => toast("저장했어요")}>토스트 띄우기</Button>
      <Toaster />
    </>
  ),
});

import { useState } from "react";

import preview from "../../../.storybook/preview";
import { Button } from "./button";
import { Modal } from "./modal";

const meta = preview.meta({ title: "UI/Modal", component: Modal });

export const DeleteConfirm = meta.story({
  args: { open: false, onClose: () => {}, title: "할 일을 삭제할까요?", children: null },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>모달 열기</Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)}>
          <p className="text-sm text-foreground-muted">휴지통에서 30일 동안 복구할 수 있어요.</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              삭제
            </Button>
          </div>
        </Modal>
      </>
    );
  },
});

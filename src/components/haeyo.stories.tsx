import preview from "../../.storybook/preview";
import { Haeyo } from "./haeyo";

const meta = preview.meta({ title: "Haeyo/표정", component: Haeyo });

export const AllRatings = meta.story({
  render: () => (
    <div className="flex gap-4">
      {([1, 2, 3, 4, 5] as const).map((rating) => (
        <Haeyo key={rating} rating={rating} size={64} label={`하루 체크 ${rating}`} />
      ))}
    </div>
  ),
});

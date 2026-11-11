export type HaeyoRating = 1 | 2 | 3 | 4 | 5;

type HaeyoProps = {
  /** 하루 체크 1~5에 대응하는 표정 */
  rating?: HaeyoRating;
  size?: number;
  /** 의미를 전달할 때만 지정한다. 없으면 장식으로 보고 스크린리더에서 숨긴다 */
  label?: string;
};

// shortcut: 임시 SVG 표정이다, 캐릭터 그림이 준비되면 같은 size 슬롯을 유지한 채 이미지로 교체
export function Haeyo({ rating = 3, size = 96, label }: HaeyoProps) {
  const mouthY = 64 + (rating - 3) * 8; // 3=일자, 높을수록 웃는 입
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-rating={rating}
      className="shrink-0"
    >
      <circle cx="50" cy="50" r="46" className="fill-primary-soft stroke-primary" strokeWidth="3" />
      <circle cx="36" cy="42" r="4" className="fill-primary" />
      <circle cx="64" cy="42" r="4" className="fill-primary" />
      <path
        d={`M32 64 Q50 ${mouthY} 68 64`}
        className="fill-none stroke-primary"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

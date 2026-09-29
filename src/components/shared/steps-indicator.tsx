export const StepsIndicator = ({
  step,
  STEPS,
}: {
  step: number;
  STEPS: { label: string }[];
}) => {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((s, i) => {
        const num = i + 1;
        const isActive = step === num;
        const isDone = step > num;
        return (
          <div
            key={num}
            className="flex items-center"
            style={{ flex: i < STEPS.length - 1 ? "1" : undefined }}
          >
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ring-2 transition-all duration-300",
                  isActive
                    ? "bg-foreground text-background ring-foreground"
                    : isDone
                      ? "bg-[oklch(0.28_0.05_200)] text-white ring-[oklch(0.28_0.05_200)]"
                      : "bg-transparent text-muted-foreground ring-border",
                ].join(" ")}
              >
                {isDone ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 7L5.5 10L11.5 4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  num
                )}
              </div>
              <span
                className={`text-[11px] font-medium transition-colors duration-300 ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="relative mx-2 mb-5 h-0.5 flex-1 overflow-hidden rounded-full bg-border">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-[oklch(0.28_0.05_200)] transition-all duration-500"
                  style={{ width: isDone ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

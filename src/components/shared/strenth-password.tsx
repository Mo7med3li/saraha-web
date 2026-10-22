import { Check, X } from "lucide-react";
import { useMemo } from "react";

export default function PasswordStrengthIndicator({
  newPasswordValue,
}: {
  newPasswordValue: string;
}) {
  // Password Strength Indicators
  const criteria = useMemo(() => {
    const val = newPasswordValue || "";
    return [
      { id: "len", label: "At least 8 characters", met: val.length >= 8 },
      {
        id: "upper",
        label: "One uppercase letter (A-Z)",
        met: /[A-Z]/.test(val),
      },
      {
        id: "lower",
        label: "One lowercase letter (a-z)",
        met: /[a-z]/.test(val),
      },
      { id: "num", label: "One numeric digit (0-9)", met: /\d/.test(val) },
      {
        id: "spec",
        label: "One special character (!@#$%...)",
        met: /[^A-Za-z0-9]/.test(val),
      },
    ];
  }, [newPasswordValue]);

  const strengthScore = criteria.filter((c) => c.met).length;

  const strengthInfo = useMemo(() => {
    if (!newPasswordValue)
      return { label: "None", color: "bg-muted", percent: 0 };
    if (strengthScore <= 2)
      return { label: "Weak", color: "bg-rose-500", percent: 30 };
    if (strengthScore <= 4)
      return { label: "Moderate", color: "bg-amber-500", percent: 70 };
    return { label: "Strong", color: "bg-emerald-500", percent: 100 };
  }, [newPasswordValue, strengthScore]);

  return (
    <div className="rounded-xl p-3.5 bg-muted/40 border border-border/60 space-y-3 transition-all duration-300">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">
          Password Strength:
        </span>
        <span
          className={`font-semibold ${
            strengthScore <= 2
              ? "text-rose-500"
              : strengthScore <= 4
                ? "text-amber-500"
                : "text-emerald-500"
          }`}
        >
          {strengthInfo.label}
        </span>
      </div>

      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strengthInfo.color}`}
          style={{ width: `${strengthInfo.percent}%` }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        {criteria.map((c) => (
          <div key={c.id} className="flex items-center gap-2 text-[11px]">
            {c.met ? (
              <Check className="size-3.5 text-emerald-500 shrink-0" />
            ) : (
              <X className="size-3.5 text-muted-foreground/60 shrink-0" />
            )}
            <span
              className={
                c.met ? "text-foreground font-medium" : "text-muted-foreground"
              }
            >
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

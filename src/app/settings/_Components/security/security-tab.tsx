import { Lock, ShieldCheck } from "lucide-react";

export default function SecurityTab() {
  return (
    <div className="rounded-3xl border border-emerald-500/20 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-border/50">
        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="size-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Security Settings
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Update your account password and configure security preferences.
          </p>
        </div>
      </div>

      {/* Place your Security Component here */}
      <div className="min-h-90 w-full flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/30 rounded-2xl p-8 sm:p-12 text-center bg-emerald-500/5">
        <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 mb-3">
          <Lock className="size-8" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">
          Security Component Ready
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
          Drop your change password form and security authentication settings
          component here.
        </p>
      </div>
    </div>
  );
}

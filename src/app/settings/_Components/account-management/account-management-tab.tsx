import { ShieldAlert, UserX } from "lucide-react";

export default function AccountManagementTab() {
  return (
    <div className="rounded-3xl border border-rose-500/20 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-border/50">
        <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <ShieldAlert className="size-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Account Management
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Freeze, restore, or permanently delete your Saraha account.
          </p>
        </div>
      </div>

      {/* Place your Account Management Component here */}
      <div className="min-h-90 w-full flex flex-col items-center justify-center border-2 border-dashed border-rose-500/30 rounded-2xl p-8 sm:p-12 text-center bg-rose-500/5">
        <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 mb-3">
          <UserX className="size-8" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">
          Account Management Component Ready
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
          Drop your account freeze toggle, restore account action, and delete
          account danger zone modals here.
        </p>
      </div>
    </div>
  );
}

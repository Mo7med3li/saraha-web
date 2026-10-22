import { SlidersHorizontal } from "lucide-react";
import SettingsTabs from "./_Components/settings-tabs";
import { ErrorBoundary } from "@/src/components/shared/error-boundry";

export default function SettingsPage() {
  return (
    <section className="container mx-auto p-5 h-screen space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl text-indigo-600 border-indigo-500/20 shadow-xs">
              <SlidersHorizontal className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Account Settings
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage your account preferences, update profile information, and
                configure security options.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs Content Section ── */}
      <ErrorBoundary fallback={<div className="text-center">Error</div>}>
        <SettingsTabs />
      </ErrorBoundary>
    </section>
  );
}

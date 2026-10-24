import { Fraunces } from "next/font/google";
import { SlidersHorizontal } from "lucide-react";
import { redirect } from "next/navigation";
import { ErrorBoundary } from "@/src/components/shared/error-boundry";
import AppNav from "@/src/components/shared/app-nav";
import { getNextAuthToken } from "@/src/lib/utils/auth.utils";
import SettingsTabs from "./_Components/settings-tabs";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-auth-display",
});

export default async function SettingsPage() {
  const jwt = await getNextAuthToken();

  if (!jwt?.token || !jwt.user?._id) {
    redirect("/login?callbackUrl=/settings");
  }

  return (
    <main
      className={`${display.variable} relative isolate flex min-h-svh flex-col bg-[oklch(0.985_0.01_200)] text-foreground`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,oklch(0.88_0.04_195),transparent_55%)]"
      />

      <AppNav />

      <section className="relative z-10 mx-auto w-full max-w-5xl flex-1 space-y-8 px-4 py-6 sm:px-8 sm:py-8 lg:px-12">
        <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-[oklch(0.28_0.05_200/0.12)] bg-white/70 p-2.5 text-[oklch(0.28_0.05_200)] shadow-xs">
              <SlidersHorizontal className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Account Settings
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Manage your profile, security, and account options.
              </p>
            </div>
          </div>
        </div>

        <ErrorBoundary fallback={<div className="text-center">Error</div>}>
          <SettingsTabs />
        </ErrorBoundary>
      </section>
    </main>
  );
}

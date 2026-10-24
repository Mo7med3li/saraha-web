import { Fraunces } from "next/font/google";
import { redirect } from "next/navigation";
import { getNextAuthToken } from "@/src/lib/utils/auth.utils";
import AppNav from "@/src/components/shared/app-nav";
import MessagesInbox from "./_components/messages-inbox";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-auth-display",
});

export default async function Home() {
  const jwt = await getNextAuthToken();

  if (!jwt?.token || !jwt.user?._id) {
    redirect("/login?callbackUrl=/");
  }

  const firstName = jwt.user.userName?.split(" ")[0] || "there";

  return (
    <main
      className={`${display.variable} relative isolate flex h-svh flex-col overflow-hidden bg-[oklch(0.985_0.01_200)] text-foreground`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_0%_0%,oklch(0.9_0.04_195/0.9),transparent_50%),radial-gradient(ellipse_80%_60%_at_100%_100%,oklch(0.93_0.03_210/0.7),transparent_45%)]"
      />
      <div
        aria-hidden
        className="auth-blob pointer-events-none absolute -left-24 top-20 size-72 rounded-full bg-[oklch(0.72_0.08_175/0.12)] blur-3xl"
      />
      <div
        aria-hidden
        className="auth-blob-delayed pointer-events-none absolute -right-20 bottom-10 size-80 rounded-full bg-[oklch(0.55_0.06_210/0.1)] blur-3xl"
      />

      <AppNav />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="auth-rise shrink-0 px-4 pb-2 pt-6 sm:px-8 sm:pt-8 lg:px-12 xl:px-16">
          <h1 className="font-(family-name:--font-auth-display) text-3xl tracking-tight text-[oklch(0.22_0.04_210)] sm:text-4xl lg:text-5xl">
            Hey, {firstName}
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground sm:text-base">
            Anonymous messages people sent you — scroll to load more.
          </p>
        </div>

        <section
          className="auth-rise-delayed flex min-h-0 flex-1 flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-8 lg:px-12 xl:px-16"
          aria-label="Inbox"
        >
          <MessagesInbox userId={jwt.user._id} />
        </section>
      </div>
    </main>
  );
}

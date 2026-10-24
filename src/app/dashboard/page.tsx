import { redirect } from "next/navigation";
import { Fraunces } from "next/font/google";
import { getNextAuthToken } from "@/src/lib/utils/auth.utils";
import AppNav from "@/src/components/shared/app-nav";
import ShareLinkCard from "./_components/share-link-card";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-auth-display",
});

export default async function DashboardPage() {
  const jwt = await getNextAuthToken();

  if (!jwt?.user?._id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const baseUrl = (
    process.env.NEXTAUTH_URL || "http://localhost:3000"
  ).replace(/\/$/, "");
  const shareUrl = `${baseUrl}/u/${jwt.user._id}`;
  const firstName = jwt.user.userName?.split(" ")[0] || "there";

  return (
    <main
      className={`${display.variable} relative isolate flex h-svh flex-col overflow-hidden bg-[oklch(0.985_0.01_200)]`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,oklch(0.88_0.04_195),transparent_55%)]"
      />

      <AppNav />

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col px-4 py-5 sm:px-6 sm:py-7">
        <div className="shrink-0 space-y-1">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Hey, {firstName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Share your link and collect anonymous messages.
          </p>
        </div>

        <div className="mt-6 flex min-h-0 flex-1 flex-col justify-center">
          <ShareLinkCard shareUrl={shareUrl} />
        </div>
      </div>
    </main>
  );
}

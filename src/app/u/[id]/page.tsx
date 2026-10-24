import { Fraunces } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "cn";
import { buttonVariants } from "@/src/components/ui/button";
import { getNextAuthToken } from "@/src/lib/utils/auth.utils";
import { getSharedUserAction } from "./_actions/get-shared-user.action";
import SendMessageForm from "./_components/send-message-form";
import SharedUserHeader from "./_components/shared-user-header";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-auth-display",
});

type SharedLinkPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SharedLinkPage({ params }: SharedLinkPageProps) {
  const { id } = await params;
  const [user, jwt] = await Promise.all([
    getSharedUserAction(id),
    getNextAuthToken(),
  ]);

  if (!user) {
    notFound();
  }

  const isAuthenticated = Boolean(jwt?.token && jwt.user?._id);
  const returnTo = `/u/${id}`;
  const loginHref = `/login?callbackUrl=${encodeURIComponent(returnTo)}`;
  const signupHref = `/signup?callbackUrl=${encodeURIComponent(returnTo)}`;

  return (
    <main
      className={`${display.variable} relative isolate h-svh overflow-hidden bg-[oklch(0.99_0.005_200)] text-foreground lg:grid lg:grid-cols-2`}
    >
      <SharedUserHeader user={user} />

      <section className="relative flex h-[62svh] flex-col overflow-hidden lg:h-svh">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.94_0.025_190/0.9),transparent_55%)]"
        />

        <div className="relative z-10 flex shrink-0 items-center justify-end gap-1.5 px-5 py-3 sm:px-8 sm:py-4 lg:px-12">
          <nav aria-label="Account" className="flex items-center gap-1.5">
            {isAuthenticated ? (
              <Link
                href="/"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "h-9 rounded-xl bg-[oklch(0.32_0.06_200)] px-4 text-white hover:bg-[oklch(0.28_0.06_200)]",
                )}
              >
                Inbox
              </Link>
            ) : (
              <>
                <Link
                  href={loginHref}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "h-9 rounded-xl px-3 text-[oklch(0.32_0.05_200)]",
                  )}
                >
                  Log in
                </Link>
                <Link
                  href={signupHref}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "h-9 rounded-xl bg-[oklch(0.32_0.06_200)] px-4 text-white hover:bg-[oklch(0.28_0.06_200)]",
                  )}
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-8 lg:px-12 lg:pb-8">
          <div className="auth-rise mb-3 shrink-0 lg:mb-5">
            <h2 className="font-(family-name:--font-auth-display) text-2xl tracking-tight text-[oklch(0.24_0.04_210)] sm:text-3xl">
              Write your message
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isAuthenticated
                ? "Send with your name (they can reply), or stay anonymous."
                : "Text, photos, or both — anonymous unless you log in."}
            </p>
          </div>

          <SendMessageForm
            receiverId={user._id}
            receiverName={user.userName}
            signupHref={signupHref}
            loginHref={loginHref}
            isAuthenticated={isAuthenticated}
            senderName={jwt?.user?.userName}
          />
        </div>
      </section>
    </main>
  );
}

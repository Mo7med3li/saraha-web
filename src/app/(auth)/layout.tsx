import { Fraunces } from "next/font/google";
import Brand from "./_components/brand";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-auth-display",
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className={`${display.variable} relative isolate min-h-svh overflow-hidden bg-[oklch(0.985_0.01_200)] text-foreground lg:grid lg:grid-cols-2`}
    >
      {/* Brand panel */}
      <Brand />

      {/* Form slot — every auth page renders here */}
      <section className="relative flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.92_0.03_180/0.7),transparent_55%)]"
        />
        <div className="auth-rise relative z-10 w-full max-w-md">
          {children}
        </div>
      </section>
    </main>
  );
}

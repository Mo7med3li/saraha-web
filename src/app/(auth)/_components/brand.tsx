import Link from "next/link";

export default function Brand() {
  return (
    <aside className="relative flex min-h-[42svh] flex-col justify-between overflow-hidden px-8 py-10 text-[oklch(0.97_0.01_180)] sm:px-12 lg:min-h-svh lg:px-14 lg:py-12">
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(160deg,oklch(0.28_0.05_200)_0%,oklch(0.18_0.04_220)_48%,oklch(0.14_0.03_240)_100%)]"
      />
      <div
        aria-hidden
        className="auth-blob absolute -left-16 top-10 size-72 rounded-full bg-[oklch(0.72_0.1_175/0.25)] blur-3xl"
      />
      <div
        aria-hidden
        className="auth-blob-delayed absolute -right-10 bottom-8 size-80 rounded-full bg-[oklch(0.55_0.08_210/0.2)] blur-3xl"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,oklch(1_0_0)_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.12]"
      />

      <Link
        href="/"
        className="auth-rise relative z-10 font-(family-name:--font-auth-display) text-3xl tracking-tight text-white sm:text-4xl"
      >
        Saraha
      </Link>

      <div className="auth-rise-delayed relative z-10 max-w-md space-y-3 pb-2 lg:pb-8">
        <p className="font-(family-name:--font-auth-display) text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
          Say what matters.
          <span className="mt-1 block text-[oklch(0.82_0.06_175)]">
            Stay anonymous.
          </span>
        </p>
        <p className="max-w-sm text-sm leading-relaxed text-white/70 sm:text-base">
          Honest messages without the name tag. Sign in to read yours or share
          your link.
        </p>
      </div>
    </aside>
  );
}

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import Link from "next/link";

type SharedUserHeaderProps = {
  user: IUser;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function SharedUserHeader({ user }: SharedUserHeaderProps) {
  const firstName = user.userName?.split(" ")[0] || "them";

  return (
    <aside className="relative flex min-h-[38svh] flex-col justify-between overflow-hidden px-6 py-7 text-white sm:px-10 sm:py-9 lg:min-h-svh lg:px-14 lg:py-12">
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(160deg,oklch(0.28_0.05_200)_0%,oklch(0.18_0.04_220)_48%,oklch(0.14_0.03_240)_100%)]"
      />
      <div
        aria-hidden
        className="auth-blob absolute -left-16 top-8 size-64 rounded-full bg-[oklch(0.72_0.1_175/0.28)] blur-3xl"
      />
      <div
        aria-hidden
        className="auth-blob-delayed absolute -right-12 bottom-6 size-72 rounded-full bg-[oklch(0.55_0.08_210/0.22)] blur-3xl"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,oklch(1_0_0)_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.12]"
      />

      <Link
        href="/"
        className="auth-rise relative z-10 font-(family-name:--font-auth-display) text-2xl tracking-tight text-white sm:text-3xl lg:text-4xl"
      >
        Saraha
      </Link>

      <div className="auth-rise-delayed relative z-10 flex flex-col gap-5 pb-1 lg:gap-8 lg:pb-4">
        <Avatar className="size-16 ring-4 ring-white/20 sm:size-20 lg:size-28">
          <AvatarImage src={user.profileImage?.imageUrl} alt={user.userName} />
          <AvatarFallback className="bg-white/15 text-lg text-white lg:text-2xl">
            {initials(user.userName || "?")}
          </AvatarFallback>
        </Avatar>

        <div className="max-w-md space-y-2 lg:space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/55 sm:text-xs">
            Message for
          </p>
          <h1 className="font-(family-name:--font-auth-display) text-3xl leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {user.userName}
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-white/70 sm:text-base">
            Say what you mean to {firstName} — keep it respectful. Stay
            anonymous, or send with your name if you’re logged in.
          </p>
        </div>
      </div>
    </aside>
  );
}

"use client";

import { useState } from "react";
import { Check, Copy, Link2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

type ShareLinkCardProps = {
  shareUrl: string;
};

export default function ShareLinkCard({ shareUrl }: ShareLinkCardProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  }

  async function nativeShare() {
    if (!navigator.share) {
      await copyLink();
      return;
    }

    try {
      await navigator.share({
        title: "Send me an anonymous message on Saraha",
        text: "Say what matters — stay anonymous.",
        url: shareUrl,
      });
    } catch {
      // user cancelled share sheet
    }
  }

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 shadow-[0_20px_50px_-40px_oklch(0.28_0.05_220)] backdrop-blur-md">
      <div className="bg-[linear-gradient(145deg,oklch(0.28_0.05_200),oklch(0.2_0.04_220))] px-5 py-5 text-white sm:px-6 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 p-2.5 ring-1 ring-white/15">
            <Link2 className="size-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              Your Saraha link
            </h2>
            <p className="text-sm text-white/70">
              Anyone with this link can message you anonymously.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            readOnly
            value={shareUrl}
            className="h-11 rounded-xl bg-[oklch(0.985_0.01_200)] font-mono text-xs sm:text-sm"
            onFocus={(event) => event.currentTarget.select()}
          />
          <Button
            type="button"
            onClick={() => void copyLink()}
            className="h-11 shrink-0 rounded-xl bg-[oklch(0.32_0.06_200)] text-white hover:bg-[oklch(0.28_0.06_200)]"
          >
            {copied ? (
              <>
                <Check className="size-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="size-4" />
                Copy
              </>
            )}
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => void nativeShare()}
          className="h-11 w-full rounded-xl"
        >
          <Share2 className="size-4" />
          Share link
        </Button>
      </div>
    </section>
  );
}

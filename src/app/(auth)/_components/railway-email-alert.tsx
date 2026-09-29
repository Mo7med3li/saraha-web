"use client";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { GoogleIcon } from "@/src/components/icons";
import { Button } from "@/src/components/ui/button";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { TriangleAlertIcon } from "lucide-react";

export default function RailwayEmailAlert() {
  // handlers
  const handleGoogleSignIn = () => {
    try {
      const callbackUrl =
        new URLSearchParams(window.location.search).get("callbackUrl") ||
        "/dashboard";
      void signIn("google", { callbackUrl });
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign in with Google: " + (error as Error).message);
    }
  };
  return (
    <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400">
      <TriangleAlertIcon />
      <AlertTitle className="text-amber-700 dark:text-amber-400">
        Email delivery is currently unavailable
      </AlertTitle>
      <AlertDescription className="mt-1 space-y-2 text-amber-700/80 dark:text-amber-300/80">
        <p>
          Our email service has an issue on Railway — you may not receive the
          confirmation code. Sign up with Google for instant access instead.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500/20"
          onClick={handleGoogleSignIn}
        >
          <GoogleIcon />
          Sign up with Google instead
        </Button>
      </AlertDescription>
    </Alert>
  );
}

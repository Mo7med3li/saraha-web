"use client"; // ✅ Mark this as a Client Component

import {
  DefaultError,
  MutationCache,
  QueryClient,
  QueryClientProvider,
  QueryKey,
} from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "sonner";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidatesQueries?: QueryKey[];
      successMessage?: string;
      errorMessage: string;
      loadingMessage?: string;
      removeLoader?: boolean;
      messageKey?: string;
    };
  }
}

interface Error extends DefaultError {
  response: {
    data: {
      message: string;
    };
  };
}
export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClientRef = useRef<QueryClient | null>(null);

  if (queryClientRef.current == null) {
    queryClientRef.current = new QueryClient({
      mutationCache: new MutationCache({
        onMutate: (_variables, mutation) => {
          if (mutation.meta?.loadingMessage) {
            toast.loading(mutation.meta.loadingMessage, {
              id: mutation.meta.messageKey,
            });
          }
        },
        onSuccess: (_data, _variables, _context, mutation) => {
          const key = mutation.meta?.messageKey;
          toast.dismiss(key);

          if (mutation.meta?.successMessage) {
            toast.success(mutation.meta.successMessage, {
              id: key,
            });
          }
        },
        onError: (_error, _variables, _context, mutation) => {
          const key = mutation.meta?.messageKey;
          toast.dismiss(key);

          if (mutation.meta?.errorMessage) {
            toast.error(
              `${mutation.meta.errorMessage}\n${
                (_error as Error).response?.data?.message
              }`,
              {
                id: key,
                duration: 7000,
              },
            );
          }
        },
        onSettled: (_data, _error, _variables, _context, mutation) => {
          const key = mutation.meta?.messageKey;
          toast.dismiss(key);
          if (mutation?.meta?.invalidatesQueries) {
            mutation.meta.invalidatesQueries.forEach((key) => {
              queryClientRef.current?.invalidateQueries({
                queryKey: [key],
                exact: false,
              });
            });
          }
        },
      }),
      defaultOptions: {
        queries: {
          retry: false,
          retryOnMount: false,
          refetchOnMount: true,
          refetchOnWindowFocus: false,
        },
      },
    });
  }

  return (
    <QueryClientProvider client={queryClientRef.current!}>
      {children}
    </QueryClientProvider>
  );
}

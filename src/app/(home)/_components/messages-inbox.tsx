"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import { ImageIcon, Link2, Loader2, MessageCircleReply } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/src/components/ui/button";
import { useFetchUserMessages } from "../_hooks/use-user-messages";
import MessageDetailModal, {
  canReplyToMessage,
} from "./message-detail-modal";

function formatMessageDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type MessagesInboxProps = {
  userId: string;
};

export default function MessagesInbox({ userId }: MessagesInboxProps) {
  const {
    messages,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useFetchUserMessages(userId);

  const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);

  function openMessage(message: IMessage) {
    setSelectedMessage(message);
    setModalOpen(true);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 rounded-3xl border border-border/40 bg-white/50">
        <Loader2 className="size-8 animate-spin text-[oklch(0.35_0.05_200)]" />
        <p className="text-sm text-muted-foreground">Loading messages…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/5 px-5 text-center"
      >
        <p className="text-sm font-medium text-foreground">
          Could not load your messages. Try again.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "mt-4 h-9 rounded-xl",
          )}
        >
          Retry
        </button>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-[oklch(0.82_0.03_200)] bg-white/50 px-5 text-center">
        <p className="font-(family-name:--font-auth-display) text-2xl text-[oklch(0.28_0.05_200)] sm:text-3xl">
          No messages yet
        </p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Share your link so people can write to you anonymously.
        </p>
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ size: "sm" }),
            "mt-5 h-9 rounded-xl bg-[oklch(0.28_0.05_200)] text-white hover:bg-[oklch(0.24_0.05_200)]",
          )}
        >
          <Link2 className="size-4" />
          Get your link
        </Link>
      </div>
    );
  }

  return (
    <>
      <div
        id="inbox-scroll"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-3xl border border-[oklch(0.28_0.05_200/0.08)] bg-white/55 p-3 shadow-[inset_0_1px_0_oklch(1_0_0/0.6)] backdrop-blur-sm sm:p-5"
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={() => void fetchNextPage()}
          hasMore={Boolean(hasNextPage)}
          scrollableTarget="inbox-scroll"
          loader={
            <div className="flex justify-center py-6">
              <Loader2 className="size-5 animate-spin text-[oklch(0.35_0.05_200)]" />
            </div>
          }
          endMessage={
            <p className="py-6 text-center text-xs text-muted-foreground">
              You’re all caught up
            </p>
          }
        >
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {messages.map((message) => {
              const replyable = canReplyToMessage(message);

              return (
                <li key={message._id}>
                  <button
                    type="button"
                    onClick={() => openMessage(message)}
                    className="flex h-full w-full flex-col rounded-2xl border border-border/40 bg-white/90 px-4 py-4 text-left transition hover:border-[oklch(0.45_0.06_200/0.35)] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.45_0.06_200/0.45)] sm:px-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[oklch(0.42_0.04_200)]">
                        {replyable ? "Can reply" : "Anonymous"}
                      </p>
                      <time
                        dateTime={new Date(message.createdAt).toISOString()}
                        className="shrink-0 text-xs text-muted-foreground"
                      >
                        {formatMessageDate(message.createdAt)}
                      </time>
                    </div>

                    {message.content ? (
                      <p className="mt-3 line-clamp-4 flex-1 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
                        {message.content}
                      </p>
                    ) : (
                      <p className="mt-3 flex-1 text-sm italic text-muted-foreground">
                        Photo message
                      </p>
                    )}

                    {message.attachments?.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.attachments.map((file) => (
                          <span
                            key={file._id || file.asset_id}
                            className="relative block size-14 overflow-hidden rounded-xl bg-muted sm:size-16"
                          >
                            <Image
                              width={100}
                              height={100}
                              src={file.imageUrl}
                              alt=""
                              className="size-full object-cover"
                            />
                            <span className="pointer-events-none absolute inset-0 flex items-center justify-end p-1">
                              <ImageIcon className="size-3.5 text-white drop-shadow" />
                            </span>
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {replyable ? (
                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[oklch(0.35_0.05_200)]">
                        <MessageCircleReply className="size-3.5" />
                        Open to reply
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </InfiniteScroll>
      </div>

      <MessageDetailModal
        key={selectedMessage?._id ?? "closed"}
        message={selectedMessage}
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setSelectedMessage(null);
        }}
      />
    </>
  );
}

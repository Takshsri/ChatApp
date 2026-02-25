"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  Camera,
  CornerDownLeft,
  Paperclip,
  Plus,
  Smile,
  Trash2,
  X,
  Heart,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatChatTimestamp } from "@/lib/date";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { ConversationId, MessageWithSender } from "@/types/chat";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";

type ChatPanelProps = {
  conversationId: ConversationId;
  currentUserId: Id<"users">;
  onBack?: () => void;
  isMobile?: boolean;
};

export function ChatPanel({
  conversationId,
  currentUserId,
  onBack,
  isMobile = false,
}: ChatPanelProps) {
  const conversation = useQuery(api.conversations.getConversation, {
    conversationId,
  });
  const messages = useQuery(api.messages.listMessages, { conversationId });
  const typingUsers = useQuery(api.typing.getTypingUsers, { conversationId });

  const sendMessage = useMutation(api.messages.sendMessage);
  const sendFileMessage = useMutation(api.messages.sendFileMessage);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const markConversationRead = useMutation(api.messages.markConversationRead);
  const setTyping = useMutation(api.typing.setTyping);
  const softDeleteMessage = useMutation(api.messages.softDeleteMessage);
  const toggleReaction = useMutation(api.messages.toggleReaction);

  const [draft, setDraft] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const [failedDraft, setFailedDraft] = useState<string | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const isTypingActiveRef = useRef(false);
  const supportedReactions = [
    "❤️",
    "💕",
    "💖",
    "💗",
    "💘",
    "💝",
    "💞",
    "💓",
    "💟",
    "❣️",
    "♥️",
    "💜",
  ];
  const quickReactions = supportedReactions.slice(0, 4);
  const overflowReactions = supportedReactions.slice(4);
  const [openReactionPickerId, setOpenReactionPickerId] =
    useState<string | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const composerEmojis = [
    "❤️",
    "💕",
    "💖",
    "😍",
    "😘",
    "💋",
    "🌹",
    "💐",
    "✨",
    "💫",
    "🎀",
    "💝",
  ];

  const safeMessages = (messages ?? []) as MessageWithSender[];
  const { containerRef, onScroll, showNewMessagesButton, scrollToBottom } =
    useChatScroll(safeMessages.length);

  useEffect(() => {
    if (!safeMessages.length) {
      return;
    }
    void markConversationRead({ conversationId });
  }, [conversationId, markConversationRead, safeMessages.length]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingActiveRef.current) {
        void setTyping({ conversationId, isTyping: false });
        isTypingActiveRef.current = false;
      }
    };
  }, [conversationId, setTyping]);

  const handleTyping = (value: string) => {
    setDraft(value);

    if (!value.trim()) {
      if (isTypingActiveRef.current) {
        void setTyping({ conversationId, isTyping: false });
        isTypingActiveRef.current = false;
      }
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
      return;
    }

    void setTyping({ conversationId, isTyping: true });
    isTypingActiveRef.current = true;

    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      if (isTypingActiveRef.current) {
        void setTyping({ conversationId, isTyping: false });
        isTypingActiveRef.current = false;
      }
    }, 2000);
  };

  const handleAddEmoji = (emoji: string) => {
    handleTyping(`${draft}${emoji}`);
    setIsEmojiPickerOpen(false);
    textareaRef.current?.focus();
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files?.length) {
      return;
    }
    setPendingFiles((current) => {
      const next = [...current];
      Array.from(files).forEach((file) => {
        if (
          !next.find(
            (existing) =>
              existing.name === file.name && existing.size === file.size,
          )
        ) {
          next.push(file);
        }
      });
      return next;
    });
    textareaRef.current?.focus();
  };

  const stopCameraStream = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = null;
    }
  };

  const closeCameraModal = () => {
    stopCameraStream();
    setIsCameraOpen(false);
    setCameraError(null);
    textareaRef.current?.focus();
  };

  const handleCameraClick = () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      if (!imageInputRef.current) {
        return;
      }

      imageInputRef.current.value = "";
      imageInputRef.current.click();
      return;
    }

    setCameraError(null);

    void navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
        },
        audio: false,
      })
      .then((stream) => {
        stopCameraStream();
        cameraStreamRef.current = stream;
        setIsCameraOpen(true);
      })
      .catch(() => {
        setCameraError("Camera access was denied. Please allow permission and retry.");
      });
  };

  const handleCapturePhoto = async () => {
    const video = cameraVideoRef.current;

    if (!video) {
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) {
      setCameraError("Camera is not ready yet. Try again in a moment.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      setCameraError("Unable to capture photo right now.");
      return;
    }

    context.drawImage(video, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.92);
    });

    if (!blob) {
      setCameraError("Unable to capture photo right now.");
      return;
    }

    const capturedFile = new File([blob], `photo-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    setPendingFiles((current) => [...current, capturedFile]);
    closeCameraModal();
  };

  const removePendingFile = (name: string, size: number) => {
    setPendingFiles((current) =>
      current.filter((file) => file.name !== name || file.size !== size),
    );
  };

  const uploadFile = async (file: File) => {
    const uploadUrl = await generateUploadUrl({});
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });

    if (!response.ok) {
      throw new Error("Upload failed.");
    }

    const payload = (await response.json()) as { storageId: string };
    return payload.storageId as Id<"_storage">;
  };

  const handleSend = async () => {
    if (!draft.trim() && pendingFiles.length === 0) {
      return;
    }

    const body = draft;
    setDraft("");
    setIsUploading(true);

    try {
      if (body.trim()) {
        await sendMessage({ conversationId, body });
      }

      for (const file of pendingFiles) {
        const storageId = await uploadFile(file);
        await sendFileMessage({
          conversationId,
          storageId,
          fileName: file.name,
          fileType: file.type || "application/octet-stream",
          fileSize: file.size,
        });
      }

      if (isTypingActiveRef.current) {
        await setTyping({ conversationId, isTyping: false });
        isTypingActiveRef.current = false;
      }

      setPendingFiles([]);
      setSendError(null);
      setFailedDraft(null);
      scrollToBottom();
    } catch {
      setDraft(body);
      setSendError(
        "Message failed to send. Check your connection and retry.",
      );
      setFailedDraft(body);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const handleComposerEnter = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.shiftKey) {
        return;
      }

      const activeElement = document.activeElement;
      if (
        composerRef.current &&
        activeElement &&
        composerRef.current.contains(activeElement)
      ) {
        event.preventDefault();
        void handleSend();
      }
    };

    window.addEventListener("keydown", handleComposerEnter);
    return () => window.removeEventListener("keydown", handleComposerEnter);
  }, [handleSend]);

  useEffect(() => {
    if (!isCameraOpen || !cameraVideoRef.current || !cameraStreamRef.current) {
      return;
    }

    cameraVideoRef.current.srcObject = cameraStreamRef.current;
    void cameraVideoRef.current.play();
  }, [isCameraOpen]);

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  if (conversation === undefined) {
    return (
      <section className="flex h-full flex-1 flex-col gap-3 p-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-20 w-3/4" />
        <Skeleton className="h-20 w-2/3 self-end" />
        <Skeleton className="h-20 w-3/4" />
      </section>
    );
  }

  if (conversation === null) {
    return (
      <section className="flex h-full flex-1 items-center justify-center p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Conversation is unavailable. Please select another one.
        </p>
      </section>
    );
  }

  const title = conversation.isGroup
    ? conversation.title ?? "Group"
    : conversation.otherMember?.name ?? "Conversation";

  return (
    <section className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100">
      {/* Floating heart particles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-10 -right-10 h-40 w-40 animate-pulse rounded-full bg-gradient-to-r from-rose-200/50 to-pink-200/50 blur-3xl" />
        <div className="absolute top-20 left-10 h-32 w-32 animate-pulse rounded-full bg-gradient-to-r from-pink-200/40 to-purple-200/40 blur-2xl animation-delay-2000" />
        <div className="absolute bottom-20 -left-10 h-36 w-36 animate-bounce rounded-full bg-gradient-to-r from-purple-200/50 to-rose-200/50 blur-3xl" />
        <div className="absolute bottom-32 right-20 h-28 w-28 animate-ping rounded-full bg-gradient-to-r from-rose-300/60 to-pink-300/60 blur-xl" />
      </div>

      <header className="relative z-10 shrink-0 flex items-center gap-2 border-b border-white/30 bg-gradient-to-r from-white/90 via-rose-50/90 to-pink-50/90 p-3 backdrop-blur-xl shadow-sm">
        {isMobile ? (
          <Button
            size="icon"
            variant="ghost"
            onClick={onBack}
            aria-label="Back to conversations"
            className="hover:bg-rose-100/80 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        ) : null}

        <div className="relative">
          <Avatar className="h-9 w-9 ring-2 ring-white/50 shadow-lg">
            <AvatarImage src={conversation.otherMember?.image} alt={title} />
            <AvatarFallback className="bg-gradient-to-br from-rose-400 to-pink-500 text-white font-bold">
              {title.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!conversation.isGroup && conversation.otherMember?.isOnline ? (
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-white/80 bg-gradient-to-r from-rose-400 to-pink-400 shadow-md">
              <Heart className="h-2 w-2 fill-current text-white" />
            </span>
          ) : null}
        </div>

        <div>
          <p className="text-sm font-semibold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            {title}
          </p>
          <p className="text-xs text-rose-500 font-medium">
            {conversation.isGroup
              ? `${conversation.groupOnlineCount}/${conversation.groupMembers.length} online`
              : conversation.otherMember?.isOnline
              ? "💕 Online 💕"
              : "💖 Offline 💖"}
          </p>
        </div>
      </header>

      <div
        ref={containerRef}
        onScroll={onScroll}
        className="relative z-10 flex-1 min-h-0 space-y-3 overflow-y-auto bg-white/70 p-3 lg:p-4 backdrop-blur-xl"
      >
        {messages === undefined ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-2/3 bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl shadow-sm" />
            <Skeleton className="h-16 w-1/2 ml-auto bg-gradient-to-r from-pink-200/50 to-rose-200/50 rounded-2xl shadow-sm" />
            <Skeleton className="h-16 w-3/5 bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl shadow-sm" />
          </div>
        ) : safeMessages.length ? (
          safeMessages.map((message) => {
            const isMine =
              String(message.senderId) === String(currentUserId);
            const senderName = message.sender?.name ?? "User";

            return (
              <article
                key={message._id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-2xl text-sm shadow-lg backdrop-blur-sm border border-white/50 transition-all duration-200 hover:shadow-xl ${
                    isMine
                      ? [
                          "max-w-[60%] lg:max-w-[40%]",
                          "rounded-br-md",
                          "bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white shadow-rose-500/25",
                          "px-4 py-2.5",
                          "ring-1 ring-rose-400/30",
                        ].join(" ")
                      : [
                          "max-w-[70%] lg:max-w-[55%]",
                          "rounded-bl-md",
                          "bg-white/80 backdrop-blur-sm text-slate-900 border-white/50",
                          "px-4 py-2.5",
                          "shadow-lg",
                        ].join(" ")
                  }`}
                >
                  {!isMine ? (
                    <p className="mb-2 text-xs font-semibold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                      {senderName}
                    </p>
                  ) : null}
                  {message.deletedAt ? (
                    <p className="italic opacity-70 text-rose-400">💔 Message deleted</p>
                  ) : (
                    <>
                      {message.fileUrl ? (
                        message.fileType?.startsWith("image/") ? (
                          <img
                            src={message.fileUrl}
                            alt={message.fileName ?? "Attachment"}
                            className="mb-3 max-h-64 rounded-2xl border-2 border-white/50 object-cover shadow-2xl ring-1 ring-rose-200/50"
                          />
                        ) : (
                          <a
                            href={message.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mb-3 inline-flex items-center gap-2 rounded-xl border-2 border-rose-200/50 bg-gradient-to-r from-rose-50 to-pink-50 px-3 py-2 text-sm font-medium text-rose-700 shadow-sm hover:shadow-md transition-all"
                          >
                            💝 {message.fileName ?? "Attachment"}
                          </a>
                        )
                      ) : null}

                      {message.body ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{message.body}</p>
                      ) : null}
                    </>
                  )}
                  <div className="mt-2 flex items-center justify-end gap-2 pt-2 border-t border-white/30">
                    <span className="text-[10px] opacity-80 font-medium text-rose-500">
                      {formatChatTimestamp(message.createdAt)}
                    </span>
                    {isMine && !message.deletedAt ? (
                      <button
                        type="button"
                        onClick={() =>
                          void softDeleteMessage({ messageId: message._id })
                        }
                        className="rounded-lg p-1 opacity-70 transition-all hover:bg-white/50 hover:opacity-100 hover:scale-105"
                        aria-label="Delete message"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>

                  {!message.deletedAt ? (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2">
                      {quickReactions.map((emoji) => (
                        <button
                          key={`${message._id}-${emoji}-picker`}
                          type="button"
                          onClick={() =>
                            void toggleReaction({
                              messageId: message._id,
                              emoji,
                            })
                          }
                          className="group relative rounded-full border-2 border-white/50 px-2 py-1.5 text-lg font-bold transition-all hover:scale-110 hover:bg-gradient-to-r hover:from-rose-400/20 hover:to-pink-400/20 hover:shadow-lg"
                          aria-label={`React with ${emoji}`}
                        >
                          {emoji}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-400/30 to-pink-400/30 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200" />
                        </button>
                      ))}

                      {overflowReactions.length ? (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenReactionPickerId((current) =>
                                current === message._id ? null : message._id,
                              )
                            }
                            className="group rounded-full border-2 border-white/50 px-3 py-1.5 text-lg font-bold transition-all hover:scale-110 hover:bg-gradient-to-r hover:from-rose-400/20 hover:to-pink-400/20 hover:shadow-lg"
                            aria-label="More reactions"
                          >
                            <Plus className="h-4 w-4" />
                          </button>

                          {openReactionPickerId === message._id ? (
                            <div className="absolute right-0 z-20 mt-2 grid w-36 grid-cols-3 gap-2 rounded-2xl border border-white/50 bg-white/95 p-3 shadow-2xl backdrop-blur-xl">
                              {overflowReactions.map((emoji) => (
                                <button
                                  key={`${message._id}-${emoji}-overflow`}
                                  type="button"
                                  onClick={() => {
                                    void toggleReaction({
                                      messageId: message._id,
                                      emoji,
                                    });
                                    setOpenReactionPickerId(null);
                                  }}
                                  className="group relative rounded-xl border-2 border-rose-200/50 px-2 py-2 text-lg font-bold transition-all hover:scale-110 hover:bg-gradient-to-r hover:from-rose-400/30 hover:to-pink-400/30 hover:shadow-lg hover:shadow-rose-500/25"
                                  aria-label={`React with ${emoji}`}
                                >
                                  {emoji}
                                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-400/50 to-pink-400/50 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200" />
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ) : null}

                      {message.reactions?.map((reaction) => (
                        <button
                          key={`${message._id}-${reaction.emoji}-count`}
                          type="button"
                          onClick={() =>
                            void toggleReaction({
                              messageId: message._id,
                              emoji: reaction.emoji,
                            })
                          }
                          className={`relative rounded-full border-2 px-3 py-1.5 text-lg font-bold transition-all ${
                            reaction.reactedByMe
                              ? "border-rose-400/50 bg-gradient-to-r from-rose-400/20 to-pink-400/20 shadow-lg shadow-rose-500/25 scale-105"
                              : "border-white/50 bg-white/60 backdrop-blur-sm hover:bg-gradient-to-r hover:from-rose-400/10 hover:to-pink-400/10"
                          } hover:scale-110 hover:shadow-lg`}
                          aria-label={`Toggle ${reaction.emoji} reaction`}
                        >
                          {reaction.emoji} {reaction.count}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })
        ) : (
          <div className="flex h-full items-center justify-center rounded-3xl border-2 border-rose-200/50 bg-gradient-to-br from-rose-50/80 to-pink-50/80 p-12 text-center backdrop-blur-xl shadow-2xl">
            <div>
              <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 p-4 shadow-xl">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <p className="text-lg font-semibold text-rose-600 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text">
                No messages yet. Say hello with love 💕
              </p>
            </div>
          </div>
        )}
      </div>

      {showNewMessagesButton ? (
        <div className="pointer-events-none absolute bottom-28 left-0 right-0 flex justify-center">
          <Button
            className="pointer-events-auto shadow-2xl ring-2 ring-rose-200/50 bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600"
            size="sm"
            onClick={() => scrollToBottom()}
          >
            💝 New messages
          </Button>
        </div>
      ) : null}

      <footer className="relative z-10 shrink-0 border-t border-white/30 bg-gradient-to-r from-white/95 via-rose-50/95 to-pink-50/95 p-4 backdrop-blur-2xl shadow-2xl">
        {sendError ? (
          <div className="mb-3 flex items-center justify-between rounded-2xl border-2 border-rose-300/50 bg-gradient-to-r from-rose-100/80 to-pink-100/80 px-4 py-3 text-sm shadow-lg backdrop-blur-xl">
            <span className="font-medium text-rose-600">💔 {sendError}</span>
            {failedDraft ? (
              <Button
                size="sm"
                variant="ghost"
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg"
                onClick={() => {
                  setDraft(failedDraft);
                  setSendError(null);
                }}
              >
                Retry 💕
              </Button>
            ) : null}
          </div>
        ) : null}

        <div className="mb-3 h-5">
          {typingUsers?.length ? (
            <p className="flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              <span>
                {typingUsers.length > 1
                  ? `${typingUsers[0]} and ${typingUsers.length - 1} others`
                  : typingUsers[0]}
              </span>
              <span>💭 typing</span>
              <span className="inline-flex gap-0.5" aria-hidden>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gradient-to-r from-rose-400 to-pink-400 [animation-delay:-0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gradient-to-r from-rose-400 to-pink-400 [animation-delay:-0.1s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gradient-to-r from-rose-400 to-pink-400" />
              </span>
            </p>
          ) : null}
        </div>

        {pendingFiles.length ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {pendingFiles.map((file) => (
              <div
                key={`${file.name}-${file.size}`}
                className="flex items-center gap-2 rounded-2xl border-2 border-rose-200/50 bg-gradient-to-r from-rose-50 to-pink-50 px-3 py-2 text-sm font-medium shadow-md backdrop-blur-sm"
              >
                <span className="max-w-40 truncate text-rose-700">💝 {file.name}</span>
                <button
                  type="button"
                  className="group rounded-xl p-1.5 text-rose-500 transition-all hover:bg-white/50 hover:scale-110 hover:shadow-md"
                  onClick={() => removePendingFile(file.name, file.size)}
                  aria-label="Remove attachment"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <div
          ref={composerRef}
          className="flex items-end gap-2 rounded-3xl border-2 border-white/50 bg-white/80 p-3 shadow-2xl backdrop-blur-xl ring-1 ring-rose-200/50"
        >
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsEmojiPickerOpen((value) => !value)}
              className="group rounded-2xl p-2.5 text-rose-500 transition-all hover:bg-gradient-to-r hover:from-rose-500/10 hover:to-pink-500/10 hover:shadow-md hover:scale-105 backdrop-blur-sm"
              aria-label="Open emoji picker"
            >
              <Smile className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group rounded-2xl p-2.5 text-rose-500 transition-all hover:bg-gradient-to-r hover:from-rose-500/10 hover:to-pink-500/10 hover:shadow-md hover:scale-105 backdrop-blur-sm"
              aria-label="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={handleCameraClick}
              className="group rounded-2xl p-2.5 text-rose-500 transition-all hover:bg-gradient-to-r hover:from-rose-500/10 hover:to-pink-500/10 hover:shadow-md hover:scale-105 backdrop-blur-sm"
              aria-label="Attach photo"
            >
              <Camera className="h-5 w-5" />
            </button>
          </div>

          <Textarea
            ref={textareaRef}
            value={draft}
            onChange={(event) => handleTyping(event.target.value)}
            placeholder="💕 Type a loving message..."
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void handleSend();
              }
            }}
            disabled={isUploading}
            className="max-h-36 min-h-12 resize-none border-0 bg-transparent/50 shadow-none focus-visible:ring-2 focus-visible:ring-rose-400/50 placeholder:text-rose-400 font-medium"
          />
          <Button
            onClick={() => void handleSend()}
            aria-label="Send message"
            className="h-12 rounded-3xl px-4 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 hover:from-rose-600 hover:via-pink-600 hover:to-purple-600 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 text-white font-bold ring-2 ring-rose-400/50"
            disabled={isUploading}
          >
            <CornerDownLeft className="h-5 w-5" />
          </Button>
        </div>

        {isEmojiPickerOpen ? (
          <div className="mt-3 flex flex-wrap gap-2 rounded-3xl border-2 border-white/50 bg-white/95 p-3 shadow-2xl backdrop-blur-xl">
            {composerEmojis.map((emoji) => (
              <button
                key={`composer-${emoji}`}
                type="button"
                onClick={() => handleAddEmoji(emoji)}
                className="group relative rounded-2xl border-2 border-rose-200/50 px-3 py-2 text-2xl font-black transition-all hover:scale-110 hover:bg-gradient-to-r hover:from-rose-400/20 hover:to-pink-400/20 hover:shadow-xl hover:shadow-rose-500/25 backdrop-blur-sm"
                aria-label={`Insert ${emoji}`}
              >
                {emoji}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-400/30 to-pink-400/30 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200" />
              </button>
            ))}
          </div>
        ) : null}

        {isCameraOpen ? (
          <div className="mt-3 mx-auto w-full max-w-md rounded-3xl border-2 border-white/50 bg-gradient-to-br from-white/95 to-rose-50/90 p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                📸 Camera preview
              </p>
              <button
                type="button"
                onClick={closeCameraModal}
                className="group rounded-2xl p-2 text-rose-500 transition-all hover:bg-white/50 hover:scale-110 hover:shadow-md"
                aria-label="Close camera"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <video
              ref={cameraVideoRef}
              autoPlay
              playsInline
              muted
              className="aspect-[4/3] w-full rounded-3xl border-4 border-rose-200/50 bg-gradient-to-br from-rose-500/10 to-pink-500/10 object-contain shadow-2xl ring-2 ring-white/50"
            />

            <div className="mt-4 flex gap-3">
              <Button
                type="button"
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-xl hover:shadow-2xl font-bold text-white"
                onClick={() => void handleCapturePhoto()}
              >
                💝 Capture photo
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-2 border-rose-300/50 bg-white/80 hover:bg-white font-bold text-rose-600 shadow-lg"
                onClick={closeCameraModal}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : null}

        {cameraError ? (
          <div className="mt-3 rounded-2xl border-2 border-rose-300/50 bg-gradient-to-r from-rose-100/80 to-pink-100/80 px-4 py-3 text-sm font-medium text-rose-600 shadow-lg backdrop-blur-xl">
            💔 {cameraError}
          </div>
        ) : null}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          aria-label="Attach files"
          onChange={(event) => handleFilesSelected(event.target.files)}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          aria-label="Attach photo"
          onChange={(event) => handleFilesSelected(event.target.files)}
        />
      </footer>
    </section>
  );
}

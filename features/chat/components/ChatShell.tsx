"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Heart, HeartHandshake, Sparkles } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { usePresence } from "@/hooks/use-presence";
import { ConversationSidebar } from "@/features/chat/components/ConversationSidebar";
import { ChatPanel } from "@/features/chat/components/ChatPanel";
import { ConversationId, ConversationListItem, User } from "@/types/chat";

export function ChatShell() {
  const authState = useQuery(api.users.getAuthState);

  if (authState === undefined) {
    return (
      <div className="relative min-h-dvh overflow-y-auto bg-gradient-to-br from-rose-50/95 via-pink-50/95 to-purple-100/95 lg:h-dvh lg:overflow-hidden">
        {/* Romantic floating hearts background */}
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-gradient-to-r from-rose-400/40 to-pink-400/40 blur-3xl animate-pulse" />
          <div className="absolute top-1/2 right-20 h-72 w-72 rounded-full bg-gradient-to-r from-pink-400/30 to-purple-400/30 blur-3xl animate-bounce" style={{animationDelay: '2s'}} />
          <div className="absolute bottom-32 left-1/4 h-56 w-56 rounded-full bg-gradient-to-r from-purple-400/40 to-rose-400/40 blur-2xl animate-ping" />
        </div>
        
        <div className="grid h-full grid-cols-1 overflow-hidden lg:grid-cols-[360px_1fr] relative z-10">
          <div className="space-y-4 border-r p-6 bg-white/60 backdrop-blur-xl">
            <Skeleton className="h-16 w-full rounded-3xl" />
            <Skeleton className="h-28 w-full rounded-3xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
          <div className="hidden p-6 lg:block bg-white/40 backdrop-blur-xl">
            <Skeleton className="h-full w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <main className="relative flex min-h-dvh items-center justify-center p-8 bg-gradient-to-br from-rose-50/95 via-pink-50/95 to-purple-100/95 lg:h-dvh lg:overflow-hidden">
        {/* Love theme background hearts */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-gradient-to-r from-rose-400/30 to-pink-400/30 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-gradient-to-r from-pink-400/30 to-purple-400/30 blur-3xl animate-bounce" />
        </div>
        
        <div className="relative z-10 w-full max-w-md rounded-3xl border-4 border-rose-200/50 bg-white/90 p-8 shadow-2xl shadow-rose-300/40 backdrop-blur-2xl">
          <div className="mx-auto mb-6 h-20 w-20 rounded-3xl bg-gradient-to-br from-rose-500/30 to-pink-500/30 flex items-center justify-center shadow-2xl border-4 border-white/60">
            <Heart className="h-12 w-12 text-rose-500 drop-shadow-2xl animate-pulse" />
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent text-center drop-shadow-lg mb-4">
            💖 Connect Your Love Profile
          </h1>
          <p className="mb-6 text-lg text-rose-600 text-center leading-relaxed">
            Clerk login is active, but we need to connect it to your romantic chat world 💕
          </p>
          <div className="space-y-3 text-sm text-rose-700">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-gradient-to-r from-rose-100/80 to-pink-100/80 border-l-4 border-rose-400">
              <span className="font-bold text-rose-500 mt-0.5">1.</span>
              <span>Create a Clerk JWT template named "convex"</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-gradient-to-r from-pink-100/80 to-purple-100/80 border-l-4 border-pink-400">
              <span className="font-bold text-pink-500 mt-0.5">2.</span>
              <span>Set issuer to your Clerk domain (.env.local)</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-gradient-to-r from-purple-100/80 to-rose-100/80 border-l-4 border-purple-400">
              <span className="font-bold text-purple-500 mt-0.5">3.</span>
              <span>Restart Next.js & Convex dev servers</span>
            </div>
          </div>
          <Button className="mt-8 w-full h-14 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 hover:from-rose-600 hover:via-pink-600 hover:to-purple-600 text-white font-black text-lg shadow-2xl hover:shadow-rose-500/50 transition-all duration-300">
            💝 Open Clerk Dashboard
          </Button>
        </div>
      </main>
    );
  }

  if (!authState.hasProfile) {
    return (
      <main className="relative flex min-h-dvh items-center justify-center p-8 bg-gradient-to-br from-rose-50/95 via-pink-50/95 to-purple-100/95 lg:h-dvh lg:overflow-hidden">
        <div className="relative z-10 w-full max-w-lg rounded-3xl border-4 border-rose-200/50 bg-white/90 p-10 shadow-2xl shadow-rose-300/40 backdrop-blur-2xl text-center">
          <div className="mx-auto mb-8 h-24 w-24 rounded-3xl bg-gradient-to-br from-rose-500/40 via-pink-500/40 to-purple-500/40 flex items-center justify-center shadow-2xl border-4 border-white/60 animate-pulse">
            <HeartHandshake className="h-16 w-16 text-rose-500 drop-shadow-2xl" />
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl mb-4">
            💕 Setting Up Your Love Profile
          </h1>
          <p className="text-xl text-rose-600 font-semibold leading-relaxed mb-8 max-w-md mx-auto">
            ✨ Syncing your romantic profile... just a few seconds! 💖
          </p>
          <div className="flex items-center justify-center gap-3 text-rose-500">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-400 animate-spin border-4 border-white/30 border-t-rose-500 shadow-xl" />
            <span className="text-lg font-bold">Creating your love space...</span>
          </div>
        </div>
      </main>
    );
  }

  return <AuthenticatedChatShell />;
}

function AuthenticatedChatShell() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const [search, setSearch] = useState("");
  const searchedUsers = useQuery(api.users.searchUsers, { search });
  const conversations = useQuery(api.conversations.listConversations);
  const startOrCreateDirectConversation = useMutation(
    api.conversations.startOrCreateDirectConversation,
  );
  const createGroupConversation = useMutation(api.conversations.createGroupConversation);

  const [activeConversationId, setActiveConversationId] = useState<ConversationId | null>(null);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const isMobile = useMobile();

  usePresence(Boolean(currentUser));

  const typedConversations = useMemo(
    () => ((conversations ?? []) as ConversationListItem[]),
    [conversations],
  );

  // ... [keep all your existing search/filter logic unchanged] ...
  const normalizeText = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]/g, "");

  const isSubsequence = (needle: string, haystack: string) => {
    if (!needle) return true;
    let index = 0;
    for (const char of haystack) {
      if (char === needle[index]) {
        index += 1;
      }
      if (index === needle.length) {
        return true;
      }
    }
    return false;
  };

  const matchesSearch = (needle: string, haystack: string) => {
    const normalizedNeedle = normalizeText(needle);
    const normalizedHaystack = normalizeText(haystack);
    return (
      normalizedHaystack.includes(normalizedNeedle) ||
      isSubsequence(normalizedNeedle, normalizedHaystack)
    );
  };

  const filteredConversations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) {
      return typedConversations;
    }

    return typedConversations.filter((conversation) => {
      const title = conversation.isGroup
        ? (conversation.title ?? "group")
        : (conversation.otherMember?.name ?? "conversation");

      const preview = conversation.lastMessage?.body ?? "";

      if (matchesSearch(normalizedSearch, title) || matchesSearch(normalizedSearch, preview)) {
        return true;
      }

      if (!conversation.isGroup) {
        const otherMember = conversation.otherMember;
        if (!otherMember) {
          return false;
        }

        return (
          matchesSearch(normalizedSearch, otherMember.name) ||
          matchesSearch(normalizedSearch, otherMember.email)
        );
      }

      return conversation.groupMembers.some((member) =>
        matchesSearch(normalizedSearch, `${member.name} ${member.email}`),
      );
    });
  }, [typedConversations, search]);

  const selectedConversationId =
    activeConversationId ?? typedConversations[0]?._id ?? null;

  if (!currentUser) {
    return (
      <div className="relative min-h-dvh overflow-y-auto bg-gradient-to-br from-rose-50/95 via-pink-50/95 to-purple-100/95 lg:h-dvh lg:overflow-hidden">
        <div className="grid min-h-full grid-cols-1 lg:overflow-hidden lg:grid-cols-[360px_1fr] lg:h-full relative z-10 p-6 lg:p-6">
          <div className="space-y-4 border-r bg-white/60 backdrop-blur-xl rounded-3xl p-6">
            <Skeleton className="h-16 w-full rounded-3xl" />
            <Skeleton className="h-28 w-full rounded-3xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
          <div className="hidden lg:block bg-white/40 backdrop-blur-xl rounded-3xl p-6">
            <Skeleton className="h-full w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  const showSidebar = !isMobile || !isMobileChatOpen;
  const showChatPanel = !isMobile || isMobileChatOpen;

  const handleStartConversation = async (userId: User["_id"]) => {
    try {
      setActionError(null);
      const conversationId = await startOrCreateDirectConversation({
        otherUserId: userId,
      });

      setActiveConversationId(conversationId);
      if (isMobile) {
        setIsMobileChatOpen(true);
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to open love chat 💔");
    }
  };

  const handleSelectConversation = (conversationId: ConversationId) => {
    setActiveConversationId(conversationId);
    if (isMobile) {
      setIsMobileChatOpen(true);
    }
  };

  const handleCreateGroupConversation = async (
    title: string,
    memberIds: User["_id"][],
  ) => {
    try {
      setActionError(null);
      const conversationId = await createGroupConversation({ title, memberIds });
      setActiveConversationId(conversationId);
      if (isMobile) {
        setIsMobileChatOpen(true);
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to create love group 💔");
    }
  };

  return (
    <div className="relative w-full min-h-dvh overflow-y-auto lg:h-dvh lg:overflow-hidden lg:min-h-0 bg-gradient-to-br from-rose-50/98 via-pink-50/98 to-purple-100/98">
      {/* 🌟 Full page romantic floating hearts & sparkles */}
      <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none">
        <div className="absolute top-10 left-10 h-48 w-48 rounded-full bg-gradient-to-r from-rose-400/50 to-pink-400/50 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-10 h-56 w-56 rounded-full bg-gradient-to-r from-pink-400/40 to-purple-400/40 blur-3xl animate-bounce" style={{animationDelay: '1.5s'}} />
        <div className="absolute bottom-32 left-20 h-40 w-40 rounded-full bg-gradient-to-r from-purple-400/50 to-rose-400/50 blur-2xl animate-ping" />
        <div className="absolute bottom-20 right-20 h-32 w-32 rounded-full bg-gradient-to-r from-rose-500/60 to-pink-500/60 blur-xl animate-pulse" style={{animationDelay: '3s'}} />
        <div className="absolute top-1/4 left-1/2 h-24 w-24 rounded-full bg-gradient-to-r from-rose-500/80 to-pink-500/80 blur-lg animate-twinkle" />
        <div className="absolute bottom-1/3 right-1/3 h-20 w-20 rounded-full bg-gradient-to-r from-pink-500/70 to-purple-500/70 blur-lg animate-twinkle" style={{animationDelay: '2s'}} />
      </div>

      {/* 💖 Main Love Chat Layout */}
      <div className="relative z-10 flex flex-col w-full lg:grid lg:grid-cols-[minmax(360px,400px)_1fr] lg:h-full lg:overflow-hidden">
        
        {/* 💕 Love Sidebar */}
        {showSidebar ? (
          <ConversationSidebar
            currentUser={currentUser as User}
            conversations={filteredConversations}
            searchedUsers={(searchedUsers ?? []) as User[]}
            search={search}
            actionError={actionError}
            activeConversationId={selectedConversationId}
            onSearchChange={setSearch}
            onUserSelect={handleStartConversation}
            onCreateGroup={handleCreateGroupConversation}
            onConversationSelect={handleSelectConversation}
          />
        ) : null}

        {/* 💌 Love Chat Panel */}
        {showChatPanel ? (
          selectedConversationId ? (
            <ChatPanel
              conversationId={selectedConversationId}
              currentUserId={(currentUser as User)._id}
              isMobile={isMobile}
              onBack={() => setIsMobileChatOpen(false)}
            />
          ) : (
            <section className="relative h-full min-h-0 items-center justify-center p-12 text-center lg:flex bg-gradient-to-br from-white/70 via-rose-50/70 to-pink-50/70 backdrop-blur-xl">
              <div className="max-w-2xl mx-auto">
                <div className="mx-auto mb-12 h-32 w-32 rounded-3xl bg-gradient-to-br from-rose-500/30 via-pink-500/30 to-purple-500/30 p-8 shadow-2xl shadow-rose-500/40 border-4 border-white/60 backdrop-blur-xl flex items-center justify-center">
                  <HeartHandshake className="h-20 w-20 text-rose-500 drop-shadow-2xl animate-pulse" />
                </div>
                <h1 className="text-4xl font-black mb-6 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl leading-tight">
                  💝 Welcome to Love Chat
                </h1>
                <p className="text-2xl font-semibold mb-8 text-rose-600 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                  ✨ Find your special someone from the sidebar or search for your love connection above 💕
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Sparkles className="h-12 w-12 text-pink-500 animate-spin drop-shadow-xl" />
                  <div className="text-left">
                    <p className="text-lg font-bold text-rose-600 mb-1">💖 Start Chatting Now:</p>
                    <p className="text-sm text-rose-500">• Search for love connections ✨</p>
                    <p className="text-sm text-rose-500">• Create romantic group chats 💕</p>
                    <p className="text-sm text-rose-500">• Send love messages instantly ❤️</p>
                  </div>
                </div>
              </div>
            </section>
          )
        ) : null}
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.4;
            transform: scale(0.8) rotate(0deg);
          }
          50% { 
            opacity: 1;
            transform: scale(1.4) rotate(180deg);
          }
        }
        .animate-twinkle {
          animation: twinkle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

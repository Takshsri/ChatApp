"use client";

import { UserButton } from "@clerk/nextjs";
import { HeartHandshake, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatChatTimestamp } from "@/lib/date";
import { ConversationId, ConversationListItem, User } from "@/types/chat";
import { UserSearchList } from "@/features/users/components/UserSearchList";

type ConversationSidebarProps = {
  currentUser: User;
  conversations: ConversationListItem[];
  searchedUsers: User[];
  search: string;
  actionError: string | null;
  activeConversationId: ConversationId | null;
  onSearchChange: (value: string) => void;
  onUserSelect: (userId: User["_id"]) => void;
  onCreateGroup: (title: string, memberIds: User["_id"][]) => Promise<void>;
  onConversationSelect: (conversationId: ConversationId) => void;
};

export function ConversationSidebar({
  currentUser,
  conversations,
  searchedUsers,
  search,
  actionError,
  activeConversationId,
  onSearchChange,
  onUserSelect,
  onCreateGroup,
  onConversationSelect,
}: ConversationSidebarProps) {
  return (
    <aside className="group relative flex h-full w-full flex-col border-r bg-gradient-to-br from-rose-50/95 via-pink-50/95 to-purple-100/95 lg:w-90 shadow-2xl shadow-rose-200/60 backdrop-blur-xl overflow-hidden">
      
      {/* ✨ Romantic Floating Hearts */}
      <div className="absolute inset-0 opacity-25 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-gradient-to-r from-rose-400/60 to-pink-400/60 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-10 h-28 w-28 rounded-full bg-gradient-to-r from-pink-400/50 to-purple-400/50 blur-2xl animate-bounce" style={{animationDelay: '1.5s'}} />
        <div className="absolute bottom-32 left-20 h-24 w-24 rounded-full bg-gradient-to-r from-purple-400/60 to-rose-400/60 blur-xl animate-ping" />
        <div className="absolute bottom-20 right-20 h-20 w-20 rounded-full bg-gradient-to-r from-rose-500/70 to-pink-500/70 blur-lg animate-pulse" style={{animationDelay: '3s'}} />
      </div>

      {/* ================= HEADER ================= */}
      <header className="relative z-20 flex items-center justify-between border-b border-rose-200/50 bg-gradient-to-r from-white/95 via-rose-50/95 to-pink-50/95 px-5 py-5 backdrop-blur-2xl shadow-lg shadow-rose-200/40">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-14 w-14 ring-4 ring-white/70 shadow-2xl border-4 border-rose-200/50">
              <AvatarImage src={currentUser.image} alt={currentUser.name} />
              <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white font-black text-xl border-4 border-white/90 shadow-2xl">
                {currentUser.name.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {currentUser.isOnline && (
              <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full border-4 border-white/90 bg-gradient-to-r from-rose-500 to-pink-500 shadow-xl animate-pulse flex items-center justify-center">
                <Heart className="h-3 w-3 fill-current text-white drop-shadow-lg" />
              </div>
            )}
          </div>

          <div>
            <p className="text-lg font-black bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
              {currentUser.name}
            </p>
            <p className="text-sm font-semibold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              {currentUser.isOnline ? "💖 Online Now" : "💕 Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">


  
  {/* 🔥 USERBUTTON = LOGOUT BUTTON */}
<UserButton 
  appearance={{
    elements: {
      // ✨ NO BLACK SHADOW - Clean glow only
      userButtonBox: "rounded-3xl bg-gradient-to-r from-rose-50/95 via-pink-500/95 to-purple-500/95 border-3 border-rose-400/60 p-3 hover:scale-110 hover:from-rose-600/95 hover:via-pink-600/95 hover:to-purple-600/95 transition-all duration-400 backdrop-blur-xl ring-4 ring-rose-400/40 hover:ring-rose-500/50",
      
      // ✨ Fixed typo + clean text
      userButtonText: "font text-white text-lg drop-shadow-sm", 
      
      // ✨ Clean glassmorphism dropdown
      userButtonPopoverCard: "bg-gradient-to-br from-rose-50/8 via-pink-50/98 to-purple-50/98 backdrop-blur-2xl shadow-lg shadow-rose-200/30 border-2 border-rose-200/40 rounded-2xl",
      
      // ✨ Love theme buttons
      userButtonPopoverButton: "hover:bg-gradient-to-r hover:from-rose-500/20 hover:to-pink-500/20 rounded-2xl font-bold text-rose-700 hover:text-rose-800 hover:shadow-md hover:shadow-rose-400/30 transition-all duration-300 backdrop-blur-sm"
    }
  }}
/>

</div>

      </header>

      {/* ================= SEARCH (LOVE THEMED) ================= */}
      <UserSearchList
        search={search}
        users={searchedUsers}
        onSearchChange={onSearchChange}
        onUserSelect={onUserSelect}
        onCreateGroup={onCreateGroup}
      />

      {actionError && (
        <div className="mx-5 mt-4 mb-3 rounded-3xl border-2 border-rose-400/60 bg-gradient-to-r from-rose-100/95 to-pink-100/95 px-5 py-4 text-sm font-semibold text-rose-600 shadow-xl shadow-rose-300/40 backdrop-blur-xl animate-pulse">
          💔 {actionError}
        </div>
      )}

      {/* ================= SCROLLABLE AREA ================= */}
      <div className="flex-1 min-h-0 flex flex-col relative z-10">
        <div className="flex-1 overflow-y-auto px-5 pb-8 pt-4 space-y-4 scrollbar-thin scrollbar-thumb-rose-400/60 scrollbar-track-rose-50/50">
          
          {/* Love Conversations Header */}
          <p className=" top-0 z-20 mb-5 px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-purple-500/20 text-lg font-black text bg-clip-text backdrop-blur-xl border border-rose-300/50 shadow-lg shadow-rose-200/30">
            💝 Love Conversations
          </p>

          {conversations.length ? (
            <ul className="space-y-4">
              {conversations.map((conversation) => {
                const isActive = activeConversationId === conversation._id;
                const title = conversation.isGroup
                  ? conversation.title ?? "💕 Love Group"
                  : conversation.otherMember?.name ?? "💖 Sweetheart";

                const preview = conversation.lastMessage
                  ? conversation.lastMessage.body?.length > 25
                    ? conversation.lastMessage.body.slice(0, 25) + "... 💕"
                    : conversation.lastMessage.body + " 💕"
                  : "💝 No love messages yet";

                return (
                  <li key={conversation._id}>
                    <Button
                      variant="ghost"
                      className={`relative w-full justify-start gap-4 rounded-2xl px-6 py-6 transition-all duration-500 group hover:shadow-2xl hover:shadow-rose-400/50 backdrop-blur-xl border-2 ${
                        isActive
                          ? "border-rose-500/70 bg-gradient-to-r from-rose-500/25 via-pink-500/20 to-purple-500/25 shadow-2xl shadow-rose-500/50 ring-4 ring-rose-400/50 scale-[1.02] animate-pulse"
                          : "border-rose-200/50 hover:border-rose-400/70 hover:bg-gradient-to-r hover:from-rose-50/90 hover:to-pink-50/90 hover:scale-[1.01]"
                      }`}
                      onClick={() => onConversationSelect(conversation._id)}
                    >
                      {/* Active glow effect */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-500/40 to-pink-500/40 blur-xl animate-ping opacity-80 -z-10" />
                      )}

                      {/* Avatar with love theme */}
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-12 w-12 ring-2 ring-white/80 shadow-2xl border-4 border-rose-200/50">
                          <AvatarImage
                            src={conversation.otherMember?.image}
                            alt={title}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white font-black text-xl border-4 border-white/90 shadow-xl">
                            {title.slice(0, 1).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {/* Online heart indicator */}
                        {!conversation.isGroup && conversation.otherMember?.isOnline && (
                          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-white/90 bg-gradient-to-r from-rose-500 to-pink-500 shadow-xl animate-pulse flex items-center justify-center">
                            <Heart className="h-3 w-3 fill-current text-white drop-shadow-lg" />
                          </div>
                        )}
                      </div>

                      {/* Conversation details */}
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex justify-between items-start gap-3 mb-1">
                          <p className={`font-black text-lg leading-tight truncate ${
                            isActive
                              ? "bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg"
                              : "text-slate-900 group-hover:text-rose-700 group-hover:drop-shadow-sm"
                          }`}>
                            {title}
                          </p>
                          {conversation.lastMessage && (
                            <span className={`text-sm font-semibold whitespace-nowrap ${
                              isActive
                                ? "bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm"
                                : "text-rose-500 group-hover:text-rose-600"
                            }`}>
                              {formatChatTimestamp(conversation.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>

                        <p className={`text-base leading-tight truncate ${
                          isActive
                            ? "font-semibold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm"
                            : "text-rose-500 group-hover:text-rose-600"
                        }`}>
                          {preview}
                        </p>
                      </div>

                      {/* Love badge for unread */}
                      {conversation.unreadCount > 0 && (
                        <Badge className={`min-w-12 justify-center rounded-2xl px-4 py-2.5 font-black text-lg shadow-2xl transition-all duration-300 hover:scale-110 ${
                          isActive
                            ? "bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white shadow-rose-600/50"
                            : "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/40"
                        }`}>
                          {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-12 text-center backdrop-blur-xl rounded-3xl border-4 border-rose-300/70 bg-gradient-to-br from-rose-50/95 via-pink-50/95 to-purple-100/95 shadow-2xl shadow-rose-300/60">
              <div className="mb-8 p-8 rounded-3xl bg-gradient-to-br from-rose-500/30 via-pink-500/30 to-purple-500/30 shadow-2xl shadow-rose-500/40 border-4 border-white/60 backdrop-blur-xl">
                <HeartHandshake className="h-24 w-24 text-rose-500 drop-shadow-2xl animate-pulse" />
              </div>
              <p className="text-3xl font-black mb-4 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
                💝 No Love Conversations Yet
              </p>
              <p className="text-xl font-semibold max-w-md bg-gradient-to-r from-rose-500/90 via-pink-500/90 to-purple-500/90 bg-clip-text text-transparent drop-shadow-xl leading-relaxed">
                ✨ Find your special someone and start your romantic journey together 💕
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float-heart {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        .animate-float-heart {
          animation: float-heart 3s ease-in-out infinite;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(244, 63, 94, 0.1);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(244, 63, 94, 0.4), rgba(236, 72, 153, 0.4));
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(244, 63, 94, 0.6), rgba(236, 72, 153, 0.6));
        }
      `}</style>
    </aside>
  );
}

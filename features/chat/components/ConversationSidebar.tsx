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
    <aside className="group relative flex w-full flex-col border-r bg-gradient-to-br from-rose-50/95 via-pink-50/95 to-purple-100/95 lg:h-full lg:w-90 shadow-2xl shadow-rose-200/60 backdrop-blur-xl overflow-hidden lg:overflow-hidden lg:min-h-0">
      
      {/* ✨ Romantic Floating Hearts */}
      <div className="absolute inset-0 opacity-25 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-gradient-to-r from-rose-400/60 to-pink-400/60 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-10 h-28 w-28 rounded-full bg-gradient-to-r from-pink-400/50 to-purple-400/50 blur-2xl animate-bounce" style={{animationDelay: '1.5s'}} />
        <div className="absolute bottom-32 left-20 h-24 w-24 rounded-full bg-gradient-to-r from-purple-400/60 to-rose-400/60 blur-xl animate-ping" />
        <div className="absolute bottom-20 right-20 h-20 w-20 rounded-full bg-gradient-to-r from-rose-500/70 to-pink-500/70 blur-lg animate-pulse" style={{animationDelay: '3s'}} />
      </div>

      {/* ================= HEADER ================= */}
      <header className="shrink-0 relative z-20 flex items-center justify-between border-b border-rose-200/50 bg-gradient-to-r from-white/95 via-rose-50/95 to-pink-50/95 px-5 py-5 backdrop-blur-2xl shadow-lg shadow-rose-200/40">
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
      <div className="shrink-0 sticky top-0 z-30 border-b border-rose-200/40 bg-gradient-to-br from-rose-50/80 via-pink-50/80 to-purple-100/80 px-3 py-3 backdrop-blur-xl shadow-sm shadow-rose-200/30">
      <UserSearchList
        search={search}
        users={searchedUsers}
        onSearchChange={onSearchChange}
        onUserSelect={onUserSelect}
        onCreateGroup={onCreateGroup}
      />
      </div>

      {actionError && (
        <div className="shrink-0 mx-2 mt-2 mb-1 rounded-lg border-1.5 border-rose-400/60 bg-gradient-to-r from-rose-100/90 to-pink-100/90 px-3 py-2 text-xs font-semibold text-rose-600 shadow-md shadow-rose-300/30 backdrop-blur-sm animate-pulse">
          💔 {actionError}
        </div>
      )}

      {/* ================= SCROLLABLE CONVERSATIONS AREA ================= */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scroll-smooth">
        <div className="px-2 py-2 space-y-2">
          
          {/* Love Conversations Header */}
          <p className="sticky top-0 z-20 mb-2 px-3 py-1 rounded-lg bg-gradient-to-r from-rose-500/15 via-pink-500/15 to-purple-500/15 text-xs font-bold text-rose-700 bg-clip-text backdrop-blur-sm border border-rose-300/30 shadow-sm shadow-rose-200/15">
            💝 Love Conversations
          </p>

          {conversations.length ? (
            <ul className="space-y-1">
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
                    className={`relative w-full justify-start gap-1.5 rounded-md px-2 py-1.5 text-xs transition-all duration-200 group hover:shadow-sm hover:shadow-rose-400/20 backdrop-blur-sm border-1 ${
                      isActive
                        ? "border-rose-500/50 bg-gradient-to-r from-rose-500/12 via-pink-500/10 to-purple-500/12 shadow-sm shadow-rose-500/25 ring-1 ring-rose-400/30"
                        : "border-rose-200/25 hover:border-rose-400/40 hover:bg-rose-50/40"
                    }`}
                      onClick={() => onConversationSelect(conversation._id)}
                    >
                      {/* Active glow effect */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-500/40 to-pink-500/40 blur-xl animate-ping opacity-80 -z-10" />
                      )}

                      {/* Avatar with love theme */}
                      <div className="relative flex-shrink-0">
                      <Avatar className="h-9 w-9 ring-1 ring-white/60 shadow-sm border-1.5 border-rose-200/30 flex-shrink-0">
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
                      <div className="flex-1 text-left min-w-0 space-y-0.5">
                        <div className="flex justify-between items-center gap-2">
                          <p className={`font-bold text-xs leading-tight truncate ${
                            isActive
                              ? "bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm"
                              : "text-slate-900 group-hover:text-rose-700"
                          }`}>
                            {title}
                          </p>
                          {conversation.lastMessage && (
                            <span className={`text-xs font-semibold whitespace-nowrap ${
                              isActive
                                ? "bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent drop-shadow-none"
                                : "text-rose-500 group-hover:text-rose-600"
                            }`}>
                              {formatChatTimestamp(conversation.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>

                        <p className={`text-xs leading-tight truncate ${
                          isActive
                            ? "font-semibold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent drop-shadow-none"
                            : "text-slate-700 group-hover:text-rose-600"
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
            <div className="flex flex-col items-center justify-center p-4 text-center backdrop-blur-sm rounded-lg border-2 border-rose-300/50 bg-gradient-to-br from-rose-50/80 via-pink-50/80 to-purple-100/80 shadow-md shadow-rose-300/30 my-4">
              <div className="mb-2 p-4 rounded-lg bg-gradient-to-br from-rose-500/15 via-pink-500/15 to-purple-500/15 shadow-md shadow-rose-500/20 border-2 border-white/40 backdrop-blur-sm">
                <HeartHandshake className="h-12 w-12 text-rose-500 drop-shadow-md animate-pulse" />
              </div>
              <p className="text-sm font-bold mb-1 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent drop-shadow">
                💝 No Love Conversations Yet
              </p>
              <p className="text-xs font-semibold max-w-xs bg-gradient-to-r from-rose-600/70 via-pink-600/70 to-purple-600/70 bg-clip-text text-transparent drop-shadow-sm leading-tight">
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
        /* Smooth scrollbar for the sidebar */
        aside::-webkit-scrollbar {
          width: 6px;
        }
        aside::-webkit-scrollbar-track {
          background: transparent;
        }
        aside::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(244, 63, 94, 0.3), rgba(236, 72, 153, 0.3));
          border-radius: 3px;
        }
        aside::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(244, 63, 94, 0.5), rgba(236, 72, 153, 0.5));
        }
      `}</style>
    </aside>
  );
}

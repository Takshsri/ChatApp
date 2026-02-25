"use client";

import { Search, UserRound, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, UserId } from "@/types/chat";
import { GroupCreator } from "@/features/users/components/GroupCreator";

type UserSearchListProps = {
  search: string;
  users: User[];
  onSearchChange: (value: string) => void;
  onUserSelect: (userId: UserId) => void;
  onCreateGroup: (title: string, memberIds: UserId[]) => Promise<void>;
};

export function UserSearchList({
  search,
  users,
  onSearchChange,
  onUserSelect,
  onCreateGroup,
}: UserSearchListProps) {
  const hasSearch = Boolean(search.trim());

  return (
    <section className="space-y-2 border-b border-rose-200/50 bg-gradient-to-br from-rose-50/90 via-pink-50/90 to-purple-100/90 p-5 backdrop-blur-xl shadow-lg shadow-rose-200/40 rounded-xl">
      
      {/* Love Header */}
      <p className="text-sm font-black uppercase tracking-widest bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
        💕 Start Love Chat
      </p>

      {/* Romantic Search Bar */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-3 w-3 text-rose-400 drop-shadow-sm" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="💖 Search for love connections..."
          className="h-8 pl-8 pr-2 rounded-3xl border-2 border-rose-200/50 bg-white/80 text-rose-700 font-semibold placeholder:text-rose-400 focus:border-rose-500/70 focus:ring-2 focus:ring-rose-400/30 shadow-xl backdrop-blur-xl hover:shadow-rose-300/20 transition-all duration-300"
        />
      </div>

      {/* Love Connections List */}
      <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border-2 border-rose-200/50 bg-white/70 p-3 shadow-xl shadow-rose-100/50 backdrop-blur-xl scrollbar-thin scrollbar-thumb-rose-400/50 scrollbar-track-rose-50/50">
        {users.map((user) => (
          <Button
            key={user._id}
            variant="ghost"
            className={`h-auto w-full justify-start gap-3 rounded-xl px-2 py-2 transition-all duration-300 group hover:shadow-xl hover:shadow-rose-400/40 hover:scale-[1.02] hover:bg-gradient-to-r hover:from-rose-50/90 hover:to-pink-50/90 border border-rose-200/30 ${
              user.isOnline 
                ? "border-rose-400/50 bg-gradient-to-r from-rose-500/10 to-pink-500/10 shadow-lg shadow-rose-300/30 ring-2 ring-rose-400/30" 
                : "hover:border-rose-300/50"
            }`}
            onClick={() => onUserSelect(user._id)}
          >
            <div className="relative flex-shrink-0">
              <Avatar className="h-8 w-8 ring-2 ring-white/80 shadow-xl border-2 border-rose-200/50">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white font-black text-lg border-4 border-white/90 shadow-2xl">
                  {user.name.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* Love Heart Indicator */}
              {user.isOnline && (
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-white/90 bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg animate-pulse flex items-center justify-center">
                  <Heart className="h-2.5 w-2.5 fill-current text-white drop-shadow-md" />
                </div>
              )}
            </div>

            <div className="flex-1 text-left min-w-0">
              <p className="text-base font-black bg-gradient-to-r from-rose-700 to-pink-700 bg-clip-text text-transparent group-hover:from-rose-800 group-hover:to-pink-800 truncate drop-shadow-sm">
                {user.name}
              </p>
              <p className={`text-sm font-semibold ${
                user.isOnline 
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm" 
                  : "text-rose-400"
              }`}>
                {user.isOnline ? "💖 Online Now" : "💕 Offline"}
              </p>
            </div>
          </Button>
        ))}

        {/* Love Empty State */}
        {!users.length ? (
          <div className="rounded-xl border-2 border-rose-200/50 p-6 text-center bg-gradient-to-br from-rose-50/80 to-pink-50/80 backdrop-blur-xl shadow-lg">
            <div className="mx-auto mb-4 h-10 w-10 rounded-xl bg-gradient-to-br from-rose-400/30 to-pink-400/30 flex items-center justify-center shadow-xl border border-rose-200/50">
              <Heart className="h-10 w-10 text-rose-500 drop-shadow-lg animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent drop-shadow-md">
                {hasSearch ? "💔 No Love Matches" : "💕 No Connections Yet"}
              </p>
              <p className="text-sm text-rose-500 leading-relaxed">
                {hasSearch
                  ? "✨ Try different love interests or check your conversations below"
                  : "💝 Create another account to discover romantic connections"}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Love Group Creator */}
      <GroupCreator users={users} onCreateGroup={onCreateGroup} />
    </section>
  );
}

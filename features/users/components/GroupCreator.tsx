"use client";

import { useMemo, useState } from "react";
import { Check, UsersRound, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/types/chat";

type GroupCreatorProps = {
  users: User[];
  onCreateGroup: (title: string, memberIds: User["_id"][]) => Promise<void>;
};

export function GroupCreator({ users, onCreateGroup }: GroupCreatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedIds, setSelectedIds] = useState<User["_id"][]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCreate = useMemo(
    () =>
      title.trim().length > 0 &&
      selectedIds.length >= 2 &&
      !isSubmitting &&
      users.length > 0,
    [isSubmitting, selectedIds.length, title, users.length]
  );

  const toggleUser = (id: User["_id"]) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleCreate = async () => {
    if (!canCreate) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await onCreateGroup(title, selectedIds);

      setTitle("");
      setSelectedIds([]);
      setIsOpen(false);
    } catch {
      setError("Failed to create love group 💔");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative space-y-2 overflow-visible rounded-2xl border-2 border-rose-200/50 bg-gradient-to-br from-rose-50/90 via-pink-50/90 to-purple-50/90 p-3 shadow-md backdrop-blur-xl">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <UsersRound className="h-4 w-4 text-rose-500" />
          <p className="text-xs font-bold text-rose-600">
            💕 Love Groups ({selectedIds.length} selected)
          </p>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsOpen((v) => !v)}
          className="h-6 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white"
        >
          {isOpen ? "💔 Close" : "💝 New Group"}
        </Button>
      </div>

      {/* ================= CREATOR PANEL ================= */}
      {isOpen && (
        <div className="flex flex-col gap-3 rounded-xl border border-rose-200/40 bg-white/90 p-3 shadow-lg backdrop-blur-xl">

          {/* GROUP NAME */}
          <div className="relative">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="💖 Love Squad, Besties Forever..."
              className="h-11 pl-10 rounded-2xl border-2 border-rose-200"
            />

            <Heart className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-400" />

            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-rose-500 font-semibold">
              {selectedIds.length}/2
            </span>
          </div>

          {/* ================= USERS LIST (ONLY THIS SCROLLS) ================= */}
          <div className="max-h-48 overflow-y-auto flex-shrink-0 space-y-2 rounded-xl border border-rose-200/40 p-2 bg-rose-50/40 scrollbar-thin">

            {users.length === 0 ? (
              <p className="text-center text-xs text-rose-500 py-4">
                No users available 💕
              </p>
            ) : (
              users.map((user) => {
                const selected = selectedIds.includes(user._id);

                return (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => toggleUser(user._id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                      selected
                        ? "bg-rose-200 border border-rose-400"
                        : "hover:bg-rose-100"
                    }`}
                  >
                    <span className="truncate font-medium text-rose-700">
                      {user.name}
                    </span>

                    {selected ? (
                      <Check className="h-4 w-4 text-rose-600" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-rose-300" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* ERROR */}
          {error && (
            <div className="text-sm text-rose-600 bg-rose-100 rounded-lg p-2">
              {error}
            </div>
          )}

          {/* ================= CREATE BUTTON (ALWAYS VISIBLE) ================= */}
          <Button
            onClick={() => void handleCreate()}
            disabled={!canCreate || isSubmitting}
            className={`h-12 w-full rounded-2xl font-bold transition ${
              canCreate
                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                : "bg-rose-200 text-rose-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting
              ? "💝 Creating Love Group..."
              : `💕 Create Love Group (${selectedIds.length}/2)`}
          </Button>
        </div>
      )}

      {/* STATUS WHEN CLOSED */}
      {selectedIds.length > 0 && !isOpen && (
        <div className="text-center text-xs text-rose-600 bg-rose-100 rounded-lg py-2">
          💖 {selectedIds.length} selected
        </div>
      )}
    </section>
  );
}
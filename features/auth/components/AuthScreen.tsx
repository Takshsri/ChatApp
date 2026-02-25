"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { CheckCircle2, MessageCircle, ShieldCheck, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthScreen() {
  return (
    // ✅ Root wrapper (scroll works naturally)
    <div className="min-h-screen bg-gradient-to-br from-rose-50/95 via-pink-50/95 to-purple-100/95">

      {/* Floating background blobs */}
      <div className="fixed inset-0 opacity-10 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-10 -right-10 h-40 w-40 animate-pulse rounded-full bg-gradient-to-r from-rose-200/50 to-pink-200/50 blur-3xl" />
        <div
          className="absolute top-20 left-10 h-32 w-32 animate-pulse rounded-full bg-gradient-to-r from-pink-200/40 to-purple-200/40 blur-2xl"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute bottom-20 -left-10 h-36 w-36 animate-bounce rounded-full bg-gradient-to-r from-purple-200/50 to-rose-200/50 blur-3xl" />
      </div>

      {/* ✅ IMPORTANT: items-start instead of items-center */}
      <main className="relative flex items-start justify-center px-4 py-12 z-10">
        <section className="relative w-full max-w-4xl mx-auto overflow-visible rounded-4xl border-4 border-white/40 bg-gradient-to-br from-white/95 via-rose-50/95 to-pink-50/95 shadow-2xl backdrop-blur-3xl md:grid md:grid-cols-2 p-0">

          {/* ================= LEFT SIDE ================= */}
          <div className="flex flex-col justify-between border-b border-white/30 md:border-b-0 md:border-r bg-gradient-to-br from-white/90 via-rose-50/90 to-pink-50/90 p-6 md:p-8 backdrop-blur-xl shadow-inner shadow-rose-200/30">

            {/* Header */}
            <div className="mb-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-rose-200/70 bg-gradient-to-r from-rose-500/10 to-pink-500/10 px-3 py-1.5 text-xs font-bold text-rose-600 backdrop-blur-xl shadow-lg w-fit">
                <ShieldCheck className="h-3.5 w-3.5 text-rose-500" />
                Secure love messaging
              </div>

              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl border-4 border-white/60 bg-gradient-to-br from-rose-500/20 via-pink-500/20 to-purple-500/20 p-3 shadow-2xl">
                  <MessageCircle className="h-6 w-6" />
                </div>

                <div>
                  <h1 className="text-3xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Love Chat
                  </h1>
                  <p className="text-sm font-semibold text-rose-500 mt-1">
                    Romantic conversations with live hearts
                  </p>
                </div>
              </div>

              <p className="max-w-sm text-sm text-rose-700 bg-white/60 px-4 py-3 rounded-3xl border border-rose-200/50 shadow-xl">
                Send love messages, hearts, and photos to that special someone with instant delivery and beautiful animations.
              </p>
            </div>

            {/* Chat Preview */}
            <div className="w-full mb-6">
              <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/90 p-4 shadow-2xl">
                <div className="space-y-2 text-xs">

                  <div className="flex justify-start">
                    <div className="max-w-[78%] rounded-3xl rounded-bl-none bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 px-3 py-2 text-white shadow-xl">
                      Good morning my love 💕 Ready for our day together?
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="max-w-[73%] rounded-3xl rounded-br-none bg-white border border-rose-200 px-3 py-2 text-rose-900 shadow">
                      Yes sweetheart! Can't wait to see you 😍
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="relative max-w-[68%] rounded-3xl rounded-bl-none bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 px-3 py-2 text-white shadow-xl">
                      Perfect! Let's make today magical ✨
                      <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                        <Heart className="h-3 w-3 text-white fill-current animate-pulse" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-2">
              {[
                "Live heart reactions",
                "Private love chats",
                "Secure connections",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm font-semibold text-rose-700 bg-rose-100/70 px-3 py-2 rounded-2xl border border-rose-200"
                >
                  <div className="h-5 w-5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="flex flex-col justify-center p-6 md:p-8 bg-gradient-to-br from-white/95 via-rose-50/95 to-pink-50/95">

            <div className="text-center mb-8">
              <h2 className="text-3xl font-black mb-3 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Share your heart
              </h2>

              <p className="text-lg font-semibold text-rose-600 bg-white/70 px-4 py-2 rounded-2xl border border-rose-200">
                Connect with that special someone
              </p>
            </div>

            <div className="space-y-3 max-w-md mx-auto w-full">
              <SignInButton mode="modal">
                <Button className="h-14 w-full rounded-4xl text-lg font-black bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white shadow-2xl hover:scale-105 transition-all">
                  💕 Log in with Love
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button
                  variant="outline"
                  className="h-14 w-full rounded-4xl text-lg font-black border-2 border-rose-300 bg-white text-rose-600 hover:scale-105 transition-all"
                >
                  ✨ Start Romance
                </Button>
              </SignUpButton>
            </div>

            <div className="mt-8 pt-6 border-t border-white/30">
              <p className="text-sm font-semibold text-rose-500 bg-rose-100/80 px-4 py-3 rounded-3xl border border-rose-200 text-center">
                💖 Secure, private, made for love
              </p>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
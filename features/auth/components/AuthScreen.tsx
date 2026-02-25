"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { CheckCircle2, MessageCircle, ShieldCheck, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthScreen() {
  return (
    // ✅ Root wrapper (scroll works naturally)
    <div className="min-h-dvh bg-gradient-to-br from-rose-50/95 via-pink-50/95 to-purple-100/95">
      
      {/* Floating background blobs - FULL RESPONSIVE */}
      <div className="fixed inset-0 opacity-10 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-8 -right-8 sm:-top-10 sm:-right-10 h-32 sm:h-40 w-32 sm:w-40 animate-pulse rounded-full bg-gradient-to-r from-rose-200/50 to-pink-200/50 blur-2xl sm:blur-3xl" />
        <div
          className="absolute top-16 left-8 sm:top-20 sm:left-10 h-28 sm:h-32 w-28 sm:w-32 animate-pulse rounded-full bg-gradient-to-r from-pink-200/40 to-purple-200/40 blur-2xl sm:blur-3xl"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute bottom-16 -left-8 sm:bottom-20 sm:-left-10 h-32 sm:h-36 w-32 sm:w-36 animate-bounce rounded-full bg-gradient-to-r from-purple-200/50 to-rose-200/50 blur-2xl sm:blur-3xl" />
      </div>

      {/* ✅ FULL RESPONSIVE LAYOUT */}
      <main className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-8 sm:py-12 md:py-16 z-10">
        <section className="relative w-full max-w-sm sm:max-w-lg md:max-w-4xl mx-auto overflow-visible rounded-4xl border-4 border-white/40 bg-gradient-to-br from-white/95 via-rose-50/95 to-pink-50/95 shadow-2xl backdrop-blur-3xl">
          
          {/* ================= MOBILE STACKED LAYOUT ================= */}
          <div className="flex flex-col md:grid md:grid-cols-2 p-4 sm:p-6 md:p-8 gap-6 md:gap-0">
            
            {/* ================= LEFT SIDE - Features ================= */}
            <div className="flex flex-col justify-between border-b border-white/30 md:border-b-0 md:border-r bg-gradient-to-br from-white/90 via-rose-50/90 to-pink-50/90 p-4 sm:p-6 md:p-8 backdrop-blur-xl shadow-inner shadow-rose-200/30 order-2 md:order-1">
              
              {/* Header */}
              <div className="mb-6 sm:mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-rose-200/70 bg-gradient-to-r from-rose-500/10 to-pink-500/10 px-3 py-1.5 text-xs sm:text-sm font-bold text-rose-600 backdrop-blur-xl shadow-lg w-fit">
                  <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-500 flex-shrink-0" />
                  Secure love messaging
                </div>

                <div className="mb-6 sm:mb-8 flex items-start gap-3 sm:gap-4">
                  <div className="rounded-2xl sm:rounded-3xl border-4 border-white/60 bg-gradient-to-br from-rose-500/20 via-pink-500/20 to-purple-500/20 p-3 sm:p-4 shadow-2xl flex-shrink-0 mt-1">
                    <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-rose-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                      Love Chat
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base font-semibold text-rose-500 mt-1 sm:mt-2 leading-relaxed">
                      Romantic conversations with live hearts
                    </p>
                  </div>
                </div>

                <p className="max-w-full sm:max-w-sm text-xs sm:text-sm md:text-base text-rose-700 bg-white/60 px-3 sm:px-4 py-2 sm:py-3 rounded-3xl border border-rose-200/50 shadow-xl leading-relaxed">
                  Send love messages, hearts, and photos to that special someone with instant delivery and beautiful animations.
                </p>
              </div>

              {/* Chat Preview - RESPONSIVE */}
              <div className="w-full mb-4 sm:mb-6">
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/50 bg-white/90 p-3 sm:p-4 shadow-2xl">
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl rounded-bl-none bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 px-3 py-2 text-white shadow-xl font-medium">
                        Good morning my love 💕 Ready for our day together?
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="max-w-[75%] rounded-2xl rounded-br-none bg-white border border-rose-200 px-3 py-2 text-rose-900 shadow font-medium">
                        Yes sweetheart! Can't wait to see you 😍
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="relative max-w-[70%] rounded-2xl rounded-bl-none bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 px-3 py-2 text-white shadow-xl font-medium">
                        Perfect! Let's make today magical ✨
                        <div className="absolute -top-1 -right-1 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
                          <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white fill-current animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features - RESPONSIVE */}
              <ul className="space-y-2 sm:space-y-3">
                {[
                  "Live heart reactions",
                  "Private love chats", 
                  "Secure connections",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-rose-700 bg-rose-100/70 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl border border-rose-200 hover:bg-rose-200/70 transition-all"
                  >
                    <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center shadow-md flex-shrink-0">
                      <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                    </div>
                    <span className="leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ================= RIGHT SIDE - Buttons ================= */}
            <div className="flex flex-col justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-white/95 via-rose-50/95 to-pink-50/95 order-1 md:order-2">
              
              <div className="text-center mb-6 sm:mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  Share your heart
                </h2>

                <p className="text-base sm:text-lg md:text-xl font-semibold text-rose-600 bg-white/70 px-4 sm:px-6 py-3 sm:py-4 rounded-3xl border border-rose-200 shadow-xl mx-auto max-w-md">
                  Connect with that special someone
                </p>
              </div>

              {/* Buttons - FULL RESPONSIVE */}
              <div className="space-y-3 sm:space-y-4 max-w-md mx-auto w-full px-2 sm:px-0">
                <SignInButton mode="modal">
                  <Button className="h-14 sm:h-16 w-full rounded-4xl text-lg sm:text-xl font-black bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white shadow-3xl hover:shadow-rose-500/50 hover:scale-[1.02] transition-all duration-500 ring-4 ring-rose-400/40 backdrop-blur-xl">
                    💕 Log in with Love
                  </Button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <Button
                    variant="outline"
                    className="h-14 sm:h-16 w-full rounded-4xl text-lg sm:text-xl font-black border-4 border-rose-300/70 bg-white/95 text-rose-600 hover:bg-rose-50/80 hover:text-rose-700 hover:shadow-2xl hover:shadow-rose-400/50 hover:scale-[1.02] transition-all duration-500 ring-2 ring-rose-200/50 backdrop-blur-xl shadow-xl"
                  >
                    ✨ Start Romance
                  </Button>
                </SignUpButton>
              </div>

              <div className="mt-6 sm:mt-8 md:mt-12 pt-5 sm:pt-6 border-t border-white/30">
                <p className="text-xs sm:text-sm md:text-base font-semibold text-rose-500 bg-rose-100/80 px-3 sm:px-4 py-2 sm:py-3 rounded-3xl border border-rose-200 text-center shadow-md mx-auto max-w-sm">
                  💖 Secure, private, made for love
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

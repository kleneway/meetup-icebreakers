import React from "react";
import ClientProvider from "@/components/ClientProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight, Gamepad2, Users, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

async function getSession() {
  try {
    const session = await getServerSession(authOptions);
    return session;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

export default async function Page() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* {session && <NavigationBar />} */}

      <main className="flex-1 flex flex-col w-full mx-auto">
        <ClientProvider>
          <div className="flex-1 flex items-start justify-center  bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950">
            {session ? (
              // Authenticated View
              <section className="max-w-7xl w-full space-y-8 animate-fade-in p-8">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">Welcome {session.user?.name}</h1>
                  <p className="text-lg text-gray-600 mb-8">Choose your icebreaker experience</p>
                </div>
                
                {/* Games Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Game 2 - Workplace Buzz Battle */}
                  <Link
                    href="/game2"
                    className="group bg-white dark:bg-neutral-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 p-6 border border-neutral-200 dark:border-neutral-700"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Workplace Buzz Battle
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Three-team workplace humor trivia with race-to-buzz mechanics. Perfect for breaking the ice with office comedy!
                    </p>
                    <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
                      <Users className="w-4 h-4" />
                      <span>3 Teams • 15 Minutes • Instant Fun</span>
                    </div>
                    <div className="mt-4 flex items-center text-purple-600 dark:text-purple-400 font-medium group-hover:translate-x-1 transition-transform">
                      <span>Play Now</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </Link>

                  {/* Placeholder for future games */}
                  <div className="bg-gray-100 dark:bg-neutral-800 rounded-lg p-6 border border-dashed border-gray-300 dark:border-neutral-600">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
                        <Gamepad2 className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-400">
                        More Games Coming Soon
                      </h3>
                    </div>
                    <p className="text-gray-400 mb-4">
                      Additional icebreaker games are in development. Stay tuned for more team-building fun!
                    </p>
                  </div>
                </div>
              </section>
            ) : (
              // Marketing View
              <section className="max-w-7xl w-full space-y-8 animate-fade-in p-8">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">
                    Welcome to Meetup Icebreakers
                  </h1>
                  <p className="text-lg text-gray-600 mb-8">
                    Break the ice with fun, engaging team games
                  </p>
                </div>

                {/* Quick Access to Game 2 */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8 mb-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-3 text-purple-800 dark:text-purple-400">
                        🎯 Try Workplace Buzz Battle
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        No signup required! Jump right into our three-team workplace humor trivia game. 
                        Perfect for meetings, team building, or just having fun with colleagues.
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>3 Teams</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          <span>Race to Buzz</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Gamepad2 className="w-4 h-4" />
                          <span>No Storage</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Link
                        href="/game2"
                        className="group bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-8 py-4 text-lg font-medium shadow-lg transition-all duration-200 hover:shadow-xl flex items-center gap-2"
                      >
                        <Gamepad2 className="w-5 h-5" />
                        Play Game 2 Now
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        href="/auth/signin"
                        className="text-center text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium"
                      >
                        Sign in for more features
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <Link
                    href="/auth/signin"
                    className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-8 py-4 text-lg font-medium shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </section>
            )}
          </div>
        </ClientProvider>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            © {new Date().getFullYear()} All Rights Reserved
          </span>
          <div className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
            <Link
              href="/privacy"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

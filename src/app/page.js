'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiCpu, FiLock, FiUsers } from 'react-icons/fi';

const supabase = createClientComponentClient();

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsLoading(false);
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <header className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
        <nav className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="text-white font-bold text-xl">ChatGroq</div>
            {session ? (
              <button
                onClick={handleLogout}
                className="bg-white text-blue-500 px-4 py-2 rounded-full hover:bg-blue-100 transition duration-300"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="bg-white text-blue-500 px-4 py-2 rounded-full hover:bg-blue-100 transition duration-300"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to ChatGroq
          </motion.h1>
          <motion.p 
            className="text-xl text-white mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Experience the next generation of AI-powered conversations
          </motion.p>
          {session ? (
            <motion.button
              onClick={() => router.push('/chat')}
              className="bg-white text-blue-500 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-100 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Chatting
            </motion.button>
          ) : (
            <motion.button
              onClick={() => router.push('/login')}
              className="bg-white text-blue-500 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-100 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            { icon: FiMessageSquare, title: "Natural Conversations", description: "Engage in human-like dialogues with our advanced AI" },
            { icon: FiCpu, title: "Powered by Groq", description: "Utilizing cutting-edge language models for superior performance" },
            { icon: FiLock, title: "Secure & Private", description: "Your conversations are encrypted and never stored" },
            { icon: FiUsers, title: "Community Driven", description: "Join a growing community of AI enthusiasts and learners" }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <feature.icon className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to experience the future of AI?</h2>
          <p className="text-xl text-white mb-8">Join thousands of users already chatting with ChatGroq</p>
          <motion.button
            onClick={() => router.push(session ? '/chat' : '/login')}
            className="bg-white text-blue-500 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-100 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {session ? 'Start Chatting Now' : 'Sign Up for Free'}
          </motion.button>
        </div>
      </main>

      <footer className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg py-6">
        <div className="container mx-auto px-6 text-center text-white">
          <p>&copy; 2023 ChatGroq. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
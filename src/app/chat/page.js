'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiLogOut, FiMenu, FiX, FiUser, FiMoon, FiSun, FiDownload, FiUpload, FiRefreshCw, FiTrash2, FiCopy, FiSearch } from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const chatContainerRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };
    checkUser();
    loadChatHistory();
  }, [router]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const loadChatHistory = async () => {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading chat history:', error);
    } else {
      setChatHistory(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('https://idgkgphyyujwkspaktcn.supabase.co/functions/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        mode: 'cors',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      const aiMessage = { role: 'assistant', content: data.response };
      setChatHistory((prev) => [...prev, aiMessage]);
      await supabase.from('chat_history').insert([userMessage, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get response from AI: ' + error.message);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const exportChatHistory = () => {
    const dataStr = JSON.stringify(chatHistory);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'chat_history.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importChatHistory = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedHistory = JSON.parse(e.target.result);
          setChatHistory(importedHistory);
        } catch (error) {
          console.error('Error parsing imported file:', error);
          alert('Failed to import chat history. Please ensure the file is valid JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearChatHistory = async () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      await supabase.from('chat_history').delete().neq('id', 0);
      setChatHistory([]);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  const filteredChatHistory = chatHistory.filter(msg => 
    msg.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isSidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 z-50 w-64 h-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Chat History</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        <div className="p-4">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
          />
        </div>
        <nav className="p-4 overflow-y-auto h-[calc(100%-8rem)] custom-scrollbar">
          {filteredChatHistory.map((msg, index) => (
            <div key={index} className={`mb-2 p-2 hover:bg-gray-100 rounded cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`} onClick={() => setSelectedMessage(msg)}>
              <span className={`font-medium ${msg.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
                {msg.role === 'user' ? 'You: ' : 'AI: '}
              </span>
              <span className="truncate">{msg.content.substring(0, 30)}...</span>
            </div>
          ))}
        </nav>
      </motion.aside>

      <div className="flex flex-col flex-1">
        <header className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <button onClick={() => setIsSidebarOpen(true)} className="text-gray-500 hover:text-gray-700 mr-4">
                  <FiMenu size={24} />
                </button>
                <h1 className="text-2xl font-semibold">ChatGroq</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={toggleDarkMode} className="text-gray-500 hover:text-gray-700">
                  {isDarkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
                </button>
                <button onClick={exportChatHistory} className="text-gray-500 hover:text-gray-700">
                  <FiDownload size={24} />
                </button>
                <label className="cursor-pointer">
                  <input type="file" className="hidden" onChange={importChatHistory} accept=".json" />
                  <FiUpload size={24} className="text-gray-500 hover:text-gray-700" />
                </label>
                <button onClick={clearChatHistory} className="text-gray-500 hover:text-gray-700">
                  <FiTrash2 size={24} />
                </button>
                <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700">
                  <FiLogOut size={24} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className={`flex-1 overflow-hidden ${isFullScreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col py-8">
            <div className="flex-1 overflow-y-auto custom-scrollbar" ref={chatContainerRef}>
              <AnimatePresence>
                {filteredChatHistory.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg max-w-[80%] ${
                        msg.role === 'user'
                          ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900'
                          : isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <ReactMarkdown
                        components={{
                          code({node, inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={atomDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            )
                          }
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                      <button onClick={() => copyToClipboard(msg.content)} className="mt-2 text-xs text-gray-500 hover:text-gray-700">
                        <FiCopy size={12} className="inline mr-1" /> Copy
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <div className="text-gray-500 italic">AI is typing...</div>
              )}
            </div>

            <div className="py-4">
              <form onSubmit={handleSubmit} className="flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className={`flex-1 p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                  }`}
                />
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <FiSend size={20} />
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className={`bg-white rounded-lg p-6 max-w-2xl w-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <h3 className="text-lg font-semibold mb-4">Message Details</h3>
            <ReactMarkdown>{selectedMessage.content}</ReactMarkdown>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setSelectedMessage(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
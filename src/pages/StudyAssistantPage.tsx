import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, MessageSquare } from 'lucide-react';

export const StudyAssistantPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);

  const examplePrompts = [
    "পদার্থবিজ্ঞানে নিউটনের সূত্র ব্যাখ্যা করো",
    "রসায়নে মোলার ভর কীভাবে হিসাব করব?",
    "উচ্চতর গণিতে লিমিট বুঝিয়ে দাও"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "এই ফিচারটি শীঘ্রই আসছে! 🚀\n\nAI স্টাডি অ্যাসিস্ট্যান্ট আপনার যেকোনো প্রশ্নের উত্তর দেবে।"
        }
      ]);
    }, 500);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Sidebar - Recent Questions */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 p-4">
        <h2 className="bangla font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          সাম্প্রতিক প্রশ্ন
        </h2>
        <div className="flex-1 overflow-y-auto space-y-2">
          <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 bangla cursor-not-allowed opacity-70">
            আলোর প্রতিফলন কী?
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 bangla cursor-not-allowed opacity-70">
            জৈব যৌগের নামকরণ
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 bangla cursor-not-allowed opacity-70">
            ভেক্টর যোগের সামান্তরিক সূত্র
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="bangla font-bold text-xl text-gray-800">AI স্টাডি অ্যাসিস্ট্যান্ট</h1>
              <p className="bangla text-sm text-gray-500">যেকোনো বিষয়ে প্রশ্ন করুন</p>
            </div>
          </div>
          <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold bangla flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            শীঘ্রই আসছে
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-full mb-6">
                <Bot className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="bangla text-2xl font-bold text-gray-800 mb-2">
                আমি কীভাবে সাহায্য করতে পারি?
              </h2>
              <p className="bangla text-gray-500 mb-8">
                পদার্থবিজ্ঞান, রসায়ন বা গণিতের যেকোনো প্রশ্ন জিজ্ঞাসা করুন।
              </p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {examplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="bangla bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 px-4 py-2 rounded-full text-sm transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto w-full pb-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 bangla whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="প্রশ্ন করুন..."
              className="bangla w-full bg-gray-50 border border-gray-300 rounded-full py-3 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-2 bangla">
            AI ভুল করতে পারে। গুরুত্বপূর্ণ তথ্য যাচাই করে নিন।
          </p>
        </div>
      </div>
    </div>
  );
};

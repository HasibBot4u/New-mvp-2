import React, { useState } from 'react';
import { PublicNavbar } from '../components/public/PublicNavbar';
import { PublicFooter } from '../components/public/PublicFooter';

export const ContactPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1A237E] to-[#283593] pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="bangla text-4xl md:text-5xl font-extrabold text-white mb-4">
            যোগাযোগ করুন
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 flex-grow">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left Column - Contact Info */}
          <div>
            <h2 className="bangla text-2xl font-bold text-gray-900 mb-8">আমাদের সাথে যুক্ত হোন</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="text-3xl">📧</div>
                <div>
                  <p className="bangla font-bold text-gray-900">ইমেইল</p>
                  <p className="text-gray-600">support@nexusedu.com</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="text-3xl">📱</div>
                <div>
                  <p className="bangla font-bold text-gray-900">ফোন</p>
                  <p className="text-gray-600">+880 1X-XXXXXXXX</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="text-3xl">🏠</div>
                <div>
                  <p className="bangla font-bold text-gray-900">ঠিকানা</p>
                  <p className="bangla text-gray-600">ঢাকা, বাংলাদেশ</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="text-3xl">💬</div>
                <div>
                  <p className="bangla font-bold text-gray-900">Facebook</p>
                  <a href="#" className="text-blue-600 hover:underline">NexusEdu Page</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="bangla text-2xl font-bold text-gray-900 mb-6">আমাদের বার্তা পাঠান</h2>
            
            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">✅</div>
                <p className="bangla font-medium text-lg">ধন্যবাদ! আমরা শীঘ্রই যোগাযোগ করব।</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="bangla block text-sm font-medium text-gray-700 mb-1">আপনার নাম</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="আপনার নাম লিখুন"
                  />
                </div>
                
                <div>
                  <label className="bangla block text-sm font-medium text-gray-700 mb-1">আপনার ইমেইল</label>
                  <input 
                    type="email" 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="example@email.com"
                  />
                </div>
                
                <div>
                  <label className="bangla block text-sm font-medium text-gray-700 mb-1">বিষয়</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="কী বিষয়ে জানতে চান?"
                  />
                </div>
                
                <div>
                  <label className="bangla block text-sm font-medium text-gray-700 mb-1">বার্তা</label>
                  <textarea 
                    required 
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="আপনার বার্তা এখানে লিখুন..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="bangla w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md"
                >
                  বার্তা পাঠান
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

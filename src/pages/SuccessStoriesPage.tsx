import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../components/public/PublicNavbar';
import { PublicFooter } from '../components/public/PublicFooter';

export const SuccessStoriesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1A237E] to-[#283593] pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="bangla text-4xl md:text-5xl font-extrabold text-white mb-4">
            শিক্ষার্থীদের সাফল্য গাথা 🎓
          </h1>
          <p className="bangla text-xl text-blue-200 mb-8">
            আমাদের শিক্ষার্থীরা দেশের সেরা বিশ্ববিদ্যালয়গুলোতে ভর্তি হয়েছে
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/#courses')}
              className="bangla bg-white text-blue-900 hover:bg-gray-100 font-bold px-8 py-3 rounded-xl transition-colors"
            >
              কোর্স দেখুন
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bangla bg-[#00C853] hover:bg-[#00A846] text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-lg"
            >
              রেজিস্ট্রেশন করুন
            </button>
          </div>
        </div>
      </section>

      {/* Achievement Cards */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="bangla text-3xl font-extrabold text-center text-gray-900 mb-12">সেরা ফলাফল 🏆</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="rounded-2xl shadow-lg p-6 text-center bg-gradient-to-br from-yellow-400 to-orange-500 text-white transform hover:-translate-y-1 transition-transform">
              <div className="text-5xl mb-4">🥇</div>
              <h3 className="font-bold text-xl mb-2">BUET Top 3</h3>
              <p className="bangla text-sm opacity-90">বুয়েটে সেরা ৩ জনের মধ্যে আমাদের শিক্ষার্থী</p>
            </div>
            
            <div className="rounded-2xl shadow-lg p-6 text-center bg-gradient-to-br from-blue-400 to-indigo-600 text-white transform hover:-translate-y-1 transition-transform">
              <div className="text-5xl mb-4">🏛️</div>
              <h3 className="font-bold text-xl mb-2">DU 1st</h3>
              <p className="bangla text-sm opacity-90">ঢাকা বিশ্ববিদ্যালয়ে প্রথম স্থান</p>
            </div>
            
            <div className="rounded-2xl shadow-lg p-6 text-center bg-gradient-to-br from-green-400 to-teal-600 text-white transform hover:-translate-y-1 transition-transform">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="font-bold text-xl mb-2">RUET 1st</h3>
              <p className="bangla text-sm opacity-90">রুয়েটে প্রথম স্থান</p>
            </div>
            
            <div className="rounded-2xl shadow-lg p-6 text-center bg-gradient-to-br from-purple-400 to-pink-600 text-white transform hover:-translate-y-1 transition-transform">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="font-bold text-xl mb-2">CUET 1st</h3>
              <p className="bangla text-sm opacity-90">চুয়েটে প্রথম স্থান</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="bg-gray-50 py-16 px-4 flex-grow">
        <div className="max-w-6xl mx-auto">
          <h2 className="bangla text-3xl font-extrabold text-center text-gray-900 mb-12">শিক্ষার্থীরা কী বলছে</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "রাহুল", subject: "Physics", quote: "পদার্থবিজ্ঞান MCQ-তে ৯৮% পেয়েছি NexusEdu-র সাহায্যে", uni: "BUET 2024" },
              { name: "ফাতেমা", subject: "Chemistry", quote: "রসায়নে ভয় ছিল, এখন ভালোবাসি", uni: "DU 2024" },
              { name: "করিম", subject: "Math", quote: "উচ্চতর গণিতে A+ পেয়েছি", uni: "BUET 2024" },
              { name: "সুমাইয়া", subject: "Physics+Chemistry", quote: "লাইভ ক্লাস অনেক কাজে এসেছে", uni: "RUET 2024" },
              { name: "তানভীর", subject: "All subjects", quote: "MCQ মডেল টেস্টে ধারাবাহিকভাবে প্র্যাকটিস করেছি", uni: "CUET 2024" },
              { name: "নাফিসা", subject: "Math", quote: "প্রতিটি চ্যাপ্টার পরিষ্কারভাবে বোঝানো হয়েছে", uni: "SUST 2024" },
            ].map((student, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold shrink-0">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="bangla font-bold text-lg text-gray-900">{student.name}</h3>
                    <p className="text-gray-500 text-sm">{student.subject}</p>
                  </div>
                </div>
                <p className="bangla text-gray-600 italic mb-4 min-h-[60px]">"{student.quote}"</p>
                <div className="inline-block bg-green-100 text-green-700 text-xs font-bold rounded-full px-3 py-1">
                  {student.uni}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#1A237E] to-[#0D47A1] py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="bangla text-3xl font-extrabold text-white mb-8">
            তুমিও সফল হও!
          </h2>
          <button
            onClick={() => navigate('/login')}
            className="bangla bg-[#00C853] hover:bg-[#00A846] text-white font-bold px-10 py-4 rounded-xl text-xl transition-all hover:scale-105 shadow-xl"
          >
            রেজিস্ট্রেশন করুন
          </button>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../components/public/PublicNavbar';
import { PublicFooter } from '../components/public/PublicFooter';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <PublicNavbar />

      {/* ── SECTION 2: HERO ── */}
      <section className="bg-gradient-to-br from-[#1A237E] via-[#1565C0] to-[#0D47A1] min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-[60%] text-left">
              <h1 className="bangla text-4xl md:text-6xl font-extrabold text-white leading-tight">
                দেশের সেরা<br/>
                <span className="text-[#00C853]">এইচএসসি ক্লাস</span>
              </h1>
              <p className="bangla text-xl text-blue-100 mt-4">
                পদার্থবিজ্ঞান · রসায়ন · উচ্চতর গণিত
              </p>
              <p className="bangla text-blue-200 mt-3 max-w-lg">
                সাইকেল ভিত্তিক কোর্স, মডেল টেস্ট, লাইভ ক্লাস এবং Q&A সিস্টেম — 
                সব কিছু এক জায়গায়
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={() => {
                    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bangla bg-[#00C853] hover:bg-[#00A846] text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg"
                >
                  কোর্স দেখুন →
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bangla border-2 border-white/50 text-white hover:bg-white/10 font-bold px-8 py-4 rounded-xl text-lg transition-all"
                >
                  বিনামূল্যে শুরু করুন
                </button>
              </div>

              <div className="flex gap-8 mt-12 text-white">
                <div>
                  <div className="text-3xl font-bold">৩টি</div>
                  <div className="bangla text-blue-200 text-sm">বিষয়</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">১৮টি</div>
                  <div className="bangla text-blue-200 text-sm">সাইকেল</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">৩০০+</div>
                  <div className="bangla text-blue-200 text-sm">ভিডিও</div>
                </div>
              </div>
            </div>

            <div className="hidden md:block w-[40%] pl-12">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 transform rotate-3 hover:rotate-0 transition-transform duration-300 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-1/3 h-4 bg-white/20 rounded-full"></div>
                  <div className="w-8 h-8 bg-[#00C853] rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="w-full h-12 bg-white/10 rounded-xl"></div>
                  <div className="w-5/6 h-12 bg-white/10 rounded-xl"></div>
                  <div className="w-full h-12 bg-white/10 rounded-xl"></div>
                  <div className="w-4/5 h-12 bg-white/10 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: STATS BAR ── */}
      <section className="bg-[#0D1657] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex flex-col items-center text-white">
              <div className="text-3xl font-extrabold text-[#00C853]">৩টি বিষয়</div>
              <div className="bangla text-blue-200 text-sm mt-1">📚</div>
            </div>
            <div className="flex flex-col items-center text-white">
              <div className="text-3xl font-extrabold text-[#00C853]">১৮টি সাইকেল</div>
              <div className="bangla text-blue-200 text-sm mt-1">🔄</div>
            </div>
            <div className="flex flex-col items-center text-white">
              <div className="text-3xl font-extrabold text-[#00C853]">৩০০+ ক্লাস</div>
              <div className="bangla text-blue-200 text-sm mt-1">🎥</div>
            </div>
            <div className="flex flex-col items-center text-white">
              <div className="text-3xl font-extrabold text-[#00C853]">সেরা শিক্ষক</div>
              <div className="bangla text-blue-200 text-sm mt-1">👨‍🏫</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: SUBJECTS / COURSES ── */}
      <section id="courses" className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="bangla text-3xl font-extrabold text-center text-gray-900 mb-2">আমাদের কোর্সসমূহ</h2>
          <p className="bangla text-center text-gray-500 mb-12">
            এনরোল কর ঝামেলাবিহীন ভাবে আমাদের সব কোর্সে
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:scale-[1.02] transition-transform">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 flex items-center justify-center">
                <span className="text-6xl text-white">⚛️</span>
              </div>
              <div className="p-6">
                <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">Online</span>
                <h3 className="bangla font-bold text-xl mt-2">পদার্থবিজ্ঞান</h3>
                <p className="bangla text-gray-500 text-sm">HSC সম্পূর্ণ সিলেবাস</p>
                <p className="bangla text-gray-400 text-xs mt-1">৬ সাইকেল · ১০০+ ক্লাস</p>
                <button
                  onClick={() => navigate('/subjects')}
                  className="w-full mt-4 bg-blue-500 hover:bg-green-500 text-white py-2 rounded-lg bangla transition-colors"
                >
                  কোর্স দেখুন →
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:scale-[1.02] transition-transform">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-600 h-32 flex items-center justify-center">
                <span className="text-6xl text-white">🧪</span>
              </div>
              <div className="p-6">
                <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">Online</span>
                <h3 className="bangla font-bold text-xl mt-2">রসায়ন</h3>
                <p className="bangla text-gray-500 text-sm">HSC সম্পূর্ণ সিলেবাস</p>
                <p className="bangla text-gray-400 text-xs mt-1">৬ সাইকেল · ১০০+ ক্লাস</p>
                <button
                  onClick={() => navigate('/subjects')}
                  className="w-full mt-4 bg-blue-500 hover:bg-green-500 text-white py-2 rounded-lg bangla transition-colors"
                >
                  কোর্স দেখুন →
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:scale-[1.02] transition-transform">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 h-32 flex items-center justify-center">
                <span className="text-6xl text-white">📐</span>
              </div>
              <div className="p-6">
                <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">Online</span>
                <h3 className="bangla font-bold text-xl mt-2">উচ্চতর গণিত</h3>
                <p className="bangla text-gray-500 text-sm">HSC সম্পূর্ণ সিলেবাস</p>
                <p className="bangla text-gray-400 text-xs mt-1">৬ সাইকেল · ১০০+ ক্লাস</p>
                <button
                  onClick={() => navigate('/subjects')}
                  className="w-full mt-4 bg-blue-500 hover:bg-green-500 text-white py-2 rounded-lg bangla transition-colors"
                >
                  কোর্স দেখুন →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: WHY NEXUSEDU ── */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="bangla text-3xl font-extrabold text-center text-gray-900 mb-2">কেন NexusEdu?</h2>
          <p className="bangla text-center text-gray-500 mb-12">
            দেখে নাও কেন শিক্ষার্থীরা আমাদেরই বেছে নেয়
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "একাডেমিক থেকে এডমিশন", desc: "Physics, Chemistry, Math, Biology courses from HSC to university admission prep" },
              { title: "সেরা প্রযুক্তি", desc: "MCQ model test, Q&A discussion, live classes, progress tracking, notes system" },
              { title: "নিজের গতিতে শেখো", desc: "24/7 video access, resume where you left off, smart progress tracking" },
              { title: "সাশ্রয়ী মূল্যে সেরা শিক্ষা", desc: "Cycle-by-cycle affordable pricing, enroll only what you need" },
              { title: "পরীক্ষার প্রস্তুতি", desc: "MCQ quizzes with negative marking, leaderboard, model tests, timed exams" },
            ].map((card, i) => (
              <div key={i} className="relative">
                <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-indigo-500 rounded-lg" />
                <div className="relative h-full p-5 bg-white border-2 border-indigo-500 rounded-lg">
                  <h3 className="bangla font-bold text-gray-800 mb-2">{card.title}</h3>
                  <hr className="mb-3 border-gray-200" />
                  <p className="bangla text-gray-600 text-sm">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: FEATURES GRID ── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { emoji: "📹", title: "HD ভিডিও ক্লাস", desc: "৩০০+ ভিডিও ক্লাস, যেকোনো সময় দেখো" },
              { emoji: "📝", title: "মডেল টেস্ট", desc: "নেগেটিভ মার্কিং সহ MCQ পরীক্ষা দাও" },
              { emoji: "🏆", title: "লিডারবোর্ড", desc: "সেরা শিক্ষার্থীদের সাথে প্রতিযোগিতা করো" },
              { emoji: "💬", title: "Q&A সিস্টেম", desc: "প্রশ্ন করো, উত্তর পাও শিক্ষকের কাছ থেকে" },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4">
                <div className="text-5xl mb-4">{feature.emoji}</div>
                <h3 className="bangla font-bold text-gray-800">{feature.title}</h3>
                <p className="bangla text-gray-500 text-sm mt-2">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: TESTIMONIALS ── */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="bangla text-3xl font-extrabold text-center text-gray-900 mb-12">শিক্ষার্থীদের কথা</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "রাহুল আহমেদ", subject: "Physics student", quote: "মডেল টেস্ট সিস্টেম অসাধারণ। পরীক্ষার আগে নিজেকে যাচাই করতে পারি।" },
              { name: "ফাতেমা খানম", subject: "Chemistry student", quote: "Q&A সিস্টেমে শিক্ষকের কাছ থেকে সরাসরি উত্তর পাই।" },
              { name: "করিম হোসেন", subject: "Math student", quote: "ভিডিও যেকোনো সময় দেখতে পারি, তাই পড়াশোনা অনেক সহজ হয়েছে।" },
            ].map((testimonial, i) => (
              <div key={i} className="relative">
                <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-indigo-500 rounded-lg" />
                <div className="relative h-full p-5 bg-white border-2 border-indigo-500 rounded-lg flex flex-col">
                  <p className="bangla text-gray-600 italic mb-4 flex-grow">"{testimonial.quote}"</p>
                  <div>
                    <h3 className="bangla font-bold text-gray-800">{testimonial.name}</h3>
                    <p className="bangla text-xs text-gray-500">HSC 2026 শিক্ষার্থী · {testimonial.subject}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: CTA BANNER ── */}
      <section className="bg-gradient-to-r from-[#1A237E] to-[#0D47A1] py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="bangla text-3xl font-extrabold text-white mb-4">
            আজই শুরু করো তোমার যাত্রা
          </h2>
          <p className="bangla text-blue-200 mb-8 text-lg">
            বিনামূল্যে রেজিস্ট্রেশন করো এবং প্রথম ক্লাসটি দেখো
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bangla bg-[#00C853] hover:bg-[#00A846] text-white font-bold px-10 py-4 rounded-xl text-xl transition-all hover:scale-105 shadow-xl"
          >
            বিনামূল্যে শুরু করুন →
          </button>
        </div>
      </section>

      {/* ── SECTION 9: FOOTER ── */}
      <PublicFooter />
    </div>
  );
};

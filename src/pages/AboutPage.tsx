import React from 'react';
import { PublicNavbar } from '../components/public/PublicNavbar';
import { PublicFooter } from '../components/public/PublicFooter';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1A237E] to-[#283593] pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="bangla text-4xl md:text-5xl font-extrabold text-white mb-4">
            আমাদের সম্পর্কে
          </h1>
          <p className="bangla text-xl text-blue-200">
            NexusEdu — বাংলাদেশের সেরা HSC প্ল্যাটফর্ম
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="bangla text-3xl font-bold text-gray-900 mb-6">আমাদের লক্ষ্য</h2>
          <p className="bangla text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            আমাদের লক্ষ্য হলো বাংলাদেশের প্রতিটি শিক্ষার্থীর কাছে 
            সর্বোচ্চ মানের HSC পদার্থবিজ্ঞান, রসায়ন ও উচ্চতর গণিত শিক্ষা পৌঁছে দেওয়া।
            Telegram-ভিত্তিক আমাদের ক্লাউড স্টোরেজ থেকে HD মানের ভিডিও স্ট্রিম করা হয়
            যা দেশের যেকোনো প্রান্ত থেকে দেখা সম্ভব।
          </p>
        </div>
      </section>

      {/* Our Team */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="bangla font-extrabold text-3xl text-center text-gray-900 mb-12">আমাদের দল</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Card 1 */}
            <div className="group [perspective:1000px] cursor-pointer">
              <div className="relative w-full h-64 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] transition-all duration-500">
                {/* Front face */}
                <div className="absolute inset-0 bg-blue-600 text-white flex flex-col items-center justify-center rounded-xl shadow-lg [backface-visibility:hidden]">
                  <div className="text-5xl mb-4">🧑‍💻</div>
                  <h3 className="text-xl font-bold">Md. Hasib</h3>
                  <p className="text-sm text-blue-200 mt-1">Founder & Developer</p>
                </div>
                {/* Back face */}
                <div className="absolute inset-0 bg-white border-2 border-blue-600 rounded-xl p-6 flex flex-col items-center justify-center shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <h3 className="text-xl font-bold text-gray-900">Md. Hasib</h3>
                  <p className="text-sm text-blue-600 font-medium mb-4">Founder & Developer</p>
                  <p className="bangla text-gray-600 text-center">NexusEdu এর প্রতিষ্ঠাতা</p>
                  <p className="bangla text-gray-500 text-sm mt-2">B.Sc CSE শিক্ষার্থী</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group [perspective:1000px] cursor-pointer">
              <div className="relative w-full h-64 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] transition-all duration-500">
                {/* Front face */}
                <div className="absolute inset-0 bg-indigo-600 text-white flex flex-col items-center justify-center rounded-xl shadow-lg [backface-visibility:hidden]">
                  <div className="text-5xl mb-4">👨‍🏫</div>
                  <h3 className="text-xl font-bold">Rahim Uddin</h3>
                  <p className="text-sm text-indigo-200 mt-1">Lead Instructor</p>
                </div>
                {/* Back face */}
                <div className="absolute inset-0 bg-white border-2 border-indigo-600 rounded-xl p-6 flex flex-col items-center justify-center shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <h3 className="text-xl font-bold text-gray-900">Rahim Uddin</h3>
                  <p className="text-sm text-indigo-600 font-medium mb-4">Lead Instructor</p>
                  <p className="bangla text-gray-600 text-center">প্রধান শিক্ষক</p>
                  <p className="bangla text-gray-500 text-sm mt-2">M.Sc Physics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="bg-indigo-900 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold text-indigo-300 mb-2">18</div>
              <div className="text-sm font-medium tracking-wider uppercase">Channels</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-300 mb-2">300+</div>
              <div className="text-sm font-medium tracking-wider uppercase">Videos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-300 mb-2">3</div>
              <div className="text-sm font-medium tracking-wider uppercase">Subjects</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-300 mb-2">Free</div>
              <div className="text-sm font-medium tracking-wider uppercase">To Start</div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex-grow"></div>
      <PublicFooter />
    </div>
  );
};

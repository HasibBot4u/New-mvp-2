import React from 'react';
import { Link } from 'react-router-dom';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-[#1A237E] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 */}
          <div>
            <div className="font-bold text-2xl mb-4">NexusEdu</div>
            <p className="bangla text-blue-200 mb-6">
              বাংলাদেশের সেরা HSC ভিডিও ক্লাস প্ল্যাটফর্ম
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">Facebook</a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">YouTube</a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">Instagram</a>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="bangla font-bold text-lg mb-4">দ্রুত লিংক</h3>
            <div className="space-y-2">
              <a href="/#courses" className="bangla block text-blue-200 hover:text-white transition-colors">কোর্সসমূহ</a>
              <Link to="/success-stories" className="bangla block text-blue-200 hover:text-white transition-colors">সাফল্য গাথা</Link>
              <Link to="/about" className="bangla block text-blue-200 hover:text-white transition-colors">আমাদের সম্পর্কে</Link>
              <Link to="/contact" className="bangla block text-blue-200 hover:text-white transition-colors">যোগাযোগ</Link>
            </div>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="bangla font-bold text-lg mb-4">যোগাযোগ</h3>
            <div className="space-y-2 bangla text-blue-200">
              <p>📧 support@nexusedu.com</p>
              <p>📱 +880 1X-XXXXXXXX</p>
              <p>🏠 ঢাকা, বাংলাদেশ</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-blue-800 text-center">
          <p className="text-blue-300 text-sm mb-4">© 2025 NexusEdu. All rights reserved.</p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link to="/privacy" className="text-blue-300 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-blue-300 hover:text-white transition-colors">Terms</Link>
            <Link to="/refund-policy" className="text-blue-300 hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

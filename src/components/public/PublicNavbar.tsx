import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const PublicNavbar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="font-bold text-2xl text-blue-600">NexusEdu</Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <a href="/#courses" className="bangla text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">কোর্সসমূহ</a>
            <Link to="/success-stories" className="bangla text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">সাফল্য গাথা</Link>
            <Link to="/about" className="bangla text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">আমাদের সম্পর্কে</Link>
            <Link to="/contact" className="bangla text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">যোগাযোগ</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <button
                onClick={() => navigate('/')}
                className="bangla bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
              >
                ড্যাশবোর্ড
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="bangla text-gray-700 hover:text-blue-600 font-medium px-4 py-2"
                >
                  লগইন করুন
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bangla bg-[#00C853] hover:bg-[#00A846] text-white font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  বিনামূল্যে শুরু করুন
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-700 hover:text-blue-600 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

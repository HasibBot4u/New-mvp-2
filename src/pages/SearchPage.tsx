import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, BookOpen, PlayCircle, ArrowLeft, X, Mic, MicOff, Filter } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'chapter' | 'subject'>('all');
  const { results: searchResults } = useSearch(searchQuery);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasRecognition] = useState(() => {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  });
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasRecognition) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'bn-BD'; // Default to Bangla, can also understand English

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [hasRecognition]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Could not start speech recognition", e);
      }
    }
  };

  const filteredResults = searchResults.filter(result => 
    filterType === 'all' ? true : result.type === filterType
  );

  return (
    <div className={`min-h-screen bg-gray-50 pb-24 transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <header className="bg-primary text-white h-16 flex items-center px-4 sticky top-0 z-30 shadow-md">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors mr-3"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">Search</h1>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            autoFocus
            placeholder="Search videos, chapters, subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-20 py-3 border border-gray-200 rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm shadow-sm transition-shadow"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            {hasRecognition && (
              <button 
                onClick={toggleListening}
                className={`p-1.5 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-400 hover:text-primary hover:bg-gray-100'}`}
              >
                {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {[
            { id: 'all', label: 'All' },
            { id: 'video', label: 'Videos' },
            { id: 'chapter', label: 'Chapters' },
            { id: 'subject', label: 'Subjects' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setFilterType(filter.id as any)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterType === filter.id 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {searchQuery && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {filteredResults.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {filteredResults.map((result) => (
                  <li key={`${result.type}-${result.id}`}>
                    <Link
                      to={result.url}
                      className="block px-4 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-4">
                          {result.type === 'video' && <PlayCircle className="w-6 h-6 text-primary" />}
                          {result.type === 'chapter' && <BookOpen className="w-6 h-6 text-secondary" />}
                          {result.type === 'subject' && <BookOpen className="w-6 h-6 text-gray-400" />}
                        </div>
                        <div>
                          <p className="text-base font-medium text-gray-900">{result.title}</p>
                          <p className="text-sm text-gray-500">{result.subtitle}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-12 text-center text-gray-500">
                No {filterType !== 'all' ? filterType + ' ' : ''}results found for '{searchQuery}'
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

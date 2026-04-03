import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MessageCircle, Plus, Search, CheckCircle, Clock, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useCatalog } from '../contexts/CatalogContext';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { motion } from 'framer-motion';

export function QnAPage() {
  const { user } = useAuth();
  const { catalog } = useCatalog();
  const [searchParams] = useSearchParams();
  const videoIdParam = searchParams.get('video');
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;
  
  // Filters
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Question Modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState(videoIdParam || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Pre-fill chapter if video is provided
  useEffect(() => {
    if (videoIdParam && catalog) {
      for (const subject of catalog.subjects) {
        for (const cycle of subject.cycles) {
          for (const chapter of cycle.chapters) {
            if (chapter.videos.some((v: any) => v.id === videoIdParam)) {
              setSelectedChapterId(chapter.id);
              setShowNewModal(true);
              break;
            }
          }
        }
      }
    }
  }, [videoIdParam, catalog]);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchQuestions(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, videoIdParam]);

  const fetchQuestions = async (pageNumber: number) => {
    if (pageNumber === 0) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    
    try {
      let query = supabase
        .from('questions_forum')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url),
          answers:forum_answers(count)
        `)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .range(pageNumber * PAGE_SIZE, (pageNumber + 1) * PAGE_SIZE - 1);

      if (filter === 'resolved') {
        query = query.eq('is_resolved', true);
      } else if (filter === 'unresolved') {
        query = query.eq('is_resolved', false);
      }
      
      if (videoIdParam) {
        query = query.eq('video_id', videoIdParam);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      if (data) {
        if (pageNumber === 0) {
          setQuestions(data);
        } else {
          setQuestions(prev => [...prev, ...data]);
        }
        setHasMore(data.length === PAGE_SIZE);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchQuestions(nextPage);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const imageUrl = await api.uploadImage(file);
      setNewBody(prev => prev + `\n\n![Image](${imageUrl})\n`);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle.trim() || !newBody.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('questions_forum')
        .insert({
          user_id: user.id,
          title: newTitle.trim(),
          body: newBody.trim(),
          chapter_id: selectedChapterId || null,
          video_id: selectedVideoId || null
        });

      if (error) throw error;
      
      setShowNewModal(false);
      setNewTitle('');
      setNewBody('');
      setSelectedChapterId('');
      setSelectedVideoId('');
      setPage(0);
      fetchQuestions(0);
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('Failed to submit question');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to get all chapters for dropdown
  const allChapters = catalog?.subjects.flatMap(s => s.cycles).flatMap(c => c.chapters) || [];
  const selectedChapter = allChapters.find(c => c.id === selectedChapterId);
  const chapterVideos = selectedChapter?.videos || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-primary" />
              প্রশ্ন করুন 💬
            </h1>
            <Button onClick={() => setShowNewModal(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">নতুন প্রশ্ন</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="প্রশ্ন খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                সব
              </button>
              <button
                onClick={() => setFilter('unresolved')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === 'unresolved' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                অমীমাংসিত
              </button>
              <button
                onClick={() => setFilter('resolved')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === 'resolved' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                সমাধান হয়েছে
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-4 rounded-xl border">
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="w-24 h-4 mb-1" />
                    <Skeleton className="w-16 h-3" />
                  </div>
                </div>
                <Skeleton className="w-3/4 h-6 mb-2" />
                <Skeleton className="w-full h-4" />
              </div>
            ))}
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">কোনো প্রশ্ন পাওয়া যায়নি</h3>
            <p className="text-gray-500">প্রথম প্রশ্নটি আপনিই করুন!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((q) => (
              <Link 
                key={q.id} 
                to={`/qna/${q.id}`}
                className="block bg-white p-4 sm:p-5 rounded-xl border hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                      {q.profiles?.avatar_url ? (
                        <img src={q.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {q.profiles?.full_name || 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(q.created_at).toLocaleDateString('bn-BD')}
                      </p>
                    </div>
                  </div>
                  {q.is_resolved && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium shrink-0">
                      <CheckCircle className="w-3 h-3" />
                      <span className="hidden sm:inline">সমাধান হয়েছে</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {q.is_pinned && '📌 '}{q.title}
                </h3>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {q.body}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {q.answers?.[0]?.count || 0} উত্তর
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    {q.upvotes || 0} ভোট
                  </span>
                  {q.chapter_id && (
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {allChapters.find(c => c.id === q.chapter_id)?.name || 'অধ্যায়'}
                    </span>
                  )}
                </div>
              </Link>
            ))}
            
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={loadMore} 
                  isLoading={isLoadingMore}
                >
                  আরও দেখুন
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Question Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl"
          >
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-semibold">নতুন প্রশ্ন করুন</h2>
              <button onClick={() => setShowNewModal(false)} className="p-2 hover:bg-gray-200 rounded-full">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmitQuestion} className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">অধ্যায় (ঐচ্ছিক)</label>
                  <select
                    value={selectedChapterId}
                    onChange={e => {
                      setSelectedChapterId(e.target.value);
                      setSelectedVideoId('');
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">অধ্যায় নির্বাচন করুন</option>
                    {allChapters.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ভিডিও (ঐচ্ছিক)</label>
                  <select
                    value={selectedVideoId}
                    onChange={e => setSelectedVideoId(e.target.value)}
                    disabled={!selectedChapterId}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-100"
                  >
                    <option value="">ভিডিও নির্বাচন করুন</option>
                    {chapterVideos.map((v: any) => (
                      <option key={v.id} value={v.id}>{v.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">প্রশ্নের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="আপনার প্রশ্নটি সংক্ষেপে লিখুন..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">বিস্তারিত *</label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">Markdown supported</span>
                    <label className={`cursor-pointer flex items-center gap-1 text-xs font-medium ${isUploadingImage ? 'text-gray-400' : 'text-primary hover:text-primary/80'}`}>
                      {isUploadingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3" />}
                      <span>ছবি যোগ করুন</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={isUploadingImage}
                      />
                    </label>
                  </div>
                </div>
                <textarea
                  required
                  value={newBody}
                  onChange={e => setNewBody(e.target.value)}
                  placeholder="আপনার প্রশ্নটি বিস্তারিতভাবে লিখুন..."
                  rows={5}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowNewModal(false)}>
                  বাতিল
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  পোস্ট করুন
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Dummy User icon component since it's used above but not imported from lucide-react in the original snippet
function User(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

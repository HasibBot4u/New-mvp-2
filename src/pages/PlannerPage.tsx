import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Circle, ArrowLeft } from 'lucide-react';
import { useCatalog } from '../contexts/CatalogContext';
import { Breadcrumb } from '../components/ui/Breadcrumb';

export const PlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { catalog } = useCatalog();
  const [plan, setPlan] = useState<Record<string, string[]>>(() => {
    const savedPlan = localStorage.getItem('nexusedu_study_plan');
    if (savedPlan) {
      try {
        return JSON.parse(savedPlan);
      } catch (e) {
        console.error('Error parsing plan:', e);
      }
    }
    return {};
  });
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    const savedCompleted = localStorage.getItem('nexusedu_study_completed');
    if (savedCompleted) {
      try {
        return JSON.parse(savedCompleted);
      } catch (e) {
        console.error('Error parsing completed:', e);
      }
    }
    return {};
  });

  const savePlan = (newPlan: Record<string, string[]>) => {
    setPlan(newPlan);
    localStorage.setItem('nexusedu_study_plan', JSON.stringify(newPlan));
  };

  const saveCompleted = (newCompleted: Record<string, boolean>) => {
    setCompleted(newCompleted);
    localStorage.setItem('nexusedu_study_completed', JSON.stringify(newCompleted));
  };

  // Generate week dates (Mon-Sun)
  const getWeekDates = () => {
    const curr = new Date();
    const first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const next = new Date(curr.getTime());
      next.setDate(first + i);
      dates.push(next);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const toggleChapter = (chapterId: string) => {
    const currentDayPlan = plan[selectedDate] || [];
    let newDayPlan;
    
    if (currentDayPlan.includes(chapterId)) {
      newDayPlan = currentDayPlan.filter(id => id !== chapterId);
    } else {
      newDayPlan = [...currentDayPlan, chapterId];
    }

    savePlan({
      ...plan,
      [selectedDate]: newDayPlan
    });
  };

  const toggleCompletion = (chapterId: string) => {
    saveCompleted({
      ...completed,
      [chapterId]: !completed[chapterId]
    });
  };

  // Get all chapters from catalog
  const allChapters = catalog?.subjects.flatMap(s => 
    s.cycles.flatMap(c => 
      c.chapters.map(ch => ({ ...ch, subjectName: s.name, cycleName: c.name }))
    )
  ) || [];

  const plannedChaptersForSelectedDate = (plan[selectedDate] || [])
    .map(id => allChapters.find(ch => ch.id === id))
    .filter(Boolean);

  const totalPlannedThisWeek = weekDates.reduce((total, date) => {
    const dateStr = date.toISOString().split('T')[0];
    return total + (plan[dateStr]?.length || 0);
  }, 0);

  const totalCompletedThisWeek = weekDates.reduce((total, date) => {
    const dateStr = date.toISOString().split('T')[0];
    const planned = plan[dateStr] || [];
    return total + planned.filter(id => completed[id]).length;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-primary text-white pt-12 pb-6 px-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold mb-1 bangla">পড়ার পরিকল্পনা</h1>
            <p className="text-white/70 text-sm">Study Planner</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Profile', href: '/profile' },
          { label: 'Planner' },
        ]} />

        {/* Week View */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              This Week
            </h2>
            <span className="text-sm text-gray-500 font-medium">
              {totalCompletedThisWeek}/{totalPlannedThisWeek} Completed
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: totalPlannedThisWeek > 0 ? `${(totalCompletedThisWeek / totalPlannedThisWeek) * 100}%` : '0%' }}
            />
          </div>

          <div className="flex justify-between gap-2 overflow-x-auto pb-2">
            {weekDates.map((date) => {
              const dateStr = date.toISOString().split('T')[0];
              const isSelected = dateStr === selectedDate;
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const plannedCount = plan[dateStr]?.length || 0;
              
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`flex flex-col items-center min-w-[3rem] p-2 rounded-xl transition-all ${
                    isSelected 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : isToday
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xs font-medium mb-1 uppercase">{dayNames[date.getDay()]}</span>
                  <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {date.getDate()}
                  </span>
                  {plannedCount > 0 && (
                    <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-purple-500'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Today's Plan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 bangla">
              {selectedDate === new Date().toISOString().split('T')[0] ? 'আজকের পরিকল্পনা' : 'দিনের পরিকল্পনা'}
            </h3>
            
            {plannedChaptersForSelectedDate.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 bangla">এই দিনের জন্য কোনো পরিকল্পনা নেই।</p>
                <p className="text-sm text-gray-400 mt-1">ডানদিকের তালিকা থেকে অধ্যায় যোগ করুন।</p>
              </div>
            ) : (
              <div className="space-y-3">
                {plannedChaptersForSelectedDate.map((chapter: any) => (
                  <div key={chapter.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    completed[chapter.id] ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <button 
                      onClick={() => toggleCompletion(chapter.id)}
                      className="mt-0.5 flex-shrink-0"
                    >
                      {completed[chapter.id] ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h4 className={`font-medium ${completed[chapter.id] ? 'text-green-800 line-through opacity-70' : 'text-gray-900'}`}>
                        {chapter.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{chapter.subjectName} • {chapter.cycleName}</p>
                    </div>
                    <button 
                      onClick={() => toggleChapter(chapter.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add to Plan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 bangla">অধ্যায় যোগ করুন</h3>
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
              {catalog?.subjects.map(subject => (
                <div key={subject.id} className="space-y-2">
                  <h4 className="font-bold text-gray-700 sticky top-0 bg-white py-1">{subject.name}</h4>
                  {subject.cycles.map(cycle => (
                    <div key={cycle.id} className="pl-2 border-l-2 border-gray-100 space-y-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{cycle.name}</p>
                      {cycle.chapters.map(chapter => {
                        const isPlanned = (plan[selectedDate] || []).includes(chapter.id);
                        return (
                          <button
                            key={chapter.id}
                            onClick={() => toggleChapter(chapter.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${
                              isPlanned ? 'bg-purple-50 text-purple-700 font-medium' : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <span className="truncate pr-2">{chapter.name}</span>
                            {isPlanned ? (
                              <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">Added</span>
                            ) : (
                              <span className="text-xs text-gray-400">+ Add</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="bangla text-lg font-medium text-gray-600 italic">
            "পরিশ্রমই সাফল্যের চাবিকাঠি।"
          </p>
        </div>
      </main>
    </div>
  );
};

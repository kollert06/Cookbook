import React from 'react';
import { Calendar, History, BookOpen, PlusCircle, Users, Trophy } from 'lucide-react';

export type TabType = 'calendar' | 'history' | 'recipes' | 'shared' | 'gamification';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenCookLogModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenCookLogModal
}) => {
  return (
    <>
      {/* Floating Action Button for Logging Cooked Dish */}
      <div className="fixed bottom-20 right-4 z-40 sm:bottom-22 sm:right-6">
        <button
          onClick={onOpenCookLogModal}
          className="flex items-center gap-2 bg-gradient-to-tr from-[#D46A43] via-[#c05a38] to-[#F2C94C] text-white px-4 py-3 rounded-full shadow-xl shadow-[#D46A43]/30 hover:scale-105 active:scale-95 transition-all border-2 border-white/40"
          title="Gekochtes Gericht erfassen"
        >
          <PlusCircle className="w-5 h-5 stroke-[2.5]" />
          <span className="text-xs font-extrabold tracking-wide">Gericht loggen</span>
        </button>
      </div>

      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#FDFCF8]/95 backdrop-blur-lg border-t border-[#E0D8CC] pt-1.5 px-2"
        style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="max-w-md mx-auto flex items-center justify-around">
          {/* Calendar Tab */}
          <button
            onClick={() => onTabChange('calendar')}
            className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all ${
              activeTab === 'calendar'
                ? 'text-[#D46A43] font-semibold scale-105'
                : 'text-[#8a7266] hover:text-[#2D3047]'
            }`}
          >
            <Calendar className={`w-5 h-5 ${activeTab === 'calendar' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-1">Kalender</span>
          </button>

          {/* History / Verlauf Tab */}
          <button
            onClick={() => onTabChange('history')}
            className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all ${
              activeTab === 'history'
                ? 'text-[#D46A43] font-semibold scale-105'
                : 'text-[#8a7266] hover:text-[#2D3047]'
            }`}
          >
            <History className={`w-5 h-5 ${activeTab === 'history' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-1">Verlauf</span>
          </button>

          {/* Recipes Tab */}
          <button
            onClick={() => onTabChange('recipes')}
            className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all ${
              activeTab === 'recipes'
                ? 'text-[#D46A43] font-semibold scale-105'
                : 'text-[#8a7266] hover:text-[#2D3047]'
            }`}
          >
            <BookOpen className={`w-5 h-5 ${activeTab === 'recipes' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-1">Rezepte</span>
          </button>

          {/* Shared Cookbooks Tab */}
          <button
            onClick={() => onTabChange('shared')}
            className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all ${
              activeTab === 'shared'
                ? 'text-[#D46A43] font-semibold scale-105'
                : 'text-[#8a7266] hover:text-[#2D3047]'
            }`}
          >
            <Users className={`w-5 h-5 ${activeTab === 'shared' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-1">Gemeinsam</span>
          </button>

          {/* Gamification Tab */}
          <button
            onClick={() => onTabChange('gamification')}
            className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all ${
              activeTab === 'gamification'
                ? 'text-[#D46A43] font-semibold scale-105'
                : 'text-[#8a7266] hover:text-[#2D3047]'
            }`}
          >
            <Trophy className={`w-5 h-5 ${activeTab === 'gamification' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-1">XP & Level</span>
          </button>
        </div>
      </nav>
    </>
  );
};

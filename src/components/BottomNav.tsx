import React from 'react';
import { Calendar, BookOpen, PlusCircle, Users, Trophy } from 'lucide-react';

export type TabType = 'calendar' | 'recipes' | 'shared' | 'gamification';

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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FDFCF8]/95 backdrop-blur-lg border-t border-[#E0D8CC] pb-safe pt-1.5 px-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* Calendar Tab */}
        <button
          onClick={() => onTabChange('calendar')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-2xl transition-all ${
            activeTab === 'calendar'
              ? 'text-[#D46A43] font-semibold scale-105'
              : 'text-[#8a7266] hover:text-[#2D3047]'
          }`}
        >
          <Calendar className={`w-5 h-5 ${activeTab === 'calendar' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1">Kalender</span>
        </button>

        {/* Recipes Tab */}
        <button
          onClick={() => onTabChange('recipes')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-2xl transition-all ${
            activeTab === 'recipes'
              ? 'text-[#D46A43] font-semibold scale-105'
              : 'text-[#8a7266] hover:text-[#2D3047]'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === 'recipes' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1">Rezepte</span>
        </button>

        {/* Center Log Dish Button */}
        <div className="-mt-5 relative">
          <button
            onClick={onOpenCookLogModal}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#D46A43] via-[#c05a38] to-[#F2C94C] text-white flex items-center justify-center shadow-lg shadow-[#D46A43]/30 hover:scale-105 active:scale-95 transition-all border-4 border-[#FDFCF8]"
            title="Kocheintrag erfassen"
          >
            <PlusCircle className="w-7 h-7 stroke-[2.2]" />
          </button>
        </div>

        {/* Shared Cookbooks Tab */}
        <button
          onClick={() => onTabChange('shared')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-2xl transition-all ${
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
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-2xl transition-all ${
            activeTab === 'gamification'
              ? 'text-[#D46A43] font-semibold scale-105'
              : 'text-[#8a7266] hover:text-[#2D3047]'
          }`}
        >
          <Trophy className={`w-5 h-5 ${activeTab === 'gamification' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1">XP &amp; Level</span>
        </button>

      </div>
    </nav>
  );
};

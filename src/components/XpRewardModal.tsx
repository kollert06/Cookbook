import React from 'react';
import { Sparkles, Trophy, Star, Flame, ArrowRight } from 'lucide-react';

interface XpRewardModalProps {
  recipeTitle: string;
  xpBreakdown: {
    base: number;
    completeBonus: number;
    firstTimeBonus: number;
    total: number;
  };
  onClose: () => void;
}

export const XpRewardModal: React.FC<XpRewardModalProps> = ({
  recipeTitle,
  xpBreakdown,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#FDFCF8] w-full max-w-sm rounded-3xl p-6 shadow-2xl border-2 border-[#e8bf8c] text-center animate-in zoom-in-95 duration-200">
        
        {/* Animated Trophy Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#F2C94C] to-[#f59e0b] text-white flex items-center justify-center shadow-xl shadow-[#F2C94C]/30 mb-4 animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        <h3 className="font-serif italic font-extrabold text-2xl text-[#2D3047] mb-1">
          Kocheintrag geloggt!
        </h3>
        <p className="text-xs font-medium text-[#64748b] mb-4 truncate px-2">
          „{recipeTitle}“
        </p>

        {/* Big XP Pill */}
        <div className="bg-gradient-to-r from-[#D46A43] to-[#c05a38] text-white rounded-2xl p-4 mb-5 shadow-md">
          <div className="text-xs uppercase tracking-wider font-semibold opacity-90 mb-0.5">
            Gesammelte Erfahrung
          </div>
          <div className="text-4xl font-extrabold text-amber-300 flex items-center justify-center gap-1">
            <span>+{xpBreakdown.total}</span>
            <span className="text-xl">XP</span>
          </div>
        </div>

        {/* Breakdown Items */}
        <div className="bg-[#F2EDE4] rounded-2xl p-3.5 space-y-2 text-xs text-[#2D3047] text-left mb-6 border border-[#E0D8CC]">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#D46A43]" />
              Grundbelohnung Kocheintrag
            </span>
            <span className="font-bold text-[#D46A43]">+{xpBreakdown.base} XP</span>
          </div>

          {xpBreakdown.completeBonus > 0 && (
            <div className="flex justify-between items-center text-emerald-800">
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Bonus: Vollständiger Eintrag
              </span>
              <span className="font-bold">+{xpBreakdown.completeBonus} XP</span>
            </div>
          )}

          {xpBreakdown.firstTimeBonus > 0 && (
            <div className="flex justify-between items-center text-amber-900 font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Bonus: Erstes Mal gekocht!
              </span>
              <span>+{xpBreakdown.firstTimeBonus} XP</span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#2D3047] hover:bg-[#1e2030] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <span>Weiter geht's</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { CookLog, SharedCookbook, Recipe } from '../types';
import { HalfStarRating } from './HalfStarRating';
import { AvatarFrame } from './AvatarFrame';
import { 
  History, 
  Search, 
  Calendar, 
  Users, 
  Flame, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  BookOpen, 
  X, 
  ChefHat,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface HistoryViewProps {
  cookLogs: CookLog[];
  recipes: Recipe[];
  sharedCookbooks: SharedCookbook[];
  currentUserId: string;
  onOpenCookLogModal: () => void;
  onEditCookLog: (log: CookLog) => void;
  onDeleteCookLog: (logId: string) => void;
  onSelectRecipe?: (recipe: Recipe) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  cookLogs,
  recipes,
  sharedCookbooks,
  currentUserId,
  onOpenCookLogModal,
  onEditCookLog,
  onDeleteCookLog,
  onSelectRecipe
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'mine' | string>('all');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Sort logs descending by date & created_at
  const sortedLogs = [...cookLogs].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const filteredLogs = sortedLogs.filter(log => {
    // Filter by mode
    if (filterMode === 'mine' && log.userId !== currentUserId) {
      return false;
    }
    if (filterMode !== 'all' && filterMode !== 'mine' && log.sharedCookbookId !== filterMode) {
      return false;
    }
    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = log.recipeTitle.toLowerCase().includes(q);
      const matchUser = (log.userName || '').toLowerCase().includes(q);
      const matchComment = (log.comment || '').toLowerCase().includes(q);
      return matchTitle || matchUser || matchComment;
    }
    return true;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    return dateStr;
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E0D8CC] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D46A43] to-[#c05a38] text-white flex items-center justify-center shadow-md">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif italic font-extrabold text-xl text-[#2D3047] leading-tight">
                Koch-Verlauf
              </h2>
              <p className="text-xs text-[#64748b]">
                {filteredLogs.length} {filteredLogs.length === 1 ? 'Eintrag' : 'Einträge'} protokolliert
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCookLogModal}
            className="flex items-center gap-1.5 bg-[#D46A43] hover:bg-[#c05a38] text-white font-bold px-3 py-2 rounded-2xl text-xs shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Eintrag hinzufügen</span>
            <span className="sm:hidden">+ Neu</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Gericht, Koch oder Kommentar suchen..."
            className="w-full bg-[#FDFCF8] border border-[#E0D8CC] focus:border-[#D46A43] rounded-2xl pl-10 pr-4 py-2 text-xs text-[#2D3047] outline-none transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#2D3047]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-[#E0D8CC]">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterMode === 'all'
                ? 'bg-[#D46A43] text-white shadow-sm'
                : 'bg-[#F2EDE4] text-[#2D3047] hover:bg-[#E0D8CC]'
            }`}
          >
            Alle Einträge
          </button>
          <button
            onClick={() => setFilterMode('mine')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterMode === 'mine'
                ? 'bg-[#D46A43] text-white shadow-sm'
                : 'bg-[#F2EDE4] text-[#2D3047] hover:bg-[#E0D8CC]'
            }`}
          >
            Meine Kocheinträge
          </button>
          {sharedCookbooks.map(cb => (
            <button
              key={cb.id}
              onClick={() => setFilterMode(cb.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                filterMode === cb.id
                  ? 'bg-[#D46A43] text-white shadow-sm'
                  : 'bg-[#F2EDE4] text-[#2D3047] hover:bg-[#E0D8CC]'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>{cb.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feed List */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-[#E0D8CC] text-center space-y-3 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#F2EDE4] text-[#D46A43] flex items-center justify-center mx-auto">
            <ChefHat className="w-8 h-8" />
          </div>
          <h3 className="font-serif italic font-bold text-lg text-[#2D3047]">
            Keine Kocheinträge gefunden
          </h3>
          <p className="text-xs text-[#64748b] max-w-xs mx-auto">
            {searchTerm 
              ? 'Kein Eintrag entspricht deiner Suche. Versuche einen anderen Suchbegriff.' 
              : 'Du hast noch keine gekochten Gerichte protokolliert. Erfasse jetzt deinen ersten Kocheintrag!'}
          </p>
          <button
            onClick={onOpenCookLogModal}
            className="inline-flex items-center gap-2 bg-[#D46A43] hover:bg-[#c05a38] text-white font-bold px-5 py-2.5 rounded-2xl text-xs shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Jetzt Gericht erfassen (+XP)
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => {
            const isOwner = log.userId === currentUserId;
            const linkedRecipe = recipes.find(r => r.id === log.recipeId);
            const sharedCb = sharedCookbooks.find(cb => cb.id === log.sharedCookbookId);

            return (
              <div 
                key={log.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E0D8CC] shadow-sm hover:shadow-md transition-shadow space-y-3 relative overflow-hidden"
              >
                {/* Top Bar: User & Date */}
                <div className="flex items-center justify-between border-b border-[#E0D8CC]/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <AvatarFrame
                      avatarUrl={log.userAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(log.userName || 'Chef')}`}
                      frameId="none"
                      username={log.userName || 'Koch'}
                      size="sm"
                      showBadge={false}
                    />
                    <div>
                      <p className="text-xs font-bold text-[#2D3047] leading-none">
                        {log.userName || 'Koch'}
                      </p>
                      <span className="text-[10px] text-[#64748b] flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-[#D46A43]" />
                        {formatDate(log.date)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {sharedCb && (
                      <span className="bg-[#F2EDE4] text-[#D46A43] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {sharedCb.name}
                      </span>
                    )}

                    {log.xpEarned?.total > 0 && (
                      <span className="bg-[#F2C94C]/20 border border-[#F2C94C] text-[#b45309] text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3 text-[#f59e0b]" />
                        +{log.xpEarned.total} XP
                      </span>
                    )}
                  </div>
                </div>

                {/* Dish Title & Rating */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif italic font-bold text-lg text-[#2D3047] leading-tight">
                      {log.recipeTitle}
                    </h3>
                    {log.portions && (
                      <span className="text-[11px] text-[#64748b] block mt-0.5">
                        Portionen: {log.portions} Px.
                      </span>
                    )}
                  </div>

                  <div className="bg-[#FDFCF8] px-2.5 py-1 rounded-xl border border-[#E0D8CC] shrink-0">
                    <HalfStarRating value={log.rating} size="sm" readOnly />
                    <span className="text-[10px] font-extrabold text-[#2D3047] text-center block mt-0.5">
                      {log.rating.toFixed(1)} / 5.0
                    </span>
                  </div>
                </div>

                {/* Photos Gallery */}
                {log.photos && log.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {log.photos.map((photo, imgIdx) => (
                      <div 
                        key={imgIdx} 
                        onClick={() => setZoomedImage(photo)}
                        className="aspect-square rounded-2xl overflow-hidden bg-[#F2EDE4] border border-[#E0D8CC] cursor-pointer group relative"
                      >
                        <img 
                          src={photo} 
                          alt={`${log.recipeTitle} ${imgIdx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment */}
                {log.comment && (
                  <div className="bg-[#FDFCF8] p-3 rounded-2xl border border-[#E0D8CC] text-xs text-[#2D3047] flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-[#D46A43] shrink-0 mt-0.5" />
                    <p className="italic text-[#475569] leading-relaxed">
                      "{log.comment}"
                    </p>
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E0D8CC]/60 text-xs">
                  <div>
                    {linkedRecipe && onSelectRecipe && (
                      <button
                        onClick={() => onSelectRecipe(linkedRecipe)}
                        className="flex items-center gap-1 text-[#D46A43] font-bold hover:underline"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Rezept öffnen</span>
                      </button>
                    )}
                  </div>

                  {isOwner && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditCookLog(log)}
                        className="p-1.5 rounded-xl bg-[#F2EDE4] hover:bg-[#E0D8CC] text-[#2D3047] transition-all"
                        title="Eintrag bearbeiten"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Möchtest du den Kocheintrag "${log.recipeTitle}" wirklich löschen?`)) {
                            onDeleteCookLog(log.id);
                          }
                        }}
                        className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all"
                        title="Eintrag löschen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-lg w-full bg-transparent p-2">
            <button 
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={zoomedImage} 
              alt="Foto Vergrößerung" 
              className="w-full max-h-[80vh] object-contain rounded-3xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};

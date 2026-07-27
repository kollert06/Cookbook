import React, { useState } from 'react';
import { CookLog, SharedCookbook } from '../types';
import { HalfStarRating } from './HalfStarRating';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Flame, MessageSquare, Trash2, Users, Lock, X } from 'lucide-react';

interface CalendarViewProps {
  cookLogs: CookLog[];
  sharedCookbooks: SharedCookbook[];
  currentUserId: string;
  onOpenCookLogModal: () => void;
  onEditCookLog: (log: CookLog) => void;
  onDeleteCookLog: (logId: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  cookLogs,
  sharedCookbooks,
  currentUserId,
  onOpenCookLogModal,
  onEditCookLog,
  onDeleteCookLog
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterMode, setFilterMode] = useState<'all' | 'personal' | string>('all'); // 'all', 'personal', or sharedCookbookId
  const [selectedDayLog, setSelectedDayLog] = useState<CookLog | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Filter logs according to active tab/filter
  const filteredLogs = cookLogs.filter(log => {
    if (filterMode === 'personal') {
      return log.userId === currentUserId && !log.sharedCookbookId;
    }
    if (filterMode !== 'all') {
      return log.sharedCookbookId === filterMode;
    }
    return true; // 'all'
  });

  // Map logs by YYYY-MM-DD
  const logsByDate: { [key: string]: CookLog[] } = {};
  filteredLogs.forEach(log => {
    if (!logsByDate[log.date]) {
      logsByDate[log.date] = [];
    }
    logsByDate[log.date].push(log);
  });

  return (
    <div className="space-y-4 pb-1">
      
      {/* Calendar Header Controls */}
      <div className="bg-white p-4 rounded-3xl border border-[#E0D8CC] shadow-sm space-y-3">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterMode === 'all'
                ? 'bg-[#D46A43] text-white shadow-sm'
                : 'bg-[#E0D8CC] text-[#2D3047] hover:bg-[#E0D8CC]'
            }`}
          >
            Alle Einträge
          </button>
          <button
            onClick={() => setFilterMode('personal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
              filterMode === 'personal'
                ? 'bg-[#D46A43] text-white shadow-sm'
                : 'bg-[#E0D8CC] text-[#2D3047] hover:bg-[#E0D8CC]'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>Persönlich</span>
          </button>
          {sharedCookbooks.map(cb => (
            <button
              key={cb.id}
              onClick={() => setFilterMode(cb.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                filterMode === cb.id
                  ? 'bg-[#D46A43] text-white shadow-sm'
                  : 'bg-[#E0D8CC] text-[#2D3047] hover:bg-[#E0D8CC]'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>{cb.name}</span>
            </button>
          ))}
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between pt-1 border-t border-[#E0D8CC]">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#D46A43]" />
            <h2 className="font-serif italic font-bold text-lg text-[#2D3047]">
              {monthNames[month]} {year}
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-[#F2EDE4] hover:bg-[#E0D8CC] text-[#2D3047] transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-[#F2EDE4] hover:bg-[#E0D8CC] text-[#2D3047] transition-all active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-3xl p-4 border border-[#E0D8CC] shadow-sm">
        
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day, i) => (
            <span key={i} className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider py-1">
              {day}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          
          {/* Empty lead cells */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square rounded-2xl bg-[#FDFCF8]/50" />
          ))}

          {/* Days of Month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayLogs = logsByDate[dateStr] || [];
            const hasLog = dayLogs.length > 0;
            const isToday = dateStr === getLocalDateString();

            return (
              <button
                key={dayNum}
                onClick={() => {
                  if (hasLog) {
                    setSelectedDayLog(dayLogs[0]);
                  }
                }}
                className={`relative aspect-square rounded-2xl p-1 flex flex-col justify-between items-center transition-all ${
                  hasLog
                    ? 'bg-gradient-to-br from-[#F2EDE4] to-[#E0D8CC] border-2 border-[#F2C94C] shadow-sm hover:scale-105 cursor-pointer'
                    : 'bg-[#FDFCF8] hover:bg-[#E0D8CC] border border-transparent'
                } ${isToday ? 'ring-2 ring-[#D46A43]' : ''}`}
              >
                <span className={`text-xs font-bold ${hasLog ? 'text-[#D46A43]' : 'text-[#64748b]'}`}>
                  {dayNum}
                </span>

                {hasLog && (
                  <div className="w-full flex flex-col items-center gap-0.5">
                    {dayLogs[0].photos && dayLogs[0].photos.length > 0 ? (
                      <img
                        src={dayLogs[0].photos[0]}
                        alt="Cooked dish"
                        className="w-5 h-5 rounded-md object-cover shadow-xs"
                      />
                    ) : (
                      <span className="text-[10px]">🍲</span>
                    )}
                    <span className="text-[8px] font-bold text-[#c05a38] truncate max-w-full px-0.5">
                      {dayLogs[0].rating}★
                    </span>
                  </div>
                )}
              </button>
            );
          })}

        </div>

      </div>

      {/* Recent Cook Logs List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-serif italic font-bold text-base text-[#2D3047] flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#F2C94C]" />
            <span>Kürzlich gekocht ({filteredLogs.length})</span>
          </h3>
          <button
            onClick={onOpenCookLogModal}
            className="text-xs font-bold text-[#D46A43] hover:underline"
          >
            + Neues Gericht
          </button>
        </div>

        {filteredLogs.length > 0 ? (
          <div className="space-y-3">
            {filteredLogs.map(log => (
              <div
                key={log.id}
                onClick={() => setSelectedDayLog(log)}
                className="bg-white p-4 rounded-3xl border border-[#E0D8CC] shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-3.5"
              >
                {log.photos && log.photos.length > 0 ? (
                  <img
                    src={log.photos[0]}
                    alt={log.recipeTitle}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-[#E0D8CC]"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-[#F2EDE4] border border-[#E0D8CC] flex items-center justify-center text-2xl shrink-0">
                    🍲
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                      {log.date}
                    </span>
                    {log.sharedCookbookId && (
                      <span className="text-[9px] bg-[#F2EDE4] text-[#D46A43] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <Users className="w-2.5 h-2.5" />
                        <span>Gemeinsam</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-[#2D3047] truncate">
                    {log.recipeTitle}
                  </h4>

                  <div className="mt-1">
                    <HalfStarRating value={log.rating} readOnly size="sm" />
                  </div>

                  {log.comment && (
                    <p className="text-xs text-[#64748b] line-clamp-1 mt-1.5 italic">
                      „{log.comment}“
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-dashed border-[#E0D8CC] text-center">
            <span className="text-3xl block mb-2">🍳</span>
            <p className="text-sm font-semibold text-[#2D3047]">Noch keine Kocheinträge für diesen Filter</p>
            <p className="text-xs text-[#64748b] mt-1 mb-4">
              Logge dein erstes gekochtes Gericht und verdiene XP!
            </p>
            <button
              onClick={onOpenCookLogModal}
              className="bg-[#D46A43] hover:bg-[#c05a38] text-white font-bold py-2.5 px-4 rounded-2xl text-xs transition-all shadow-md"
            >
              + Gericht erfassen (+10 XP)
            </button>
          </div>
        )}
      </div>

      {/* Day Detail Inspector Modal */}
      {selectedDayLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#FDFCF8] w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E0D8CC] p-5 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E0D8CC] mb-4">
              <div>
                <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">
                  Kocheintrag am {selectedDayLog.date}
                </span>
                <h3 className="font-serif italic font-extrabold text-xl text-[#2D3047]">
                  {selectedDayLog.recipeTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDayLog(null)}
                className="w-9 h-9 rounded-full bg-[#E0D8CC] text-[#2D3047] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photos */}
            {selectedDayLog.photos && selectedDayLog.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {selectedDayLog.photos.map((p, idx) => (
                  <img
                    key={idx}
                    src={p}
                    alt={`Foto ${idx+1}`}
                    className="aspect-square rounded-2xl object-cover w-full border border-[#E0D8CC]"
                  />
                ))}
              </div>
            )}

            {/* Rating & XP */}
            <div className="bg-white p-4 rounded-2xl border border-[#E0D8CC] space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2D3047] uppercase tracking-wider">
                  Bewertung
                </span>
                <HalfStarRating value={selectedDayLog.rating} readOnly size="md" />
              </div>

              {selectedDayLog.portions && (
                <div className="pt-2 border-t border-[#E0D8CC] flex items-center justify-between text-xs">
                  <span className="text-[#64748b] font-bold uppercase tracking-wider">Portionen:</span>
                  <span className="font-semibold text-[#2D3047]">{selectedDayLog.portions} Personen</span>
                </div>
              )}

              {selectedDayLog.xpEarned && (
                <div className="pt-2 border-t border-[#E0D8CC] flex items-center justify-between text-xs">
                  <span className="text-[#64748b]">Verdiente Erfahrung:</span>
                  <span className="font-extrabold text-[#F2C94C] bg-[#F2C94C] px-2.5 py-0.5 rounded-full border border-[#F2C94C]">
                    +{selectedDayLog.xpEarned.total} XP
                  </span>
                </div>
              )}
            </div>

            {/* Custom Recipe Adjustments */}
            {selectedDayLog.recipeText && (
              <div className="bg-white p-4 rounded-2xl border border-[#E0D8CC] mb-4">
                <h4 className="text-xs font-bold text-[#2D3047] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <span>📝</span>
                  <span>Rezept-Anpassung für diesen Tag</span>
                </h4>
                <p className="text-sm text-[#2D3047] leading-relaxed whitespace-pre-line">
                  {selectedDayLog.recipeText}
                </p>
              </div>
            )}

            {/* Comment */}
            {selectedDayLog.comment && (
              <div className="bg-[#F2EDE4] p-4 rounded-2xl border border-[#E0D8CC] mb-5">
                <h4 className="text-xs font-bold text-[#2D3047] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#D46A43]" />
                  <span>Notiz / Bemerkung</span>
                </h4>
                <p className="text-sm text-[#2D3047] leading-relaxed">
                  {selectedDayLog.comment}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (confirm('Diesen Kocheintrag löschen?')) {
                      onDeleteCookLog(selectedDayLog.id);
                      setSelectedDayLog(null);
                    }
                  }}
                  className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Löschen</span>
                </button>
                <button
                  onClick={() => {
                    onEditCookLog(selectedDayLog);
                    setSelectedDayLog(null);
                  }}
                  className="text-xs text-[#2D3047] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>✏️ Bearbeiten</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedDayLog(null)}
                className="bg-[#D46A43] text-white font-bold py-2.5 px-5 rounded-2xl text-xs"
              >
                Schließen
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

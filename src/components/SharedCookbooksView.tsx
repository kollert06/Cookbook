import React, { useState } from 'react';
import { SharedCookbook, User, CookLog } from '../types';
import { StorageService } from '../services/storage';
import { Users, Plus, KeyRound, Copy, Check, Trophy, Sparkles, Calendar, BookOpen, Flame } from 'lucide-react';
import { calculateLevel, xpForNextLevel } from '../data/constants';

interface SharedCookbooksViewProps {
  sharedCookbooks: SharedCookbook[];
  currentUser: User;
  allUsers: User[];
  cookLogs: CookLog[];
  onRefresh: () => void;
  onOpenCookLogModal: () => void;
}

export const SharedCookbooksView: React.FC<SharedCookbooksViewProps> = ({
  sharedCookbooks,
  currentUser,
  allUsers,
  cookLogs,
  onRefresh,
  onOpenCookLogModal
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newCbName, setNewCbName] = useState('');
  const [newCbDesc, setNewCbDesc] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [error, setError] = useState('');

  const mySharedCookbooks = sharedCookbooks.filter(cb => cb.memberIds.includes(currentUser.id));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCbName.trim()) {
      setError('Bitte einen Namen für das gemeinsame Kochbuch eingeben.');
      return;
    }

    StorageService.createSharedCookbook(newCbName.trim(), newCbDesc.trim());
    setNewCbName('');
    setNewCbDesc('');
    setShowCreateModal(false);
    setError('');
    onRefresh();
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setError('Bitte den Einladungscode eingeben.');
      return;
    }

    const joined = StorageService.joinSharedCookbookByCode(joinCode);
    if (!joined) {
      setError('Ungültiger Einladungscode. Bitte überprüfe den Code.');
      return;
    }

    setJoinCode('');
    setShowJoinModal(false);
    setError('');
    onRefresh();
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-4 pb-1">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#D46A43] via-[#c05a38] to-[#c05a38] text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-md text-amber-200 px-2.5 py-0.5 rounded-full inline-block mb-2">
            Multi-User &amp; Team
          </span>
          <h2 className="font-serif italic font-extrabold text-2xl leading-tight">
            Gemeinsame Kochbücher
          </h2>
          <p className="text-xs text-white/90 mt-1 max-w-sm">
            Koche gemeinsam mit Partnern, WGs oder Freunden. Teilt Rezepte, synchrone Kalender &amp; euer eigenes Team-XP-Level!
          </p>

          {/* Action buttons */}
          <div className="flex gap-2.5 mt-4">
            <button
              onClick={() => {
                setError('');
                setShowCreateModal(true);
              }}
              className="bg-white hover:bg-amber-50 text-[#2D3047] font-bold py-2.5 px-4 rounded-2xl text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Kochbuch erstellen</span>
            </button>

            <button
              onClick={() => {
                setError('');
                setShowJoinModal(true);
              }}
              className="bg-white/20 hover:bg-white/30 text-white font-bold py-2.5 px-4 rounded-2xl text-xs backdrop-blur-md transition-all flex items-center gap-1.5 active:scale-95 border border-white/30"
            >
              <KeyRound className="w-4 h-4" />
              <span>Mit Code beitreten</span>
            </button>
          </div>
        </div>
      </div>

      {/* List of Joined Shared Cookbooks */}
      {mySharedCookbooks.length > 0 ? (
        <div className="space-y-4">
          {mySharedCookbooks.map(cb => {
            const cbLevel = calculateLevel(cb.xp);
            const xpInfo = xpForNextLevel(cb.xp);
            const members = allUsers.filter(u => cb.memberIds.includes(u.id));
            const cbLogs = cookLogs.filter(l => l.sharedCookbookId === cb.id);

            return (
              <div
                key={cb.id}
                className="bg-white p-5 rounded-3xl border border-[#E0D8CC] shadow-sm space-y-4"
              >
                {/* Top Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif italic font-extrabold text-lg text-[#2D3047]">
                        {cb.name}
                      </h3>
                      <span className="bg-[#F2C94C] text-[#2D3047] border border-[#F2C94C] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-[#F2C94C]" />
                        <span>Team Lvl {cbLevel}</span>
                      </span>
                    </div>

                    <p className="text-xs text-[#64748b] mt-0.5">
                      {cb.description || 'Keine Beschreibung angegeben.'}
                    </p>
                  </div>

                  {/* Copy Invite Code button */}
                  <button
                    onClick={() => handleCopyCode(cb.inviteCode)}
                    className="bg-[#F2EDE4] hover:bg-[#E0D8CC] text-[#2D3047] text-[11px] font-bold px-2.5 py-1.5 rounded-xl border border-[#E0D8CC] transition-all flex items-center gap-1"
                    title="Einladungscode kopieren"
                  >
                    {copiedCode === cb.inviteCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Kopiert!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#D46A43]" />
                        <span>{cb.inviteCode}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Cookbook XP Bar */}
                <div className="bg-[#F2EDE4] p-3 rounded-2xl border border-[#E0D8CC] space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#2D3047] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#F2C94C]" />
                      <span>Gemeinsamer XP-Fortschritt</span>
                    </span>
                    <span className="font-bold text-[#D46A43]">
                      {cb.xp} XP (Lvl {cbLevel})
                    </span>
                  </div>

                  <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#E0D8CC]">
                    <div
                      className="bg-gradient-to-r from-[#F2C94C] to-[#D46A43] h-full rounded-full transition-all duration-500"
                      style={{ width: `${xpInfo.percent}%` }}
                    />
                  </div>
                </div>

                {/* Members list */}
                <div>
                  <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider block mb-2">
                    Mitglieder ({members.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {members.map(m => (
                      <div
                        key={m.id}
                        className="bg-[#FDFCF8] border border-[#E0D8CC] px-2.5 py-1 rounded-2xl flex items-center gap-2 text-xs text-[#2D3047]"
                      >
                        <img
                          src={m.avatarUrl}
                          alt={m.displayName || m.username}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-semibold">{m.displayName || m.username}</span>
                        {m.id === cb.ownerId && (
                          <span className="text-[9px] bg-[#F2C94C] text-white px-1.5 rounded-md font-bold">
                            Gründer
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent shared log activity */}
                <div className="pt-2 border-t border-[#E0D8CC] flex items-center justify-between">
                  <span className="text-xs text-[#64748b]">
                    {cbLogs.length} gemeinsame Kocheinträge
                  </span>

                  <button
                    onClick={onOpenCookLogModal}
                    className="bg-[#D46A43] text-white hover:bg-[#c05a38] text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-300" />
                    <span>Gemeinsam kochen</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-dashed border-[#E0D8CC] text-center">
          <span className="text-4xl block mb-2">👥</span>
          <p className="text-base font-bold text-[#2D3047]">
            Kein gemeinsames Kochbuch vorhanden
          </p>
          <p className="text-xs text-[#64748b] mt-1 mb-4">
            Erstelle ein Kochbuch für dich und deine Partner/Freunde oder tritt über einen Einladungscode bei.
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#D46A43] text-white font-bold py-2.5 px-4 rounded-2xl text-xs transition-all shadow-md"
            >
              + Kochbuch erstellen
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFCF8] w-full max-w-md rounded-3xl p-5 shadow-2xl border border-[#E0D8CC] animate-in zoom-in-95 duration-150">
            <h3 className="font-serif italic font-bold text-lg text-[#2D3047] mb-1">
              Neues gemeinsames Kochbuch
            </h3>
            <p className="text-xs text-[#64748b] mb-4">
              Erstelle einen gemeinsamen Bereich mit eigenen Rezepten &amp; eigenem XP-Stand.
            </p>

            {error && (
              <p className="bg-red-50 text-red-700 p-2.5 rounded-xl text-xs font-semibold mb-3">
                {error}
              </p>
            )}

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#2D3047] mb-1 uppercase">
                  Name des Kochbuchs *
                </label>
                <input
                  type="text"
                  required
                  value={newCbName}
                  onChange={(e) => setNewCbName(e.target.value)}
                  placeholder="z. B. WG-Gourmetküche"
                  className="w-full bg-white border border-[#E0D8CC] rounded-2xl px-3.5 py-2 text-sm text-[#2D3047] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D3047] mb-1 uppercase">
                  Beschreibung
                </label>
                <textarea
                  rows={2}
                  value={newCbDesc}
                  onChange={(e) => setNewCbDesc(e.target.value)}
                  placeholder="Worauf habt ihr kulinarisch Lust?"
                  className="w-full bg-white border border-[#E0D8CC] rounded-2xl px-3.5 py-2 text-sm text-[#2D3047] outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-white border border-[#E0D8CC] text-[#2D3047] font-bold py-2.5 rounded-2xl text-xs"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#D46A43] text-white font-bold py-2.5 rounded-2xl text-xs shadow-md"
                >
                  Erstellen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFCF8] w-full max-w-md rounded-3xl p-5 shadow-2xl border border-[#E0D8CC] animate-in zoom-in-95 duration-150">
            <h3 className="font-serif italic font-bold text-lg text-[#2D3047] mb-1">
              Kochbuch beitreten
            </h3>
            <p className="text-xs text-[#64748b] mb-4">
              Gib den Einladungscode deines Partners or der WG ein (z. B. KOCH-2026).
            </p>

            {error && (
              <p className="bg-red-50 text-red-700 p-2.5 rounded-xl text-xs font-semibold mb-3">
                {error}
              </p>
            )}

            <form onSubmit={handleJoin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#2D3047] mb-1 uppercase">
                  Einladungscode *
                </label>
                <input
                  type="text"
                  required
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="z. B. KOCH-2026"
                  className="w-full bg-white border border-[#E0D8CC] rounded-2xl px-3.5 py-2 text-sm text-[#2D3047] font-mono tracking-widest text-center uppercase font-bold outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 bg-white border border-[#E0D8CC] text-[#2D3047] font-bold py-2.5 rounded-2xl text-xs"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#D46A43] text-white font-bold py-2.5 rounded-2xl text-xs shadow-md"
                >
                  Beitreten
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { AvatarFrame } from './AvatarFrame';
import { AVATAR_FRAMES, calculateLevel, xpForNextLevel } from '../data/constants';
import { Trophy, Sparkles, Award, CheckCircle2, Lock, Flame, Shield, Star, Info } from 'lucide-react';

interface GamificationViewProps {
  currentUser: User;
  onUserUpdated: (updatedUser: User) => void;
}

export const GamificationView: React.FC<GamificationViewProps> = ({
  currentUser,
  onUserUpdated
}) => {
  const currentLevel = calculateLevel(currentUser.xp);
  const xpInfo = xpForNextLevel(currentUser.xp);
  const badges = StorageService.getMilestoneBadges(currentUser.id);

  const handleSelectFrame = (frameId: string) => {
    const frame = AVATAR_FRAMES.find(f => f.id === frameId);
    if (!frame || currentLevel < frame.minLevel) return;

    const updated = { ...currentUser, frameId };
    StorageService.updateUser(updated);
    onUserUpdated(updated);
  };

  return (
    <div className="space-y-4 pb-1">
      
      {/* Level Card */}
      <div className="bg-gradient-to-br from-[#D46A43] via-[#c05a38] to-[#2D3047] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden text-center">
        <div className="relative z-10 flex flex-col items-center">
          
          {/* Avatar with selected frame */}
          <div className="mb-3">
            <AvatarFrame
              avatarUrl={currentUser.avatarUrl}
              frameId={currentUser.frameId}
              username={currentUser.username}
              size="xl"
            />
          </div>

          <h2 className="font-serif italic font-extrabold text-2xl">
            {currentUser.username}
          </h2>
          <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/40 px-3 py-1 rounded-full text-xs font-bold text-amber-200 my-2">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>Sternekoch Level {currentLevel}</span>
          </div>

          {/* XP Progress */}
          <div className="w-full max-w-xs mt-3 bg-black/20 p-3 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center text-xs text-amber-100 font-semibold mb-1">
              <span>{currentUser.xp} XP Gesamt</span>
              <span>Level {currentLevel + 1} ({xpInfo.currentXPInLevel} / {xpInfo.neededXP} XP)</span>
            </div>
            <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden border border-white/20">
              <div
                className="bg-gradient-to-r from-amber-400 to-amber-200 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${xpInfo.percent}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Profile Picture Frames Selection */}
      <div className="bg-white p-5 rounded-3xl border border-[#E0D8CC] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif italic font-bold text-base text-[#2D3047] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D46A43]" />
              <span>Profilbild-Rahmen</span>
            </h3>
            <p className="text-xs text-[#64748b]">
              Schalte neue dekorative Rahmen durch Level-Aufstiege frei!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          {AVATAR_FRAMES.map(frame => {
            const isUnlocked = currentLevel >= frame.minLevel;
            const isSelected = currentUser.frameId === frame.id;

            return (
              <button
                key={frame.id}
                onClick={() => handleSelectFrame(frame.id)}
                disabled={!isUnlocked}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#F2EDE4] border-[#D46A43] ring-2 ring-[#D46A43]/30 shadow-sm'
                    : isUnlocked
                    ? 'bg-[#FDFCF8] hover:bg-[#E0D8CC] border-[#E0D8CC]'
                    : 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <AvatarFrame
                    avatarUrl={currentUser.avatarUrl}
                    frameId={frame.id}
                    username={currentUser.username}
                    size="sm"
                    showBadge={false}
                  />
                  {isSelected ? (
                    <span className="text-[10px] font-bold bg-[#D46A43] text-white px-2 py-0.5 rounded-full">
                      Aktiv
                    </span>
                  ) : isUnlocked ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Frei
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      Lvl {frame.minLevel}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-xs text-[#2D3047] truncate">
                    {frame.name}
                  </h4>
                  <p className="text-[10px] text-[#64748b] line-clamp-2 mt-0.5">
                    {frame.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Milestone Badges */}
      <div className="bg-white p-5 rounded-3xl border border-[#E0D8CC] shadow-sm space-y-3">
        <div>
          <h3 className="font-serif italic font-bold text-base text-[#2D3047] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#F2C94C]" />
            <span>Meilenstein-Erfolge</span>
          </h3>
          <p className="text-xs text-[#64748b]">
            Erreiche Meilensteine durch fleißiges Kochen &amp; Dokumentieren.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                badge.unlocked
                  ? 'bg-gradient-to-r from-[#F2C94C]/60 to-[#F2C94C]/30 border-[#F2C94C]'
                  : 'bg-[#FDFCF8] border-[#E0D8CC]'
              }`}
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                badge.unlocked ? 'bg-[#F2C94C] text-white shadow-sm' : 'bg-gray-200 opacity-60'
              }`}>
                {badge.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-[#2D3047] truncate">
                    {badge.title}
                  </h4>
                  {badge.unlocked && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-[#64748b] line-clamp-1 mt-0.5">
                  {badge.description}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-black/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-[#D46A43] h-full rounded-full transition-all"
                    style={{ width: `${badge.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules Overview */}
      <div className="bg-[#F2EDE4] p-4 rounded-3xl border border-[#E0D8CC] text-xs text-[#2D3047] space-y-2">
        <h4 className="font-bold text-sm text-[#2D3047] flex items-center gap-1.5">
          <Info className="w-4 h-4 text-[#D46A43]" />
          <span>Wie sammle ich XP?</span>
        </h4>
        <ul className="space-y-1 list-disc list-inside text-[#64748b]">
          <li><strong>+10 XP:</strong> Für jeden erfassen Kocheintrag.</li>
          <li><strong>+5 XP Bonus:</strong> Wenn Foto, Sterne-Bewertung und Notiz ausgefüllt sind.</li>
          <li><strong>+15 XP Bonus:</strong> Wenn du ein Rezept zum allerersten Mal gekocht hast!</li>
          <li><strong>Level-Formel:</strong> Level = floor(XP ÷ 100) + 1.</li>
        </ul>
      </div>

    </div>
  );
};

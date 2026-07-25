import React, { useState } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { AvatarFrame } from './AvatarFrame';
import { UtensilsCrossed, ChevronDown, Plus, Download, LogIn, UserPlus } from 'lucide-react';
import { calculateLevel, xpForNextLevel } from '../data/constants';

interface HeaderNavProps {
  currentUser: User;
  onUserChange: (user: User) => void;
  onOpenPwaModal: () => void;
  onOpenAuthModal: () => void;
  onGoHome: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentUser,
  onUserChange,
  onOpenPwaModal,
  onOpenAuthModal,
  onGoHome
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const users = StorageService.getUsers();

  const currentLevel = calculateLevel(currentUser.xp);
  const xpInfo = xpForNextLevel(currentUser.xp);

  const handleSelectUser = (user: User) => {
    StorageService.setCurrentUser(user.id);
    onUserChange(user);
    setDropdownOpen(false);
  };

  const isEndsWithS = currentUser.username.toLowerCase().endsWith('s');
  const userNameDisplay = isEndsWithS ? `${currentUser.username}'` : `${currentUser.username}s`;

  return (
    <header className="sticky top-0 z-40 bg-[#FDFCF8]/90 backdrop-blur-md border-b border-[#E0D8CC] px-4 py-3 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* Brand Title */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform"
          onClick={onGoHome}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D46A43] to-[#c05a38] text-white flex items-center justify-center shadow-md shadow-[#D46A43]/20 shrink-0">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <p className="text-[11px] font-medium text-[#64748b] uppercase tracking-wider leading-none mb-0.5">
              {userNameDisplay}
            </p>
            <h1 className="font-serif italic font-bold text-lg text-[#2D3047] leading-tight tracking-tight">
              Kochbuch
            </h1>
          </div>
        </div>

        {/* Right side: Level pill & User Switcher */}
        <div className="flex items-center gap-2">
          
          {/* PWA Install Button */}
          <button
            onClick={onOpenPwaModal}
            className="p-2 rounded-xl bg-[#F2EDE4] text-[#2D3047] hover:bg-[#E0D8CC] active:scale-95 transition-all"
            title="App auf iPhone / Smartphone installieren"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* User Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-[#F2EDE4]/50 hover:bg-[#E0D8CC] border border-[#E0D8CC] pl-2 pr-2.5 py-1 rounded-full transition-all active:scale-95"
            >
              <AvatarFrame
                avatarUrl={currentUser.avatarUrl}
                frameId={currentUser.frameId}
                username={currentUser.username}
                size="sm"
                showBadge={false}
              />
              <div className="text-left hidden sm:block">
                <span className="text-xs font-semibold text-[#2D3047] block leading-none">
                  {currentUser.username}
                </span>
                <span className="text-[10px] font-bold text-[#c05a38]">
                  Lvl {currentLevel}
                </span>
              </div>
              <span className="bg-[#D46A43] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                Lvl {currentLevel}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#64748b] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E0D8CC] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-[#E0D8CC] mb-1">
                  <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                    Aktiver Nutzer
                  </p>
                  <p className="text-sm font-bold text-[#2D3047]">
                    {currentUser.username} ({currentUser.xp} XP)
                  </p>
                  {/* XP Bar */}
                  <div className="w-full bg-[#E0D8CC] h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#F2C94C] to-[#D46A43] h-full rounded-full transition-all"
                      style={{ width: `${xpInfo.percent}%` }}
                    />
                  </div>
                </div>

                <p className="px-3 py-1 text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                  Konto wechseln
                </p>

                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleSelectUser(u)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                        u.id === currentUser.id
                          ? 'bg-[#F2EDE4] text-[#D46A43] font-semibold'
                          : 'hover:bg-[#FDFCF8] text-[#2D3047]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <AvatarFrame
                          avatarUrl={u.avatarUrl}
                          frameId={u.frameId}
                          username={u.username}
                          size="sm"
                          showBadge={false}
                        />
                        <span className="text-xs">{u.username}</span>
                      </div>
                      <span className="text-[10px] font-bold bg-[#E0D8CC] text-[#2D3047] px-1.5 py-0.5 rounded-md">
                        Lvl {calculateLevel(u.xp)}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-[#E0D8CC] mt-2 pt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenAuthModal();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-[#D46A43] font-semibold hover:bg-[#FDFCF8] transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Neuen Account anlegen</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

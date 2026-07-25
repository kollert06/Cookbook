import React from 'react';
import { AVATAR_FRAMES } from '../data/constants';

interface AvatarFrameProps {
  avatarUrl: string;
  frameId: string;
  username: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  className?: string;
}

export const AvatarFrame: React.FC<AvatarFrameProps> = ({
  avatarUrl,
  frameId,
  username,
  size = 'md',
  showBadge = true,
  className = ''
}) => {
  const frame = AVATAR_FRAMES.find(f => f.id === frameId) || AVATAR_FRAMES[0];

  const sizeClasses = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg'
  };

  const badgeSizeClasses = {
    sm: 'w-4 h-4 text-[10px] -bottom-0.5 -right-0.5',
    md: 'w-5 h-5 text-xs -bottom-1 -right-1',
    lg: 'w-7 h-7 text-sm -bottom-1 -right-1',
    xl: 'w-9 h-9 text-base -bottom-1 -right-1'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`relative rounded-full overflow-hidden transition-all duration-300 ${sizeClasses[size]} ${frame.borderClass} ${frame.glowClass || ''}`}
      >
        <img
          src={avatarUrl}
          alt={username}
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback avatar if URL fails
            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}`;
          }}
        />
      </div>

      {showBadge && frame.badgeSymbol && (
        <div
          className={`absolute rounded-full bg-white border border-[#F2EDE4] shadow-md flex items-center justify-center font-bold z-10 ${badgeSizeClasses[size]}`}
          title={frame.name}
        >
          {frame.badgeSymbol}
        </div>
      )}
    </div>
  );
};

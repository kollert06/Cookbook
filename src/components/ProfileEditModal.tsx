import React, { useState, useRef } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { X, Camera, Save } from 'lucide-react';
import { AvatarFrame } from './AvatarFrame';

interface ProfileEditModalProps {
  currentUser: User;
  onClose: () => void;
  onUpdate: (user: User) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ currentUser, onClose, onUpdate }) => {
  const [displayName, setDisplayName] = useState(currentUser.displayName || currentUser.username);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Das Bild ist zu groß (max. 5MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarUrl(dataUrl);
          setError('');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      setError('Anzeigename darf nicht leer sein.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const updatedUser = {
        ...currentUser,
        displayName: displayName.trim(),
        avatarUrl
      };
      await StorageService.updateUser(updatedUser);
      onUpdate(updatedUser);
    } catch (err: any) {
      setError(err.message || 'Fehler beim Speichern des Profils.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FDFCF8] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-[#E0D8CC] relative animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#E0D8CC] text-[#2D3047] flex items-center justify-center hover:bg-[#E0D8CC]"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-serif italic font-extrabold text-xl text-[#2D3047] mb-4 text-center">
          Profil bearbeiten
        </h3>

        {error && (
          <p className="bg-red-50 text-red-700 p-2.5 rounded-xl text-xs font-semibold mb-4 text-center">
            {error}
          </p>
        )}

        <div className="flex flex-col items-center mb-6">
          <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
            <AvatarFrame 
              avatarUrl={avatarUrl} 
              frameId={currentUser.frameId} 
              username={displayName}
              size="lg"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <p className="text-xs text-[#64748b] mt-2 text-center">Auf das Bild tippen, um es zu ändern</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2D3047] mb-1 uppercase">
              Anzeigename
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Dein Anzeigename"
              className="w-full bg-white border border-[#E0D8CC] rounded-2xl px-4 py-2.5 text-sm text-[#2D3047] outline-none focus:border-[#D46A43]"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-[#D46A43] hover:bg-[#c05a38] text-white font-bold py-3 rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Speichern
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

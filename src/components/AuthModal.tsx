import React, { useState } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { X, UserPlus, LogIn, Lock, User as UserIcon, Mail } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onAuthenticated: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onAuthenticated
}) => {
  const [isRegister, setIsRegister] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Bitte einen Benutzernamen eingeben.');
      return;
    }
    if (!password.trim()) {
      setError('Bitte ein Passwort eingeben.');
      return;
    }

    if (isRegister) {
      StorageService.registerUser(username.trim(), email.trim()).then(user => {
        onAuthenticated(user);
      }).catch(err => {
        setError(err.message || 'Registration failed');
      });
    } else {
      StorageService.getUsers().then(users => {
        const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
        if (!user) {
          setError('Benutzername nicht gefunden.');
          return;
        }
        StorageService.setCurrentUser(user.id);
        onAuthenticated(user);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FDFCF8] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-[#E0D8CC] animate-in zoom-in-95 duration-150 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#E0D8CC] text-[#2D3047] flex items-center justify-center hover:bg-[#E0D8CC]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#D46A43] text-white flex items-center justify-center mx-auto mb-2 shadow-md">
            {isRegister ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
          </div>
          <h3 className="font-serif italic font-extrabold text-xl text-[#2D3047]">
            {isRegister ? 'Konto erstellen' : 'Anmelden'}
          </h3>
          <p className="text-xs text-[#64748b] mt-0.5">
            {isRegister ? 'Keine E-Mail-Pflicht. Sofort loslegen!' : 'Mit deinem Benutzernamen anmelden'}
          </p>
        </div>

        {error && (
          <p className="bg-red-50 text-red-700 p-2.5 rounded-xl text-xs font-semibold mb-3 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#2D3047] mb-1 uppercase">
              Benutzername *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Dein Koch-Name (z. B. Timo)"
                className="w-full bg-white border border-[#E0D8CC] rounded-2xl pl-9 pr-3.5 py-2 text-sm text-[#2D3047] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D3047] mb-1 uppercase">
              Passwort *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-[#E0D8CC] rounded-2xl pl-9 pr-3.5 py-2 text-sm text-[#2D3047] outline-none"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-[#2D3047] mb-1 uppercase">
                E-Mail (Optional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Optional für Passwort-Reset"
                  className="w-full bg-white border border-[#E0D8CC] rounded-2xl pl-9 pr-3.5 py-2 text-sm text-[#2D3047] outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#D46A43] hover:bg-[#c05a38] text-white font-bold py-3 rounded-2xl text-xs shadow-md transition-all mt-2"
          >
            {isRegister ? 'Jetzt registrieren' : 'Anmelden'}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-[#E0D8CC] text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs font-bold text-[#D46A43] hover:underline"
          >
            {isRegister ? 'Bereits ein Konto? Hier anmelden' : 'Neues Konto erstellen'}
          </button>
        </div>

      </div>
    </div>
  );
};

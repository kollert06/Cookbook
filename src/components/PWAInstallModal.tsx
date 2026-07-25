import React from 'react';
import { X, Share, PlusSquare, Smartphone, CheckCircle } from 'lucide-react';

interface PWAInstallModalProps {
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FDFCF8] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-[#E0D8CC] relative animate-in zoom-in-95 duration-150">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#E0D8CC] text-[#2D3047] flex items-center justify-center hover:bg-[#E0D8CC]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#D46A43] to-[#c05a38] text-white flex items-center justify-center mx-auto mb-2 shadow-md">
            <Smartphone className="w-7 h-7" />
          </div>
          <h3 className="font-serif italic font-extrabold text-xl text-[#2D3047]">
            App auf iPhone installieren
          </h3>
          <p className="text-xs text-[#64748b] mt-1">
            Installiere die Kochbuch App als eigenständige PWA direkt auf deinem Homescreen.
          </p>
        </div>

        <div className="bg-[#F2EDE4] p-4 rounded-2xl border border-[#E0D8CC] space-y-3 text-xs text-[#2D3047]">
          <div className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#D46A43] text-white font-bold flex items-center justify-center text-xs shrink-0">
              1
            </span>
            <p>
              Tippe unten in Safari auf das <strong className="inline-flex items-center gap-1 font-bold"><Share className="w-3.5 h-3.5 text-[#D46A43]" /> Teilen-Symbol</strong>.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#D46A43] text-white font-bold flex items-center justify-center text-xs shrink-0">
              2
            </span>
            <p>
              Scrolle im Menü nach unten und wähle <strong className="inline-flex items-center gap-1 font-bold"><PlusSquare className="w-3.5 h-3.5 text-[#D46A43]" /> „Zum Home-Bildschirm“</strong>.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#D46A43] text-white font-bold flex items-center justify-center text-xs shrink-0">
              3
            </span>
            <p>
              Bestätige oben rechts mit <strong className="font-bold text-[#D46A43]">„Hinzufügen“</strong> – fertig!
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#D46A43] hover:bg-[#c05a38] text-white font-bold py-3 rounded-2xl text-xs shadow-md transition-all mt-4"
        >
          Alles klar
        </button>

      </div>
    </div>
  );
};

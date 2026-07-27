import React, { useState, useEffect } from 'react';
import { Recipe, SharedCookbook, CookLog } from '../types';
import { StorageService } from '../services/storage';
import { HalfStarRating } from './HalfStarRating';
import { X, Camera, Sparkles, Check, Image as ImageIcon, Flame } from 'lucide-react';
import { getLocalDateString } from '../data/constants';

interface CookLogModalProps {
  recipes: Recipe[];
  sharedCookbooks: SharedCookbook[];
  preselectedRecipeId?: string;
  cookLogToEdit?: CookLog | null;
  onClose: () => void;
  onSaved: (result: { log: CookLog; xpBreakdown: { base: number; completeBonus: number; firstTimeBonus: number; total: number } }) => void;
}

const SAMPLE_LOG_PHOTOS = [
  'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800'
];

export const CookLogModal: React.FC<CookLogModalProps> = ({
  recipes,
  sharedCookbooks,
  preselectedRecipeId,
  cookLogToEdit,
  onClose,
  onSaved
}) => {
  const today = getLocalDateString();
  
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(
    cookLogToEdit ? cookLogToEdit.recipeId : (preselectedRecipeId || (recipes[0]?.id || 'custom'))
  );
  
  const [customRecipeTitle, setCustomRecipeTitle] = useState(() => {
    if (cookLogToEdit) return cookLogToEdit.recipeTitle;
    if (preselectedRecipeId) {
      return recipes.find(r => r.id === preselectedRecipeId)?.title || '';
    }
    return recipes[0]?.title || '';
  });
  const [date, setDate] = useState(cookLogToEdit ? cookLogToEdit.date : today);
  const [rating, setRating] = useState<number>(cookLogToEdit ? cookLogToEdit.rating : 4.5);
  const [comment, setComment] = useState(cookLogToEdit ? cookLogToEdit.comment : '');
  const [photos, setPhotos] = useState<string[]>(cookLogToEdit ? cookLogToEdit.photos : []);
  const [sharedCookbookId, setSharedCookbookId] = useState<string>(cookLogToEdit?.sharedCookbookId || '');
  const [portions, setPortions] = useState<number>(cookLogToEdit?.portions || 2);
  const [recipeText, setRecipeText] = useState<string>(() => {
    if (cookLogToEdit) return cookLogToEdit.recipeText || '';
    const initialRecipeId = preselectedRecipeId || (recipes[0]?.id || 'custom');
    if (initialRecipeId !== 'custom') {
      const r = recipes.find(rec => rec.id === initialRecipeId);
      if (r) {
        return `Zutaten:\n${r.ingredients}\n\nZubereitung:\n${r.preparation}`;
      }
    }
    return '';
  });
  
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showSamplePicker, setShowSamplePicker] = useState(false);
  const [error, setError] = useState('');

  // Calculate live preview of XP
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hasCookedBefore, setHasCookedBefore] = useState(false);

  useEffect(() => {
    async function load() {
      const user = await StorageService.getCurrentUser();
      setCurrentUser(user);
      if (user && selectedRecipeId !== 'custom') {
        const logs = await StorageService.getCookLogs();
        setHasCookedBefore(logs.some(l => l.userId === user.id && l.recipeId === selectedRecipeId));
      } else {
        setHasCookedBefore(false);
      }
    }
    load();
  }, [selectedRecipeId]);

  const baseXP = 10;
  const isComplete = photos.length > 0 && rating >= 0 && comment.trim().length > 0;
  const completeBonus = isComplete ? 5 : 0;
  const firstTimeBonus = (!hasCookedBefore && selectedRecipeId !== 'custom') ? 15 : 0;
  const liveTotalXP = baseXP + completeBonus + firstTimeBonus;

  const handleAddPhotoUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (photos.length >= 3) {
      setError('Maximal 3 Fotos pro Kocheintrag erlaubt.');
      return;
    }
    setPhotos([...photos, imageUrlInput.trim()]);
    setImageUrlInput('');
    setError('');
  };

  const handleAddSamplePhoto = (url: string) => {
    if (photos.length >= 3) {
      setError('Maximal 3 Fotos pro Kocheintrag erlaubt.');
      return;
    }
    setPhotos([...photos, url]);
    setShowSamplePicker(false);
    setError('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 3) {
      setError('Maximal 3 Fotos pro Kocheintrag erlaubt.');
      return;
    }

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotos(prev => [...prev, uploadEvent.target!.result as string].slice(0, 3));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let recipeTitle = '';
    let rId = selectedRecipeId;

    if (!customRecipeTitle.trim()) {
      setError('Bitte gib den Namen des Gerichts ein.');
      return;
    }
    recipeTitle = customRecipeTitle.trim();

    if (selectedRecipeId === 'custom') {
      rId = `custom_${Date.now()}`;
    } else {
      const found = recipes.find(r => r.id === selectedRecipeId);
      if (!found) {
        setError('Bitte wähle ein gültiges Rezept aus.');
        return;
      }
      if (!sharedCookbookId && found.sharedCookbookId) {
        // Inherit recipe's shared cookbook
        setSharedCookbookId(found.sharedCookbookId);
      }
    }

    if (cookLogToEdit) {
      const updatedLog = await StorageService.updateCookLog(cookLogToEdit.id, {
        recipeId: rId,
        recipeTitle,
        date,
        photos,
        rating,
        comment: comment.trim(),
        portions,
        recipeText,
        sharedCookbookId: sharedCookbookId || null
      });
      if (updatedLog) {
        onSaved({
          log: updatedLog,
          xpBreakdown: { base: 0, completeBonus: 0, firstTimeBonus: 0, total: 0 } // No new XP for editing
        });
      }
      return;
    }

    const result = await StorageService.createCookLog({
      recipeId: rId,
      recipeTitle,
      date,
      photos,
      rating,
      comment: comment.trim(),
      portions,
      recipeText,
      sharedCookbookId: sharedCookbookId || null
    });

    onSaved(result);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-[#FDFCF8] w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E0D8CC] max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0D8CC] bg-gradient-to-r from-[#F2EDE4] to-[#E0D8CC]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#D46A43] text-white flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif italic font-bold text-lg text-[#2D3047]">
                {cookLogToEdit ? 'Kocheintrag bearbeiten' : 'Kocheintrag erfassen'}
              </h2>
              <p className="text-xs text-[#64748b]">
                Halte dein Gericht fest und sammle XP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#2D3047] flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="bg-[#fef2f2] text-[#991b1b] border border-[#fecaca] px-4 py-2.5 rounded-2xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Recipe Link Selector */}
          <div>
            <label className="block text-xs font-bold text-[#2D3047] mb-1 uppercase tracking-wider">
              Gekochtes Rezept auswählen
            </label>
            <select
              value={selectedRecipeId}
              onChange={(e) => {
                const newId = e.target.value;
                setSelectedRecipeId(newId);
                if (newId === 'custom') {
                  setCustomRecipeTitle('');
                  setSharedCookbookId('');
                  setRecipeText('');
                } else {
                  const recipe = recipes.find(r => r.id === newId);
                  if (recipe) {
                    setCustomRecipeTitle(recipe.title);
                    setRecipeText(`Zutaten:\n${recipe.ingredients}\n\nZubereitung:\n${recipe.preparation}`);
                    if (recipe.sharedCookbookId) {
                      setSharedCookbookId(recipe.sharedCookbookId);
                    }
                  }
                }
              }}
              className="w-full bg-white border border-[#E0D8CC] focus:border-[#D46A43] rounded-2xl px-4 py-2.5 text-sm text-[#2D3047] outline-none transition-all"
            >
              {recipes.map(r => (
                <option key={r.id} value={r.id}>
                  📖 {r.title}
                </option>
              ))}
              <option value="custom">✏️ Spontanes Gericht / Neues Freitext-Gericht</option>
            </select>
          </div>

          {/* Custom Dish Title */}
          <div>
            <label className="block text-xs font-bold text-[#2D3047] mb-1 uppercase tracking-wider">
              Name des Gerichts *
            </label>
            <input
              type="text"
              value={customRecipeTitle}
              onChange={(e) => setCustomRecipeTitle(e.target.value)}
              placeholder="z. B. Spontane Gemüse-Pfanne"
              className="w-full bg-white border border-[#E0D8CC] focus:border-[#D46A43] rounded-2xl px-4 py-2.5 text-sm text-[#2D3047] outline-none"
            />
          </div>

          {/* Portions & Recipe Adjustment */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-[#2D3047] mb-1 uppercase tracking-wider">
                Portionen / Personen
              </label>
              <input
                type="number"
                min="1"
                value={portions}
                onChange={(e) => setPortions(parseInt(e.target.value) || 2)}
                className="w-full bg-white border border-[#E0D8CC] focus:border-[#D46A43] rounded-2xl px-4 py-2.5 text-sm text-[#2D3047] outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-[#2D3047] mb-1 uppercase tracking-wider">
              Zutaten / Rezept für diesen Eintrag anpassen (Optional)
            </label>
            <textarea
              rows={4}
              value={recipeText}
              onChange={(e) => setRecipeText(e.target.value)}
              placeholder="z.B. Mehr Salz verwendet, 3 statt 2 Paprika..."
              className="w-full bg-white border border-[#E0D8CC] focus:border-[#D46A43] rounded-2xl px-4 py-2.5 text-sm text-[#2D3047] outline-none"
            />
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-xs font-bold text-[#2D3047] mb-1 uppercase tracking-wider">
              Koch-Datum
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white border border-[#E0D8CC] focus:border-[#D46A43] rounded-2xl px-4 py-2.5 text-sm text-[#2D3047] outline-none"
            />
          </div>

          {/* Shared Cookbook Option */}
          {sharedCookbooks.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-[#2D3047] mb-1 uppercase tracking-wider">
                Gemeinsames Kochbuch (optional)
              </label>
              <select
                value={sharedCookbookId}
                onChange={(e) => setSharedCookbookId(e.target.value)}
                className="w-full bg-white border border-[#E0D8CC] focus:border-[#D46A43] rounded-2xl px-4 py-2.5 text-sm text-[#2D3047] outline-none"
              >
                <option value="">🔒 Nur in meinem persönlichen Kalender</option>
                {sharedCookbooks.map(cb => (
                  <option key={cb.id} value={cb.id}>
                    👥 {cb.name} (Erscheint bei allen Mitgliedern)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 5-Star Rating with Half Stars */}
          <div>
            <label className="block text-xs font-bold text-[#2D3047] mb-1.5 uppercase tracking-wider">
              Geschmacks-Bewertung (0 bis 5.0 Sterne)
            </label>
            <div className="bg-white p-3 rounded-2xl border border-[#E0D8CC] flex items-center justify-between">
              <HalfStarRating
                value={rating}
                onChange={(val) => setRating(val)}
                size="lg"
              />
            </div>
          </div>

          {/* Photos (up to 3) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#2D3047] uppercase tracking-wider">
                Fotos des fertigen Gerichts ({photos.length}/3)
              </label>
              <button
                type="button"
                onClick={() => setShowSamplePicker(!showSamplePicker)}
                className="text-xs text-[#D46A43] font-semibold hover:underline flex items-center gap-1"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Musterfoto wählen</span>
              </button>
            </div>

            {/* Photo Previews */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {photos.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-[#E0D8CC]">
                    <img src={url} alt={`Teller Foto ${i+1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(i)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showSamplePicker && (
              <div className="bg-[#F2EDE4] p-3 rounded-2xl mb-3 border border-[#E0D8CC]">
                <p className="text-xs font-bold text-[#2D3047] mb-2">Beispielfoto aus der Galerie:</p>
                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_LOG_PHOTOS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddSamplePhoto(url)}
                      className="aspect-square rounded-xl overflow-hidden border border-white hover:ring-2 hover:ring-[#D46A43]"
                    >
                      <img src={url} alt="Food sample" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {photos.length < 3 && (
              <div className="space-y-2">
                <label className="cursor-pointer bg-white border border-dashed border-[#D46A43]/50 hover:bg-[#FDFCF8] text-[#D46A43] px-3 py-2.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold transition-all">
                  <Camera className="w-4 h-4" />
                  <span>Foto aufnehmen / hochladen</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Bild-URL einfügen"
                    className="flex-1 bg-white border border-[#E0D8CC] rounded-2xl px-3 py-2 text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhotoUrl}
                    className="bg-[#E0D8CC] hover:bg-[#E0D8CC] text-[#2D3047] px-3 py-2 rounded-2xl text-xs font-bold"
                  >
                    Hinzufügen
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-[#2D3047] mb-1 uppercase tracking-wider">
              Bemerkung / Notizen zum Gericht
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Wie hat es geschmeckt? Besondere Kniffe or Gewürze?"
              className="w-full bg-white border border-[#E0D8CC] focus:border-[#D46A43] rounded-2xl px-4 py-2.5 text-sm text-[#2D3047] outline-none"
            />
          </div>

          {/* Live XP Calculator Widget */}
          {!cookLogToEdit && (
            <div className="bg-[#E0D8CC] border border-[#e2caa4] p-3.5 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#2D3047] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#F2C94C]" />
                  XP Belohnungs-Vorschau
                </span>
                <span className="text-sm font-extrabold text-[#D46A43] bg-white px-2.5 py-0.5 rounded-full border border-[#E0D8CC]">
                  +{liveTotalXP} XP
                </span>
              </div>
              <div className="space-y-1 text-xs text-[#64748b]">
                <div className="flex justify-between items-center">
                  <span>+10 XP Kocheintrag Basis</span>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="flex justify-between items-center">
                  <span>+5 XP Bonus (Vollständiger Eintrag: Foto + Bewertung + Text)</span>
                  {isComplete ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <span className="text-[10px] text-[#94a3b8]">Ausstehend</span>
                  )}
                </div>
                {firstTimeBonus > 0 && (
                  <div className="flex justify-between items-center font-bold text-[#F2C94C]">
                    <span>+15 XP Bonus (Erstes Mal gekocht!)</span>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#D46A43] to-[#c05a38] hover:from-[#c05a38] hover:to-[#c05a38] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-[#D46A43]/25 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {cookLogToEdit ? (
              <span>Änderungen speichern</span>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Kocheintrag speichern (+{liveTotalXP} XP)</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Recipe, SharedCookbook } from '../types';
import { StorageService } from '../services/storage';
import { X, Camera, Plus, Trash2, Globe, Lock, Image as ImageIcon } from 'lucide-react';

interface RecipeFormModalProps {
  recipeToEdit?: Recipe | null;
  sharedCookbooks: SharedCookbook[];
  onClose: () => void;
  onSaved: (recipe: Recipe) => void;
}

const SAMPLE_FOOD_IMAGES = [
  { label: 'Pasta & Nudeln', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800' },
  { label: 'Risotto / Reis', url: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&q=80&w=800' },
  { label: 'Hähnchen / Fleisch', url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=800' },
  { label: 'Salat & Gemüseschale', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800' },
  { label: 'Suppe & Eintopf', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=800' },
  { label: 'Pizza & Focaccia', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' },
  { label: 'Dessert & Kuchen', url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800' }
];

export const RecipeFormModal: React.FC<RecipeFormModalProps> = ({
  recipeToEdit,
  sharedCookbooks,
  onClose,
  onSaved
}) => {
  const [title, setTitle] = useState(recipeToEdit?.title || '');
  const [ingredients, setIngredients] = useState(recipeToEdit?.ingredients || '');
  const [preparation, setPreparation] = useState(recipeToEdit?.preparation || '');
  const [photos, setPhotos] = useState<string[]>(recipeToEdit?.photos || []);
  const [sharedCookbookId, setSharedCookbookId] = useState<string>(
    recipeToEdit?.sharedCookbookId || ''
  );
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showSamplePicker, setShowSamplePicker] = useState(false);
  const [error, setError] = useState('');

  const handleAddPhotoUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (photos.length >= 5) {
      setError('Maximal 5 Fotos pro Rezept zugelassen.');
      return;
    }
    setPhotos([...photos, imageUrlInput.trim()]);
    setImageUrlInput('');
    setError('');
  };

  const handleAddSamplePhoto = (url: string) => {
    if (photos.length >= 5) {
      setError('Maximal 5 Fotos pro Rezept zugelassen.');
      return;
    }
    setPhotos([...photos, url]);
    setShowSamplePicker(false);
    setError('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 5) {
      setError('Maximal 5 Fotos pro Rezept zugelassen.');
      return;
    }

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotos(prev => [...prev, uploadEvent.target!.result as string].slice(0, 5));
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
    if (!title.trim()) {
      setError('Bitte gib einen Titel für das Rezept ein.');
      return;
    }
    
    const user = await StorageService.getCurrentUser();
    const saved = await StorageService.saveRecipe({
      id: recipeToEdit?.id,
      userId: recipeToEdit?.userId || (user ? user.id : ''),
      title: title.trim(),
      ingredients: ingredients.trim(),
      preparation: preparation.trim(),
      photos,
      sharedCookbookId: sharedCookbookId || null,
      isPrivate: !sharedCookbookId,
    });

    onSaved(saved);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-[#FDFCF8] w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E0D8CC] max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0D8CC] bg-[#F2EDE4]">
          <div>
            <h2 className="font-serif italic font-bold text-lg text-[#2D3047]">
              {recipeToEdit ? 'Rezept bearbeiten' : 'Neues Rezept erstellen'}
            </h2>
            <p className="text-xs text-[#64748b]">
              Einfache Zutatenliste &amp; Zubereitung
            </p>
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

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#2D3047] mb-1 uppercase tracking-wider">
              Titel des Rezepts *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z. B. Cremiges Kürbis-Salbei-Risotto"
              className="w-full bg-white border border-[#E0D8CC] focus:border-[#D46A43] focus:ring-2 focus:ring-[#D46A43]/20 rounded-2xl px-4 py-2.5 text-sm text-[#2D3047] placeholder-[#a89285] outline-none transition-all"
            />
          </div>

          {/* Shared Cookbook Selector */}
          <div>
            <label className="block text-xs font-bold text-[#2D3047] mb-1 uppercase tracking-wider">
              Sichtbarkeit &amp; Kochbuch
            </label>
            <div className="grid grid-cols-1 gap-2">
              <select
                value={sharedCookbookId}
                onChange={(e) => setSharedCookbookId(e.target.value)}
                className="w-full bg-white border border-[#E0D8CC] focus:border-[#D46A43] rounded-2xl px-4 py-2.5 text-sm text-[#2D3047] outline-none transition-all"
              >
                <option value="">🔒 Privat (nur für mich sichtbar)</option>
                {sharedCookbooks.map(cb => (
                  <option key={cb.id} value={cb.id}>
                    👥 Gemeinsam: {cb.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-xs font-bold text-[#2D3047] mb-1 uppercase tracking-wider">
              Zutaten (1 Zeile pro Zutat)
            </label>
            <textarea
              rows={4}
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="z. B.&#10;200g Mehl&#10;2 Eier&#10;1 Prise Salz&#10;200ml Milch"
              className="w-full bg-white border border-[#E0D8CC] focus:border-[#D46A43] focus:ring-2 focus:ring-[#D46A43]/20 rounded-2xl px-4 py-2.5 text-sm text-[#2D3047] placeholder-[#a89285] outline-none transition-all font-mono"
            />
          </div>

          {/* Preparation */}
          <div>
            <label className="block text-xs font-bold text-[#2D3047] mb-1 uppercase tracking-wider">
              Zubereitung (Arbeitsschritte)
            </label>
            <textarea
              rows={5}
              value={preparation}
              onChange={(e) => setPreparation(e.target.value)}
              placeholder="Beschreibe kurz die Zubereitungsschritte..."
              className="w-full bg-white border border-[#E0D8CC] focus:border-[#D46A43] focus:ring-2 focus:ring-[#D46A43]/20 rounded-2xl px-4 py-2.5 text-sm text-[#2D3047] placeholder-[#a89285] outline-none transition-all"
            />
          </div>

          {/* Photos (up to 5) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#2D3047] uppercase tracking-wider">
                Fotos ({photos.length}/5)
              </label>
              <button
                type="button"
                onClick={() => setShowSamplePicker(!showSamplePicker)}
                className="text-xs text-[#D46A43] font-semibold hover:underline flex items-center gap-1"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Beispielfoto wählen</span>
              </button>
            </div>

            {/* Photo Previews */}
            {photos.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mb-3">
                {photos.map((url, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-[#E0D8CC]">
                    <img src={url} alt={`Foto ${i+1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(i)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Sample Photo Picker Modal/Inline */}
            {showSamplePicker && (
              <div className="bg-[#F2EDE4] p-3 rounded-2xl mb-3 border border-[#E0D8CC]">
                <p className="text-xs font-bold text-[#2D3047] mb-2">
                  Schnellauswahl aus unserer Food-Galerie:
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {SAMPLE_FOOD_IMAGES.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddSamplePhoto(img.url)}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-white hover:ring-2 hover:ring-[#D46A43] transition-all"
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] p-1 truncate">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Upload or Image URL inputs */}
            {photos.length < 5 && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <label className="flex-1 cursor-pointer bg-white border border-dashed border-[#D46A43]/50 hover:bg-[#FDFCF8] text-[#D46A43] px-3 py-2.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold transition-all">
                    <Camera className="w-4 h-4" />
                    <span>Foto hochladen</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="oder Bild-URL einfügen (http...)"
                    className="flex-1 bg-white border border-[#E0D8CC] rounded-2xl px-3 py-2 text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhotoUrl}
                    className="bg-[#E0D8CC] hover:bg-[#E0D8CC] text-[#2D3047] px-3 py-2 rounded-2xl text-xs font-bold transition-all"
                  >
                    Hinzufügen
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D46A43] to-[#c05a38] hover:from-[#c05a38] hover:to-[#c05a38] text-white font-bold py-3 px-4 rounded-2xl shadow-lg shadow-[#D46A43]/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>{recipeToEdit ? 'Änderungen speichern' : 'Rezept speichern'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

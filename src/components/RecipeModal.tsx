import React, { useState } from 'react';
import { Recipe } from '../types';
import { X, Flame, Calendar, Users, Edit, Trash2, CheckCircle2 } from 'lucide-react';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onCookThis: (recipeId: string) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipeId: string) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  onClose,
  onCookThis,
  onEdit,
  onDelete
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const ingredientLines = recipe.ingredients
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-[#FDFCF8] w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E0D8CC] max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Photo Banner / Carousel Header */}
        <div className="relative bg-[#2D3047] aspect-video w-full">
          {recipe.photos && recipe.photos.length > 0 ? (
            <>
              <img
                src={recipe.photos[activePhotoIndex]}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              {recipe.photos.length > 1 && (
                <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10">
                  {recipe.photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhotoIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === activePhotoIndex ? 'bg-white w-5' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#D46A43] to-[#2D3047] flex items-center justify-center text-white/50">
              <span>Kein Foto vorhanden</span>
            </div>
          )}

          {/* Floating Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-all z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title Overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-10 text-white">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-[#F2C94C] text-white px-2 py-0.5 rounded-full inline-block mb-1">
              {recipe.sharedCookbookId ? '👥 Gemeinsames Rezept' : '🔒 Privates Rezept'}
            </span>
            <h2 className="font-serif italic font-extrabold text-xl leading-tight">
              {recipe.title}
            </h2>
            <p className="text-xs text-white/80 mt-0.5">
              von {recipe.authorName || 'Dir'} • {recipe.timesCooked || 0}x gekocht
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          
          {/* Ingredients Section */}
          <div className="bg-[#F2EDE4] p-4 rounded-2xl border border-[#E0D8CC]">
            <h3 className="text-xs font-bold text-[#2D3047] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>🥕</span>
              <span>Zutaten ({ingredientLines.length})</span>
            </h3>

            {ingredientLines.length > 0 ? (
              <ul className="space-y-1.5">
                {ingredientLines.map((ing, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#2D3047]">
                    <CheckCircle2 className="w-4 h-4 text-[#D46A43] shrink-0 mt-0.5" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#64748b] italic">Keine Zutaten angegeben.</p>
            )}
          </div>

          {/* Preparation Steps */}
          <div>
            <h3 className="text-xs font-bold text-[#2D3047] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>🍳</span>
              <span>Zubereitung</span>
            </h3>
            {recipe.preparation ? (
              <div className="whitespace-pre-line text-sm text-[#2D3047] leading-relaxed bg-white p-4 rounded-2xl border border-[#E0D8CC]">
                {recipe.preparation}
              </div>
            ) : (
              <p className="text-xs text-[#64748b] italic">Keine Zubereitungsschritte angegeben.</p>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F2EDE4] border-t border-[#E0D8CC] flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(recipe)}
              className="p-2.5 rounded-xl bg-white text-[#2D3047] hover:bg-[#E0D8CC] border border-[#E0D8CC] transition-all"
              title="Rezept bearbeiten"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (confirm('Möchtest du dieses Rezept wirklich löschen?')) {
                  onDelete(recipe.id);
                  onClose();
                }
              }}
              className="p-2.5 rounded-xl bg-white text-red-600 hover:bg-red-50 border border-red-200 transition-all"
              title="Rezept löschen"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onCookThis(recipe.id);
            }}
            className="flex-1 bg-gradient-to-r from-[#D46A43] to-[#c05a38] hover:from-[#c05a38] hover:to-[#c05a38] text-white font-bold py-3 px-4 rounded-2xl shadow-md shadow-[#D46A43]/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Heute gekocht! (+XP)</span>
          </button>
        </div>

      </div>
    </div>
  );
};

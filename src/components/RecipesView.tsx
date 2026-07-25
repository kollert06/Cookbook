import React, { useState } from 'react';
import { Recipe, SharedCookbook } from '../types';
import { Search, Plus, BookOpen, Flame, Users, Lock, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface RecipesViewProps {
  recipes: Recipe[];
  sharedCookbooks: SharedCookbook[];
  onOpenNewRecipeModal: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onCookRecipe: (recipeId: string) => void;
}

export const RecipesView: React.FC<RecipesViewProps> = ({
  recipes,
  sharedCookbooks,
  onOpenNewRecipeModal,
  onSelectRecipe,
  onCookRecipe
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'personal' | string>('all');

  const filteredRecipes = recipes.filter(r => {
    // Search query match
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ingredients.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'personal') {
      return !r.sharedCookbookId;
    }
    if (filterType !== 'all') {
      return r.sharedCookbookId === filterType;
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-1">
      
      {/* Search & Header bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#E0D8CC] shadow-sm space-y-3">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#D46A43]" />
            <h2 className="font-serif italic font-bold text-lg text-[#2D3047]">
              Rezeptbuch ({recipes.length})
            </h2>
          </div>

          <button
            onClick={onOpenNewRecipeModal}
            className="bg-gradient-to-r from-[#D46A43] to-[#c05a38] hover:from-[#c05a38] hover:to-[#c05a38] text-white font-bold py-2 px-3.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-md shadow-[#D46A43]/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Neues Rezept</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rezept oder Zutat suchen (z. B. Kürbis)..."
            className="w-full bg-[#FDFCF8] border border-[#E0D8CC] focus:border-[#D46A43] focus:bg-white rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#2D3047] placeholder-[#94a3b8] outline-none transition-all"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterType === 'all'
                ? 'bg-[#D46A43] text-white shadow-sm'
                : 'bg-[#E0D8CC] text-[#2D3047] hover:bg-[#E0D8CC]'
            }`}
          >
            Alle Rezepte
          </button>
          <button
            onClick={() => setFilterType('personal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
              filterType === 'personal'
                ? 'bg-[#D46A43] text-white shadow-sm'
                : 'bg-[#E0D8CC] text-[#2D3047] hover:bg-[#E0D8CC]'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>Meine Privaten</span>
          </button>
          {sharedCookbooks.map(cb => (
            <button
              key={cb.id}
              onClick={() => setFilterType(cb.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                filterType === cb.id
                  ? 'bg-[#D46A43] text-white shadow-sm'
                  : 'bg-[#E0D8CC] text-[#2D3047] hover:bg-[#E0D8CC]'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>{cb.name}</span>
            </button>
          ))}
        </div>

      </div>

      {/* Recipe List / Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredRecipes.map(recipe => (
            <div
              key={recipe.id}
              className="bg-white rounded-3xl border border-[#E0D8CC] overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Photo Header */}
                <div
                  onClick={() => onSelectRecipe(recipe)}
                  className="relative aspect-video bg-[#F2EDE4] overflow-hidden cursor-pointer"
                >
                  {recipe.photos && recipe.photos.length > 0 ? (
                    <img
                      src={recipe.photos[0]}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#64748b]">
                      <ImageIcon className="w-8 h-8 opacity-40 mb-1" />
                      <span className="text-xs font-semibold">Kein Foto</span>
                    </div>
                  )}

                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    {recipe.sharedCookbookId ? (
                      <span className="bg-[#D46A43] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                        <Users className="w-2.5 h-2.5" />
                        <span>Gemeinsam</span>
                      </span>
                    ) : (
                      <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Privat</span>
                      </span>
                    )}
                  </div>

                  {/* Cook count badge */}
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-[#2D3047] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {recipe.timesCooked || 0}x gekocht
                  </div>
                </div>

                {/* Content */}
                <div onClick={() => onSelectRecipe(recipe)} className="p-4 cursor-pointer">
                  <h3 className="font-serif italic font-bold text-base text-[#2D3047] group-hover:text-[#D46A43] transition-colors leading-snug">
                    {recipe.title}
                  </h3>

                  <p className="text-xs text-[#64748b] mt-1 line-clamp-2">
                    {recipe.ingredients.replace(/\n/g, ' • ')}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-4 pb-4 pt-0 flex items-center justify-between border-t border-[#E0D8CC] mt-2 pt-3">
                <span className="text-[11px] text-[#64748b]">
                  von {recipe.authorName || 'Dir'}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCookRecipe(recipe.id);
                  }}
                  className="bg-[#F2EDE4] hover:bg-[#D46A43] hover:text-white text-[#D46A43] text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 active:scale-95"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Kochen (+XP)</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-dashed border-[#E0D8CC] text-center">
          <span className="text-4xl block mb-2">📖</span>
          <p className="text-base font-bold text-[#2D3047]">Keine Rezepte gefunden</p>
          <p className="text-xs text-[#64748b] mt-1 mb-4">
            {searchQuery ? 'Versuche einen anderen Suchbegriff.' : 'Füge dein erstes Rezept zu deiner Sammlung hinzu!'}
          </p>
          <button
            onClick={onOpenNewRecipeModal}
            className="bg-[#D46A43] text-white font-bold py-2.5 px-4 rounded-2xl text-xs transition-all shadow-md"
          >
            + Erstes Rezept erstellen
          </button>
        </div>
      )}

    </div>
  );
};

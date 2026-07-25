import { User, Recipe, CookLog, SharedCookbook } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_timo',
    username: 'Timo',
    email: 'timo@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    frameId: 'silver',
    xp: 235, // Level 3
    level: 3,
    createdAt: '2026-07-01'
  },
  {
    id: 'usr_anna',
    username: 'Anna',
    email: 'anna@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    frameId: 'bronze',
    xp: 140, // Level 2
    level: 2,
    createdAt: '2026-07-05'
  },
  {
    id: 'usr_marco',
    username: 'Marco',
    email: 'marco@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    frameId: 'none',
    xp: 45, // Level 1
    level: 1,
    createdAt: '2026-07-10'
  }
];

export const INITIAL_SHARED_COOKBOOKS: SharedCookbook[] = [
  {
    id: 'cb_wg_gourmet',
    name: 'WG Kulinarik & Genuss',
    description: 'Unser gemeinsames Kochbuch für gemütliche Kochabende, Feierabend-Gerichte und Sonntagsessen.',
    ownerId: 'usr_timo',
    memberIds: ['usr_timo', 'usr_anna'],
    inviteCode: 'KOCH-2026',
    xp: 180, // Level 2 for shared cookbook
    level: 2,
    createdAt: '2026-07-05'
  }
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec_risotto',
    userId: 'usr_timo',
    authorName: 'Timo',
    title: 'Cremiges Kürbis-Salbei-Risotto',
    ingredients: `300g Carnaroli oder Arborio Risotto-Reis
400g Hokkaido-Kürbis (gewürfelt)
1 Liter warme Gemüsebrühe
150ml trockener Weißwein
1 Schalotte & 2 Knoblauchzehen
80g Parmesan (frisch gerieben)
50g Butter
10 frische Salbeiblätter
Olivenöl, Salz & frisch gemahlener Pfeffer`,
    preparation: `1. Kürbiswürfel im Ofen bei 200°C Ober-/Unterhitze für 20 Minuten weich rösten, danach die Hälfte pürieren.
2. Schalotte und Knoblauch fein würfeln, in Olivenöl glasig dünsten. Risotto-Reis dazugeben und kurz mitanrösten.
3. Mit Weißwein ablöschen und vollständig einkochen lassen.
4. Nach und nach die warme Gemüsebrühe unter ständigem Rühren dazugeben.
5. Nach ca. 15 Minuten das Kürbispüree und die restlichen Kürbiswürfel unterrühren.
6. Sobald der Reis schmelzend al dente ist, Butter, Parmesan und knusprig in Butter angebratene Salbeiblätter unterheben.`,
    photos: [
      'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=800'
    ],
    sharedCookbookId: 'cb_wg_gourmet',
    isPrivate: false,
    createdAt: '2026-07-12',
    timesCooked: 3
  },
  {
    id: 'rec_pasta_truffel',
    userId: 'usr_anna',
    authorName: 'Anna',
    title: 'Frische Tagliatelle mit Trüffelbutter & Parmigiano',
    ingredients: `400g frische Tagliatelle
60g hochwertige Trüffelbutter
100g Parmigiano Reggiano (gerieben)
1 Kelle Nudelwasser
Etwas frische Petersilie
Meersalz & Pfeffer`,
    preparation: `1. Tagliatelle in reichlich gesalzenem Wasser ca. 3-4 Minuten kochen.
2. Trüffelbutter in einer tiefen Pfanne bei geringer Hitze schmelzen.
3. Pasta direkt aus dem Wasser mit etwas Nudelwasser zur Trüffelbutter geben.
4. Parmesan unter schwenkenden Bewegungen einrühren, bis eine schmelzende, emulgierte Sauce entsteht. Mit Pfeffer und Petersilie bestreuen.`,
    photos: [
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800'
    ],
    sharedCookbookId: 'cb_wg_gourmet',
    isPrivate: false,
    createdAt: '2026-07-15',
    timesCooked: 2
  },
  {
    id: 'rec_zitronen_hahnchen',
    userId: 'usr_timo',
    authorName: 'Timo',
    title: 'Zitronen-Rosmarin-Hähnchen aus der Gusseisenpfanne',
    ingredients: `4 Hähnchenschenkel mit Haut
2 Bio-Zitronen (in Scheiben)
4 Zweige frischer Rosmarin & Thymian
6 Knoblauchzehen (andrückt)
500g Drillinge (kleine Kartoffeln)
3 EL Olivenöl
100ml Hühnerbrühe
Flockensalz & schwarzer Pfeffer`,
    preparation: `1. Kartoffeln halbieren und in einer Ofenform oder Gusseisenpfanne mit Olivenöl, Rosmarin und Knoblauch verteilen.
2. Hähnchenschenkel trocken tupfen, kräftig salzen, pfeffern und auf die Kartoffeln legen.
3. Zitronenscheiben darüber verteilen und die Brühe gießen.
4. Bei 200°C Umluft für 45 Minuten im Ofen goldbraun und knusprig backen.`,
    photos: [
      'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=800'
    ],
    sharedCookbookId: null,
    isPrivate: true,
    createdAt: '2026-07-18',
    timesCooked: 1
  }
];

export const INITIAL_COOK_LOGS: CookLog[] = [
  {
    id: 'log_1',
    userId: 'usr_timo',
    userName: 'Timo',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    recipeId: 'rec_risotto',
    recipeTitle: 'Cremiges Kürbis-Salbei-Risotto',
    date: '2026-07-22',
    photos: [
      'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 5.0,
    comment: 'Perfekte Konsistenz! Der krosse Salbei in der Nussbutter macht den Unterschied. Anna war begeistert.',
    sharedCookbookId: 'cb_wg_gourmet',
    xpEarned: {
      base: 10,
      completeBonus: 5,
      firstTimeBonus: 15,
      total: 30
    },
    createdAt: '2026-07-22T19:30:00.000Z'
  },
  {
    id: 'log_2',
    userId: 'usr_anna',
    userName: 'Anna',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    recipeId: 'rec_pasta_truffel',
    recipeTitle: 'Frische Tagliatelle mit Trüffelbutter & Parmigiano',
    date: '2026-07-20',
    photos: [
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.5,
    comment: 'Sehr cremig und geschmackvoll. Nächstes Mal noch etwas mehr Nudelwasser für eine leichtere Emulsion.',
    sharedCookbookId: 'cb_wg_gourmet',
    xpEarned: {
      base: 10,
      completeBonus: 5,
      firstTimeBonus: 15,
      total: 30
    },
    createdAt: '2026-07-20T20:15:00.000Z'
  },
  {
    id: 'log_3',
    userId: 'usr_timo',
    userName: 'Timo',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    recipeId: 'rec_zitronen_hahnchen',
    recipeTitle: 'Zitronen-Rosmarin-Hähnchen aus der Gusseisenpfanne',
    date: '2026-07-18',
    photos: [
      'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.0,
    comment: 'Knusprige Haut, saftiges Fleisch. Die Kartoffeln haben den Zitronensaft gut aufgenommen.',
    sharedCookbookId: null,
    xpEarned: {
      base: 10,
      completeBonus: 5,
      firstTimeBonus: 15,
      total: 30
    },
    createdAt: '2026-07-18T18:45:00.000Z'
  }
];

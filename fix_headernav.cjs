const fs = require('fs');
let code = fs.readFileSync('src/components/HeaderNav.tsx', 'utf-8');

if (!code.includes('onOpenProfileEdit')) {
  code = code.replace(
    'onGoHome: () => void;',
    'onGoHome: () => void;\n  onOpenProfileEdit: () => void;'
  );
  
  code = code.replace(
    'onGoHome\n})',
    'onGoHome,\n  onOpenProfileEdit\n})'
  );

  code = code.replace(
    "import { UtensilsCrossed, ChevronDown, Plus, Download, LogIn, UserPlus } from 'lucide-react';",
    "import { UtensilsCrossed, ChevronDown, Plus, Download, LogIn, UserPlus, Edit3 } from 'lucide-react';"
  );

  code = code.replace(
    '<div className="px-3 py-2 border-b border-[#E0D8CC] mb-1">',
    `<div className="px-3 py-2 border-b border-[#E0D8CC] mb-1 relative">
                  <button onClick={() => { setDropdownOpen(false); onOpenProfileEdit(); }} className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#F2EDE4] hover:bg-[#E0D8CC] text-[#2D3047] transition-colors" title="Profil bearbeiten">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>`
  );
}

fs.writeFileSync('src/components/HeaderNav.tsx', code);

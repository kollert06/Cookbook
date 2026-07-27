const fs = require('fs');
let code = fs.readFileSync('src/components/CookLogModal.tsx', 'utf-8');

if (!code.includes('import { getLocalDateString }')) {
  code = code.replace(
    "import { X, Camera, Sparkles, Check, Image as ImageIcon, Flame } from 'lucide-react';",
    "import { X, Camera, Sparkles, Check, Image as ImageIcon, Flame } from 'lucide-react';\nimport { getLocalDateString } from '../data/constants';"
  );
  fs.writeFileSync('src/components/CookLogModal.tsx', code);
}

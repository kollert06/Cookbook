const fs = require('fs');
let code = fs.readFileSync('src/components/CalendarView.tsx', 'utf-8');

code = code.replace(
  "const isToday = dateStr === new Date().toISOString().split('T')[0];",
  "const isToday = dateStr === getLocalDateString();"
);

if (!code.includes('getLocalDateString')) {
  code = code.replace(
    "import { HalfStarRating",
    "import { getLocalDateString } from '../data/constants';\nimport { HalfStarRating"
  );
}

fs.writeFileSync('src/components/CalendarView.tsx', code);

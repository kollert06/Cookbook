const fs = require('fs');
let code = fs.readFileSync('src/components/CalendarView.tsx', 'utf-8');

code = code.replace(
  "const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Default July 2026",
  "const [currentDate, setCurrentDate] = useState(new Date());"
);

fs.writeFileSync('src/components/CalendarView.tsx', code);

let storageCode = fs.readFileSync('src/services/storage.ts', 'utf-8');
storageCode = storageCode.replace(
  "date: dbLog.date,",
  "date: dbLog.date ? dbLog.date.toString().substring(0, 10) : '',"
);
fs.writeFileSync('src/services/storage.ts', storageCode);

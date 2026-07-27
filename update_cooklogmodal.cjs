const fs = require('fs');
let code = fs.readFileSync('src/components/CookLogModal.tsx', 'utf-8');

// Make handleSubmit async
code = code.replace(
  'const handleSubmit = (e: React.FormEvent) => {',
  'const handleSubmit = async (e: React.FormEvent) => {'
);

// await updateCookLog
code = code.replace(
  'const updatedLog = StorageService.updateCookLog(cookLogToEdit.id, {',
  'const updatedLog = await StorageService.updateCookLog(cookLogToEdit.id, {'
);

// await createCookLog
code = code.replace(
  'const result = StorageService.createCookLog({',
  'const result = await StorageService.createCookLog({'
);

// replace new Date().toISOString().split('T')[0] with getLocalDateString()
code = code.replace(
  "const today = new Date().toISOString().split('T')[0];",
  "const today = getLocalDateString();"
);

// Add import
if (!code.includes('getLocalDateString')) {
  code = code.replace(
    "import { calculateLevel",
    "import { getLocalDateString, calculateLevel"
  );
}

fs.writeFileSync('src/components/CookLogModal.tsx', code);

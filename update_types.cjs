const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf-8');

code = code.replace(
  "  username: string;\n  email?: string;",
  "  username: string;\n  displayName?: string;\n  email?: string;"
);

fs.writeFileSync('src/types.ts', code);

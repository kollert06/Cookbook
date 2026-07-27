const fs = require('fs');
let code = fs.readFileSync('src/services/storage.ts', 'utf-8');

code = code.replace(
  "static async registerUser(username: string, email?: string): Promise<User> {",
  "static async registerUser(username: string, displayName?: string, email?: string): Promise<User> {"
);

code = code.replace(
  "      username,\n      display_name: username,",
  "      username,\n      display_name: displayName?.trim() || username,"
);

fs.writeFileSync('src/services/storage.ts', code);

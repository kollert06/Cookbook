const fs = require('fs');
let code = fs.readFileSync('src/services/storage.ts', 'utf-8');

code = code.replace(
  "    username: dbUser.username,",
  "    username: dbUser.username,\n    displayName: dbUser.display_name || dbUser.username,"
);

// In registerUser
code = code.replace(
  "      username,\n      email: email || null,",
  "      username,\n      display_name: username,\n      email: email || null,"
);

// Fix duplicate username logic in registerUser
code = code.replace(
  /const { data: existing } = await supabase\.from\('users'\)\.select\('\*'\)\.ilike\('username', username\)\.maybeSingle\(\);\s+if \(existing\) \{\s+return mapUser\(existing\);\s+\}/,
  `const { data: existing } = await supabase.from('users').select('*').ilike('username', username).maybeSingle();
    if (existing) {
      throw new Error('Benutzername bereits vergeben. Wähle einen anderen.');
    }`
);

// In updateUser
code = code.replace(
  "      username: updatedUser.username,",
  "      username: updatedUser.username,\n      display_name: updatedUser.displayName,"
);

fs.writeFileSync('src/services/storage.ts', code);

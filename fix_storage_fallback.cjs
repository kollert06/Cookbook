const fs = require('fs');
let code = fs.readFileSync('src/services/storage.ts', 'utf-8');

code = code.replace(
  /const \{ data \} = await supabase\.from\('users'\)\.insert\(\[newUser\]\)\.select\(\)\.single\(\);/,
  `let insertData;
    const { data: d1, error: err1 } = await supabase.from('users').insert([newUser]).select().single();
    if (err1 && err1.code === 'PGRST204') { // Column not found
      // Fallback without display_name
      const fallbackUser = { ...newUser };
      delete fallbackUser.display_name;
      const { data: d2, error: err2 } = await supabase.from('users').insert([fallbackUser]).select().single();
      if (err2) throw err2;
      insertData = d2;
    } else if (err1) {
      throw err1;
    } else {
      insertData = d1;
    }
    const data = insertData;`
);

code = code.replace(
  /await supabase\.from\('users'\)\.update\(\{\s+username: updatedUser\.username,\s+display_name: updatedUser\.displayName,\s+email: updatedUser\.email,\s+avatar_url: updatedUser\.avatarUrl,\s+frame_id: updatedUser\.frameId,\s+xp: updatedUser\.xp,\s+level: updatedUser\.level\s+\}\)\.eq\('id', updatedUser\.id\);/,
  `const updatePayload = {
      username: updatedUser.username,
      display_name: updatedUser.displayName,
      email: updatedUser.email,
      avatar_url: updatedUser.avatarUrl,
      frame_id: updatedUser.frameId,
      xp: updatedUser.xp,
      level: updatedUser.level
    };
    const { error: err1 } = await supabase.from('users').update(updatePayload).eq('id', updatedUser.id);
    if (err1 && err1.code === 'PGRST204') {
      delete updatePayload.display_name;
      const { error: err2 } = await supabase.from('users').update(updatePayload).eq('id', updatedUser.id);
      if (err2) throw err2;
    } else if (err1) {
      throw err1;
    }`
);

fs.writeFileSync('src/services/storage.ts', code);

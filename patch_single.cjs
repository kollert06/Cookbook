const fs = require('fs');
let storage = fs.readFileSync('src/services/storage.ts', 'utf-8');

// Replace .single() with .maybeSingle() for select queries
storage = storage.replace(
  `const { data } = await supabase.from('users').select('*').eq('id', userId).single();`,
  `const { data } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();`
);

storage = storage.replace(
  `const { data: existing } = await supabase.from('users').select('*').ilike('username', username).single();`,
  `const { data: existing } = await supabase.from('users').select('*').ilike('username', username).maybeSingle();`
);

storage = storage.replace(
  `const { data: cb } = await supabase.from('shared_cookbooks')
      .select('*')
      .ilike('invite_code', code.trim())
      .single();`,
  `const { data: cb } = await supabase.from('shared_cookbooks')
      .select('*')
      .ilike('invite_code', code.trim())
      .maybeSingle();`
);

fs.writeFileSync('src/services/storage.ts', storage);

const fs = require('fs');

function replaceFile(path, oldStr, newStr) {
  let content = fs.readFileSync(path, 'utf-8');
  content = content.split(oldStr).join(newStr);
  fs.writeFileSync(path, content);
}

replaceFile('src/components/GamificationView.tsx', 'username={currentUser.username}', 'username={currentUser.displayName || currentUser.username}');
replaceFile('src/components/GamificationView.tsx', '{currentUser.username}', '{currentUser.displayName || currentUser.username}');

replaceFile('src/components/HeaderNav.tsx', 'username={currentUser.username}', 'username={currentUser.displayName || currentUser.username}');
replaceFile('src/components/HeaderNav.tsx', '{currentUser.username}', '{currentUser.displayName || currentUser.username}');
replaceFile('src/components/HeaderNav.tsx', "const isEndsWithS = currentUser.username.toLowerCase().endsWith('s');", "const dName = currentUser.displayName || currentUser.username;\n  const isEndsWithS = dName.toLowerCase().endsWith('s');");
replaceFile('src/components/HeaderNav.tsx', "const userNameDisplay = isEndsWithS ? `${currentUser.username}'` : `${currentUser.username}s`;", "const userNameDisplay = isEndsWithS ? `${dName}'` : `${dName}s`;");
replaceFile('src/components/HeaderNav.tsx', 'username={u.username}', 'username={u.displayName || u.username}');
replaceFile('src/components/HeaderNav.tsx', '{u.username}', '{u.displayName || u.username}');

replaceFile('src/components/SharedCookbooksView.tsx', 'alt={m.username}', 'alt={m.displayName || m.username}');
replaceFile('src/components/SharedCookbooksView.tsx', '{m.username}', '{m.displayName || m.username}');

const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

if (!code.includes('ProfileEditModal')) {
  code = code.replace(
    "import { XpRewardModal } from './components/XpRewardModal';",
    "import { XpRewardModal } from './components/XpRewardModal';\nimport { ProfileEditModal } from './components/ProfileEditModal';"
  );

  code = code.replace(
    "const [showAuthModal, setShowAuthModal] = useState(false);",
    "const [showAuthModal, setShowAuthModal] = useState(false);\n  const [showProfileEditModal, setShowProfileEditModal] = useState(false);"
  );

  code = code.replace(
    "onGoHome={() => setActiveTab('calendar')}",
    "onGoHome={() => setActiveTab('calendar')}\n          onOpenProfileEdit={() => setShowProfileEditModal(true)}"
  );

  const profileEditJSX = `
      {showProfileEditModal && currentUser && (
        <ProfileEditModal
          currentUser={currentUser}
          onClose={() => setShowProfileEditModal(false)}
          onUpdate={(user) => {
            setCurrentUser(user);
            setShowProfileEditModal(false);
            refreshData();
          }}
        />
      )}
`;

  code = code.replace(
    "{showAuthModal && (",
    `${profileEditJSX}\n      {showAuthModal && (`
  );

  fs.writeFileSync('src/App.tsx', code);
}

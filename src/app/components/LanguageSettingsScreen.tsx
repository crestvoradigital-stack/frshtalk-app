import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface LanguageSettingsScreenProps {
  onBack: () => void;
}

interface Language {
  id: string;
  name: string;
  nativeText: string;
}

const languages: Language[] = [
  { id: 'hindi', name: 'Hindi', nativeText: 'हि' },
  { id: 'telugu', name: 'Telugu', nativeText: 'తె' },
  { id: 'malayalam', name: 'Malayalam', nativeText: 'മ' },
  { id: 'kannada', name: 'Kannada', nativeText: 'ಕ' },
  { id: 'tamil', name: 'Tamil', nativeText: 'த' },
  { id: 'marathi', name: 'Marathi', nativeText: 'म' },
  { id: 'gujarati', name: 'Gujarati', nativeText: 'ગ' },
  { id: 'odia', name: 'Odia', nativeText: 'ଓ' },
  { id: 'bengali', name: 'Bengali', nativeText: 'অ' },
  { id: 'punjabi', name: 'Punjabi', nativeText: 'ਪ' },
];

export function LanguageSettingsScreen({ onBack }: LanguageSettingsScreenProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('hindi');

  const handleUpdate = () => {
    // Handle language update
    console.log('Selected language:', selectedLanguage);
    onBack();
  };

  return (
    <div className="h-full w-full bg-[#0d0d0d] flex flex-col" style={{ background: 'linear-gradient(180deg, #2a1a4d 0%, #1a0f2e 30%, #0d0d0d 60%)' }}>
      {/* Header */}
      <header className="flex items-center px-4 py-4 flex-shrink-0">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </header>

      {/* Title */}
      <div className="px-4 pb-6">
        <h1 className="text-white text-3xl font-bold mb-2">Language you speak</h1>
        <p className="text-white/70 text-sm">Find dostts who speak your language. Please select one.</p>
      </div>

      {/* Language List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-3">
        {languages.map((language) => (
          <button
            key={language.id}
            onClick={() => setSelectedLanguage(language.id)}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all ${
              selectedLanguage === language.id
                ? 'bg-purple-600/20 border-purple-500'
                : 'bg-transparent border-purple-500/30 hover:border-purple-500/50'
            }`}
          >
            <span className="text-white font-medium">{language.name}</span>
            <span className="text-white/90 text-2xl font-semibold">{language.nativeText}</span>
          </button>
        ))}
      </div>

      {/* Update Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d] to-transparent">
        <button
          onClick={handleUpdate}
          className="w-full bg-white text-[#0d0d0d] font-semibold py-4 rounded-full hover:bg-white/90 transition-colors"
        >
          Update
        </button>
      </div>
    </div>
  );
}
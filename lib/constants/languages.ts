export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const AVAILABLE_LANGUAGES: Language[] = [
  // Langues les plus populaires
  { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'Anglais', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Espagnol', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Allemand', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italien', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portugais', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'nl', name: 'Néerlandais', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polonais', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'ru', name: 'Russe', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabe', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: 'Chinois', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japonais', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Coréen', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'tr', name: 'Turc', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'sv', name: 'Suédois', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Danois', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'no', name: 'Norvégien', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'fi', name: 'Finnois', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'el', name: 'Grec', nativeName: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'he', name: 'Hébreu', nativeName: 'עברית', flag: '🇮🇱' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'hu', name: 'Hongrois', nativeName: 'Magyar', flag: '🇭🇺' },
  { code: 'cs', name: 'Tchèque', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'ro', name: 'Roumain', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'uk', name: 'Ukrainien', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'bg', name: 'Bulgare', nativeName: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Croate', nativeName: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sr', name: 'Serbe', nativeName: 'Српски', flag: '🇷🇸' },
  { code: 'sk', name: 'Slovaque', nativeName: 'Slovenčina', flag: '🇸🇰' },
  { code: 'sl', name: 'Slovène', nativeName: 'Slovenščina', flag: '🇸🇮' },
  { code: 'et', name: 'Estonien', nativeName: 'Eesti', flag: '🇪🇪' },
  { code: 'lv', name: 'Letton', nativeName: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lituanien', nativeName: 'Lietuvių', flag: '🇱🇹' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🇪🇸' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara', flag: '🇪🇸' },
  { code: 'ga', name: 'Irlandais', nativeName: 'Gaeilge', flag: '🇮🇪' },
  { code: 'cy', name: 'Gallois', nativeName: 'Cymraeg', flag: '🏴󐁧󐁢󐁷󐁬󐁳󐁿' },
  { code: 'is', name: 'Islandais', nativeName: 'Íslenska', flag: '🇮🇸' },
  { code: 'mt', name: 'Maltais', nativeName: 'Malti', flag: '🇲🇹' },
  { code: 'sq', name: 'Albanais', nativeName: 'Shqip', flag: '🇦🇱' },
  { code: 'mk', name: 'Macédonien', nativeName: 'Македонски', flag: '🇲🇰' },
  { code: 'hy', name: 'Arménien', nativeName: 'Հայերեն', flag: '🇦🇲' },
  { code: 'ka', name: 'Géorgien', nativeName: 'ქართული', flag: '🇬🇪' },
  { code: 'az', name: 'Azéri', nativeName: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ', flag: '🇰🇿' },
  { code: 'uz', name: 'Ouzbek', nativeName: 'Oʻzbek', flag: '🇺🇿' },
  { code: 'th', name: 'Thaï', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamien', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Indonésien', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malais', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'tl', name: 'Tagalog', nativeName: 'Tagalog', flag: '🇵🇭' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' },
];

export function getLanguageByCode(code: string): Language | undefined {
  return AVAILABLE_LANGUAGES.find(lang => lang.code === code);
}

export function getLanguagesByCoces(codes: string[]): Language[] {
  return codes
    .map(code => getLanguageByCode(code))
    .filter((lang): lang is Language => lang !== undefined);
}
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/i18n/LanguageContext';
import type { Language } from '@/i18n/translations';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  ];

  const currentLanguage = languages.find(l => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs sm:text-sm font-medium px-2 sm:px-3"
          data-testid="button-language-switcher"
        >
          {currentLanguage?.nativeName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" data-testid="menu-language-options">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? 'bg-accent' : ''}
            data-testid={`option-language-${lang.code}`}
          >
            <span className="flex items-center gap-2">
              <span>{lang.nativeName}</span>
              {language === lang.code && <span className="ml-auto">✓</span>}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

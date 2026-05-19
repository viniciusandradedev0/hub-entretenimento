import { useTranslation } from 'react-i18next'

export function LangToggle() {
  const { i18n, t } = useTranslation()
  const isEn = i18n.language === 'en'

  const toggle = () => {
    const next = isEn ? 'pt' : 'en'
    i18n.changeLanguage(next)
    try {
      localStorage.setItem('hub:lang', next)
    } catch {
      /* quota */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('lang.toggle')}
      title={t('lang.toggle')}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary dark:text-muted dark:hover:bg-background"
    >
      {isEn ? 'PT' : 'EN'}
    </button>
  )
}

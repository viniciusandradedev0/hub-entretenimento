import { useRegisterSW } from 'virtual:pwa-register/react'

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div
      role="alert"
      className="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-primary/40 bg-surface px-4 py-3 text-sm shadow-lg"
    >
      <span className="text-gray-700 dark:text-text">Nova versão disponível!</span>
      <button
        type="button"
        onClick={() => updateServiceWorker(true)}
        className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-primary/90"
      >
        Atualizar
      </button>
      <button
        type="button"
        onClick={() => setNeedRefresh(false)}
        aria-label="Ignorar atualização"
        className="text-xs text-gray-400 transition-colors hover:text-gray-700 dark:text-muted dark:hover:text-text"
      >
        Ignorar
      </button>
    </div>
  )
}

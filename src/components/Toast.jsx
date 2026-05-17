import { useEffect } from 'react'
import { Check } from 'lucide-react'

/**
 * Toast de feedback. Auto-dismisses após 2.5s.
 */
export function Toast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onDismiss, 2500)
    return () => clearTimeout(timer)
  }, [message, onDismiss])

  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]
        inline-flex items-center gap-2
        px-4 py-2 rounded-full
        bg-green-600 text-white text-sm font-semibold
        shadow-lg shadow-green-600/30
        animate-toast-in
      "
    >
      <Check size={16} aria-hidden="true" />
      {message}
    </div>
  )
}

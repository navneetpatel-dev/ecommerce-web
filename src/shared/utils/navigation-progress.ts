type NavigationProgressListener = (active: boolean) => void

const listeners = new Set<NavigationProgressListener>()

/** Signal an in-app navigation started (covers `router.push` / `replace`). */
export function startNavigationProgress() {
  listeners.forEach((listener) => listener(true))
}

export function subscribeNavigationProgress(listener: NavigationProgressListener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

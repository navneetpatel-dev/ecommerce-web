import { startNavigationProgress } from '@/shared/utils/navigation-progress'

type RouterLike = {
  push: (href: string) => void
  replace: (href: string) => void
}

function resetWindowScroll() {
  if (typeof window === 'undefined') return
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

/** Client navigation that also drives the top progress bar. */
export function navigate(router: RouterLike, href: string) {
  startNavigationProgress()
  router.push(href)
  resetWindowScroll()
}

export function navigateReplace(router: RouterLike, href: string) {
  startNavigationProgress()
  router.replace(href)
  resetWindowScroll()
}

import { startNavigationProgress } from '@/shared/utils/navigation-progress'

type RouterLike = {
  push: (href: string) => void
  replace: (href: string) => void
}

/** Client navigation that also drives the top progress bar. */
export function navigate(router: RouterLike, href: string) {
  startNavigationProgress()
  router.push(href)
}

export function navigateReplace(router: RouterLike, href: string) {
  startNavigationProgress()
  router.replace(href)
}

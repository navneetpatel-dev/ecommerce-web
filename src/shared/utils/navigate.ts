type RouterLike = {
  push: (href: string) => void
  replace: (href: string) => void
}

function resetWindowScroll() {
  if (typeof window === 'undefined') return
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

/** Client navigation with scroll reset. */
export function navigate(router: RouterLike, href: string) {
  router.push(href)
  resetWindowScroll()
}

export function navigateReplace(router: RouterLike, href: string) {
  router.replace(href)
  resetWindowScroll()
}

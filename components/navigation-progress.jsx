"use client"

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'

function NavigationProgressInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    NProgress.configure({ 
      showSpinner: false,
      trickleSpeed: 100,
      minimum: 0.3,
      easing: 'ease',
      speed: 500
    })
  }, [])

  useEffect(() => {
    NProgress.done()
  }, [pathname, searchParams])

  return null
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  )
}

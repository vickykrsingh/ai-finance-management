"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import NProgress from 'nprogress'
import { forwardRef } from 'react'

const ProgressLink = forwardRef(({ href, children, onClick, ...props }, ref) => {
  const router = useRouter()

  const handleClick = (e) => {
    // Call the original onClick if provided
    if (onClick) {
      onClick(e)
    }

    // Only handle navigation if the link hasn't been prevented
    if (!e.defaultPrevented && href) {
      e.preventDefault()
      
      // Start the progress bar
      NProgress.start()
      
      // Navigate to the new page
      router.push(href)
    }
  }

  return (
    <Link 
      ref={ref}
      href={href} 
      onClick={handleClick} 
      {...props}
    >
      {children}
    </Link>
  )
})

ProgressLink.displayName = 'ProgressLink'

export default ProgressLink

"use client"

import { PageLoader } from '@/components/loading'
import React, { useEffect, useState } from 'react'

export default function Loading() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Show loader after a tiny delay to avoid flash for very fast loads
    const timer = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="min-h-[400px]">
      <PageLoader />
    </div>
  )
}

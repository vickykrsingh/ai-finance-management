"use client"

import { Loader2 } from 'lucide-react'
import React from 'react'

export function LoadingSpinner({ size = "default", className = "" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner size="xl" />
      <p className="text-gray-600 animate-pulse">Loading...</p>
    </div>
  )
}

export function CardLoader() {
  return (
    <div className="flex items-center justify-center p-12 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex flex-col items-center space-y-3">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-500 animate-pulse">Loading data...</p>
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-100 rounded-lg p-6 space-y-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-300 rounded w-24"></div>
          <div className="h-4 bg-gray-300 rounded-full w-16"></div>
        </div>
        <div className="h-8 bg-gray-300 rounded w-32"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="flex gap-4 pt-2">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-12 bg-gray-200 rounded flex-1"></div>
          <div className="h-12 bg-gray-200 rounded flex-1"></div>
          <div className="h-12 bg-gray-200 rounded flex-1"></div>
        </div>
      ))}
    </div>
  )
}

export function OverviewSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-6 border border-gray-200">
            <div className="h-4 bg-gray-300 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-300 rounded w-32"></div>
          </div>
        ))}
      </div>
      <div className="bg-gray-100 rounded-lg p-6 border border-gray-200 h-64">
        <div className="h-4 bg-gray-300 rounded w-32 mb-4"></div>
        <div className="h-full bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}

export function BudgetSkeleton() {
  return (
    <div className="animate-pulse bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-300 rounded w-32"></div>
        <div className="h-5 bg-gray-300 rounded w-24"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded-full w-full mb-2"></div>
      <div className="flex justify-between">
        <div className="h-3 bg-gray-300 rounded w-20"></div>
        <div className="h-3 bg-gray-300 rounded w-20"></div>
      </div>
    </div>
  )
}

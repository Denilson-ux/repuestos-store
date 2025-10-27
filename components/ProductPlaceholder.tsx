'use client'

import { Package } from 'lucide-react'

interface ProductPlaceholderProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function ProductPlaceholder({ className = '', size = 'md' }: ProductPlaceholderProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32'
  }

  const iconSizes = {
    sm: 32,
    md: 48,
    lg: 64
  }

  return (
    <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}>
      <div className="text-center">
        <Package size={iconSizes[size]} className="mx-auto mb-2" />
        <div className="text-xs font-medium">Sin Imagen</div>
      </div>
    </div>
  )
}
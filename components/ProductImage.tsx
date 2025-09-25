'use client'

import { useState } from 'react'
import { Package } from 'lucide-react'

interface ProductImageProps {
  src: string
  alt: string
  className?: string
  productName: string
}

export default function ProductImage({ src, alt, className = '', productName }: ProductImageProps) {
  const [imageError, setImageError] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleImageError = () => {
    setImageError(true)
    setLoading(false)
  }

  const handleImageLoad = () => {
    setLoading(false)
  }

  if (imageError) {
    return (
      <div className={`bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <Package className="mx-auto text-blue-500 mb-2" size={48} />
          <p className="text-blue-700 font-medium text-sm px-2">
            {productName.substring(0, 20)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400">Cargando...</div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: loading ? 'none' : 'block' }}
      />
    </div>
  )
}
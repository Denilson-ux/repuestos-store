'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, ShoppingCart, Tag, Clock } from 'lucide-react'
import { useCart } from '../../../contexts/CartContext'

interface Producto {
  id: number
  nombre: string
  precio: number
  precio_original?: number
  descuento?: number
  imagen: string
  descripcion: string
  categoria: string
  stock: number
}

export default function OfertasPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchOfertas()
  }, [])

  const fetchOfertas = async () => {
    try {
      const response = await fetch('/api/productos?ofertas=true')
      const data = await response.json()
      if (data.success) {
        setProductos(data.productos)
      }
    } catch (error) {
      console.error('Error fetching ofertas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (producto: Producto) => {
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1
    })
  }

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Tag className="text-red-500 mr-2" size={32} />
            <h1 className="text-4xl font-bold text-gray-800">Ofertas Especiales</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Aprovecha nuestras mejores ofertas en repuestos de calidad. 
            ¡Descuentos limitados por tiempo limitado!
          </p>
          <div className="mt-4 flex items-center justify-center text-red-600">
            <Clock className="mr-2" size={20} />
            <span className="font-semibold">Ofertas válidas hasta agotar stock</span>
          </div>
        </div>

        {/* Promociones destacadas */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-6 mb-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">🚚</div>
              <h3 className="font-bold text-lg">Envío Gratis</h3>
              <p className="text-sm opacity-90">En compras mayores a 200 Bs</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">💳</div>
              <h3 className="font-bold text-lg">12 Cuotas sin Interés</h3>
              <p className="text-sm opacity-90">Con tarjetas participantes</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">🎯</div>
              <h3 className="font-bold text-lg">Garantía Extendida</h3>
              <p className="text-sm opacity-90">6 meses en todos los productos</p>
            </div>
          </div>
        </div>

        {/* Productos en oferta */}
        {productos.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">No hay ofertas disponibles</h2>
            <p className="text-gray-500 mb-6">Actualmente no tenemos productos en oferta.</p>
            <Link href="/productos" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Ver todos los productos
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Productos en Oferta ({productos.length})
              </h2>
              <div className="text-sm text-gray-600">
                Mostrando {productos.length} productos
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productos.map((producto) => {
                const descuento = producto.precio_original 
                  ? calculateDiscount(producto.precio_original, producto.precio)
                  : producto.descuento || 0

                return (
                  <div key={producto.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative group">
                    {/* Badge de descuento */}
                    {descuento > 0 && (
                      <div className="absolute top-2 left-2 z-10">
                        <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          -{descuento}%
                        </div>
                      </div>
                    )}

                    {/* Badge de stock bajo */}
                    {producto.stock < 5 && producto.stock > 0 && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          ¡Últimos {producto.stock}!
                        </div>
                      </div>
                    )}

                    {/* Imagen del producto */}
                    <div className="relative overflow-hidden">
                      <img
                        src={producto.imagen || '/images/placeholder-product.jpg'}
                        alt={producto.nombre}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                    </div>

                    <div className="p-4">
                      {/* Categoría */}
                      <div className="text-xs text-blue-600 font-medium mb-1 uppercase tracking-wide">
                        {producto.categoria}
                      </div>

                      {/* Nombre del producto */}
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
                        {producto.nombre}
                      </h3>

                      {/* Descripción */}
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {producto.descripcion}
                      </p>

                      {/* Precios */}
                      <div className="mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-red-600">
                            Bs {producto.precio.toFixed(2)}
                          </span>
                          {producto.precio_original && (
                            <span className="text-lg text-gray-500 line-through">
                              Bs {producto.precio_original.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {descuento > 0 && (
                          <div className="text-sm text-green-600 font-medium">
                            Ahorrás Bs {((producto.precio_original || producto.precio * 1.2) - producto.precio).toFixed(2)}
                          </div>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">(4.0)</span>
                      </div>

                      {/* Stock status */}
                      <div className="mb-4">
                        {producto.stock > 0 ? (
                          <span className="text-sm text-green-600 font-medium">
                            ✓ En stock ({producto.stock} disponibles)
                          </span>
                        ) : (
                          <span className="text-sm text-red-600 font-medium">
                            ✗ Agotado
                          </span>
                        )}
                      </div>

                      {/* Botones */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddToCart(producto)}
                          disabled={producto.stock === 0}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-sm font-medium"
                        >
                          <ShoppingCart size={16} className="mr-1" />
                          {producto.stock === 0 ? 'Agotado' : 'Añadir'}
                        </button>
                        <Link
                          href={`/productos/${producto.id}`}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                          Ver
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Newsletter signup */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            ¡No te pierdas nuestras ofertas!
          </h3>
          <p className="text-gray-600 mb-6">
            Suscríbete a nuestro boletín y recibe notificaciones sobre nuevas ofertas y descuentos exclusivos.
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
              Suscribirse
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
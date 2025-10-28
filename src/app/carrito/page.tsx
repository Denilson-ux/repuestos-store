'use client'

import { useCart } from '../../../contexts/CartContext'
import { useAuth } from '../../../contexts/AuthContext'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react'
import ProductImage from '../../../components/ProductImage'
import { useState } from 'react'

export default function CarritoPage() {
  const { items, totalPrice, loading, updateQuantity, removeFromCart } = useCart()
  const { user } = useAuth()
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set())

  const calcularPrecioItem = (item: any) => {
    return item.precio_oferta || item.precio
  }

  const calcularSubtotal = (item: any) => {
    return calcularPrecioItem(item) * item.cantidad
  }

  const calcularDescuento = (precio: number, precioOferta: number) => {
    return Math.round(((precio - precioOferta) / precio) * 100)
  }

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    setUpdatingItems(prev => new Set(prev).add(productId))
    await updateQuantity(productId, newQuantity)
    setUpdatingItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(productId)
      return newSet
    })
  }

  const handleRemoveItem = async (productId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
      setUpdatingItems(prev => new Set(prev).add(productId))
      await removeFromCart(productId)
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  // Si no está logueado
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <ShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Inicia Sesión</h2>
          <p className="text-gray-600 mb-6">
            Debes iniciar sesión para ver tu carrito de compras
          </p>
          <Link 
            href="/auth/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando carrito...</p>
        </div>
      </div>
    )
  }

  // Carrito vacío
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
            <ShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-6">
              ¡Explora nuestro catálogo y encuentra los repuestos que necesitas!
            </p>
            <Link 
              href="/productos"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <ArrowLeft className="mr-2" size={20} />
              Ver Productos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const costoEnvio = totalPrice >= 200 ? 0 : 25
  const totalFinal = totalPrice + costoEnvio

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Mi Carrito de Compras</h1>
          <Link 
            href="/productos"
            className="text-blue-600 hover:text-blue-700 inline-flex items-center"
          >
            <ArrowLeft className="mr-1" size={20} />
            Continuar comprando
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 md:p-6 border-b">
                <h2 className="text-lg md:text-xl font-semibold">
                  Productos en tu carrito ({items.reduce((sum, item) => sum + item.cantidad, 0)})
                </h2>
              </div>
              
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.producto_id} className="p-4 md:p-6 relative">
                    {updatingItems.has(item.producto_id) && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                    
                    <div className="flex flex-col space-y-4">
                      {/* Fila superior: Imagen, Nombre, Precio y Badge de descuento */}
                      <div className="flex gap-4">
                        {/* Imagen del producto */}
                        <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
                          <ProductImage
                            src={item.imagen_url}
                            alt={item.nombre}
                            className="w-full h-full rounded-lg object-cover"
                            productName={item.nombre}
                          />
                        </div>

                        {/* Información del producto */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base leading-tight">
                                {item.nombre}
                              </h3>
                              <p className="text-xs md:text-sm text-gray-600">{item.marca}</p>
                            </div>
                            
                            {item.precio_oferta && (
                              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                                -{calcularDescuento(item.precio, item.precio_oferta)}% OFF
                              </span>
                            )}
                          </div>
                          
                          {/* Precio */}
                          <div className="flex items-center space-x-2 mt-2">
                            {item.precio_oferta ? (
                              <>
                                <span className="text-base md:text-lg font-bold text-green-600">
                                  Bs {Number(item.precio_oferta).toFixed(2)}
                                </span>
                                <span className="text-xs md:text-sm text-gray-500 line-through">
                                  Bs {Number(item.precio).toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-base md:text-lg font-bold text-gray-900">
                                Bs {Number(item.precio).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Fila inferior: Controles de cantidad, subtotal y botón eliminar */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Controles de cantidad */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <span className="text-sm font-medium text-gray-700">Cantidad:</span>
                          <div className="flex items-center">
                            <div className="flex items-center border rounded-lg bg-white">
                              <button
                                onClick={() => handleUpdateQuantity(item.producto_id, item.cantidad - 1)}
                                disabled={item.cantidad <= 1 || updatingItems.has(item.producto_id)}
                                className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg"
                              >
                                <Minus size={18} />
                              </button>
                              <span className="px-4 py-3 min-w-[3rem] text-center font-semibold border-x">
                                {item.cantidad}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.producto_id, item.cantidad + 1)}
                                disabled={item.cantidad >= item.stock || updatingItems.has(item.producto_id)}
                                className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-lg"
                              >
                                <Plus size={18} />
                              </button>
                            </div>
                            <span className="text-xs text-gray-500 ml-2">
                              (Stock: {item.stock})
                            </span>
                          </div>
                        </div>

                        {/* Subtotal y botón eliminar */}
                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <div className="text-left sm:text-right">
                            <div className="font-bold text-lg md:text-xl text-gray-900">
                              Bs {calcularSubtotal(item).toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Subtotal
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.producto_id)}
                            disabled={updatingItems.has(item.producto_id)}
                            className="text-red-500 hover:text-red-700 p-3 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                            title="Eliminar producto"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow sticky top-4">
              <div className="p-4 md:p-6 border-b">
                <h2 className="text-lg md:text-xl font-semibold">Resumen del Pedido</h2>
              </div>
              
              <div className="p-4 md:p-6">
                {/* Desglose de precios */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm md:text-base">Subtotal ({items.reduce((sum, item) => sum + item.cantidad, 0)} productos)</span>
                    <span className="font-semibold">Bs {totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm md:text-base">Costo de envío</span>
                    <span className={costoEnvio === 0 ? "text-green-600 font-medium" : ""}>
                      {costoEnvio === 0 ? '¡GRATIS!' : `Bs ${costoEnvio.toFixed(2)}`}
                    </span>
                  </div>
                  
                  {totalPrice < 200 && (
                    <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                      🚚 <strong>¡Envío gratis!</strong> Agrega Bs {(200 - totalPrice).toFixed(2)} más para obtener envío gratuito
                    </div>
                  )}
                  
                  <hr className="my-4" />
                  
                  <div className="flex justify-between text-lg md:text-xl font-bold">
                    <span>Total a Pagar</span>
                    <span className="text-blue-600">Bs {totalFinal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Botón de checkout */}
                <Link
                  href="/checkout"
                  className="w-full bg-blue-600 text-white py-4 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-semibold text-base md:text-lg shadow-md"
                >
                  Proceder al Pago
                  <ArrowRight className="ml-2" size={22} />
                </Link>

                {/* Métodos de pago */}
                <div className="mt-6 text-center">
                  <p className="text-sm font-medium text-gray-700 mb-3">Métodos de pago aceptados:</p>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded text-sm font-medium">
                      📱 QR Bolivia
                    </div>
                    <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-2 rounded text-sm font-medium">
                      💳 Tigo Money
                    </div>
                    <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded text-sm font-medium">
                      🏦 Transferencia Bancaria
                    </div>
                  </div>
                </div>

                {/* Garantía */}
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">✅ Compra Segura</h4>
                  <p className="text-sm text-green-700">
                    6 meses de garantía • Envío seguro • Soporte técnico
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
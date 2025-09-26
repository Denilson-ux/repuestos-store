'use client'

import { useState } from 'react'
import { useCart } from '../../../contexts/CartContext'
import { useAuth } from '../../../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, MapPin, Phone, CreditCard, Smartphone, Building2 } from 'lucide-react'

interface FormData {
  nombre: string
  telefono: string
  direccion: string
  ciudad: string
  notas: string
  metodo_pago: 'qr' | 'tigo_money' | 'transferencia' | ''
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState<FormData>({
    nombre: user?.nombre || '',
    telefono: '',
    direccion: '',
    ciudad: 'La Paz',
    notas: '',
    metodo_pago: ''
  })

  const costoEnvio = totalPrice >= 200 ? 0 : 25
  const totalFinal = totalPrice + costoEnvio

  const ciudades = [
    'La Paz', 'Santa Cruz', 'Cochabamba', 'Oruro', 'Potosí', 
    'Tarija', 'Sucre', 'Beni', 'Pando'
  ]

  const metodosPago = [
    {
      id: 'qr',
      nombre: 'QR Bolivia',
      descripcion: 'Pago instantáneo con QR',
      icono: '📱',
      disponible: true
    },
    {
      id: 'tigo_money',
      nombre: 'Tigo Money',
      descripcion: 'Pago móvil rápido y seguro',
      icono: '💳',
      disponible: true
    },
    {
      id: 'transferencia',
      nombre: 'Transferencia Bancaria',
      descripcion: 'Banco Nacional de Bolivia',
      icono: '🏦',
      disponible: true
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validaciones
    if (!formData.nombre || !formData.telefono || !formData.direccion || !formData.metodo_pago) {
      setError('Por favor completa todos los campos obligatorios')
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map(item => ({
            producto_id: item.producto_id,
            cantidad: item.cantidad,
            precio_unitario: item.precio_oferta || item.precio
          })),
          total: totalFinal,
          metodo_pago: formData.metodo_pago,
          direccion_envio: `${formData.direccion}, ${formData.ciudad}`,
          telefono_contacto: formData.telefono,
          notas: formData.notas || null
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Limpiar carrito
        await clearCart()
        // Redirigir a página de pago
        router.push(`/pago/${data.pedido_id}?metodo=${formData.metodo_pago}`)
      } else {
        const error = await response.json()
        setError(error.error || 'Error al procesar el pedido')
      }
    } catch (error) {
      setError('Error de conexión. Intenta nuevamente.')
    }
    
    setLoading(false)
  }

  // Redireccionar si no hay items
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <ShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Carrito Vacío</h2>
          <p className="text-gray-600 mb-6">
            No tienes productos en tu carrito para procesar el pago
          </p>
          <Link 
            href="/productos"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Ir a Productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/carrito"
            className="text-blue-600 hover:text-blue-700 inline-flex items-center mb-4"
          >
            <ArrowLeft className="mr-1" size={20} />
            Volver al carrito
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Información de envío */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <MapPin className="mr-2" size={24} />
                  Información de Envío
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="70123456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección Completa *
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      placeholder="Calle, número, zona..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad *
                    </label>
                    <select
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {ciudades.map((ciudad) => (
                        <option key={ciudad} value={ciudad}>{ciudad}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas adicionales (opcional)
                    </label>
                    <textarea
                      name="notas"
                      value={formData.notas}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Referencias adicionales para la entrega..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Método de pago */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <CreditCard className="mr-2" size={24} />
                  Método de Pago
                </h2>
                
                <div className="space-y-3">
                  {metodosPago.map((metodo) => (
                    <label key={metodo.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="metodo_pago"
                        value={metodo.id}
                        checked={formData.metodo_pago === metodo.id}
                        onChange={handleInputChange}
                        className="text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <div className="ml-3 flex items-center space-x-3">
                        <span className="text-2xl">{metodo.icono}</span>
                        <div>
                          <div className="font-medium">{metodo.nombre}</div>
                          <div className="text-sm text-gray-600">{metodo.descripcion}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Procesando...
                  </div>
                ) : (
                  `Pagar Bs ${totalFinal.toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
              
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.producto_id} className="flex justify-between text-sm">
                    <span>{item.nombre} x{item.cantidad}</span>
                    <span>Bs {((item.precio_oferta || item.precio) * item.cantidad).toFixed(2)}</span>
                  </div>
                ))}
                
                <hr />
                
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Bs {totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className={costoEnvio === 0 ? "text-green-600" : ""}>
                    {costoEnvio === 0 ? '¡Gratis!' : `Bs ${costoEnvio.toFixed(2)}`}
                  </span>
                </div>
                
                <hr />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>Bs {totalFinal.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-xs text-gray-600 space-y-2">
                <p>✅ Compra 100% segura</p>
                <p>✅ Garantía de 6 meses</p>
                <p>✅ Soporte técnico incluido</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
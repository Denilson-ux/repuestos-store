      'use client'

      import { useState, useEffect } from 'react'
      import { useAuth } from '../../../contexts/AuthContext'
      import Link from 'next/link'
      import { Package, Eye, Clock, CheckCircle, XCircle, Truck, Trash2 } from 'lucide-react'

      interface Pedido {
        id: number
        total: number
        estado: 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado'
        metodo_pago: string
        created_at: string
        total_items: number
      }

      export default function PedidosPage() {
        const { user } = useAuth()
        const [pedidos, setPedidos] = useState<Pedido[]>([])
        const [loading, setLoading] = useState(true)

        const eliminarPedido = async (pedidoId: number) => {
          if (!window.confirm('¿Estás seguro de eliminar este pedido pendiente?')) return;
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/pedidos/${pedidoId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const data = await response.json();
            if (response.ok) {
              setPedidos((prev: Pedido[]) => prev.filter((p: Pedido) => p.id !== pedidoId));
              alert('Pedido borrado correctamente.');
            } else {
              alert(data.error || 'Error eliminando el pedido.');
            }
          } catch (error) {
            alert('Error eliminando el pedido.');
          }
        };

        useEffect(() => {
          if (user) {
            cargarPedidos()
          }
        }, [user])

        const cargarPedidos = async () => {
          try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/pedidos', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })

            if (response.ok) {
              const data = await response.json()
              setPedidos(data.pedidos)
            }
          } catch (error) {
            console.error('Error cargando pedidos:', error)
          }
          setLoading(false)
        }

        const getEstadoInfo = (estado: string) => {
          const estados = {
            pendiente: {
              texto: 'Pendiente de pago',
              color: 'bg-yellow-100 text-yellow-800',
              icono: Clock
            },
            pagado: {
              texto: 'Pagado - En preparación',
              color: 'bg-blue-100 text-blue-800',
              icono: Package
            },
            enviado: {
              texto: 'Enviado',
              color: 'bg-purple-100 text-purple-800',
              icono: Truck
            },
            entregado: {
              texto: 'Entregado',
              color: 'bg-green-100 text-green-800',
              icono: CheckCircle
            },
            cancelado: {
              texto: 'Cancelado',
              color: 'bg-red-100 text-red-800',
              icono: XCircle
            }
          }

          return estados[estado as keyof typeof estados] || estados.pendiente
        }

        const getMetodoPagoTexto = (metodo: string) => {
          const metodos = {
            qr: '📱 QR Bolivia',
            tigo_money: '💳 Tigo Money',
            transferencia: '🏦 Transferencia'
          }
          return metodos[metodo as keyof typeof metodos] || metodo
        }

        if (!user) {
          return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <Package className="mx-auto text-gray-400 mb-4" size={64} />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Inicia Sesión</h2>
                <p className="text-gray-600 mb-6">
                  Debes iniciar sesión para ver tus pedidos
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

        if (loading) {
          return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando tus pedidos...</p>
              </div>
            </div>
          )
        }

        return (
          <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
                <p className="text-gray-600">Aquí puedes ver el historial y estado de todos tus pedidos</p>
              </div>

              {pedidos.length === 0 ? (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <Package className="mx-auto text-gray-400 mb-4" size={64} />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">No tienes pedidos aún</h2>
                  <p className="text-gray-600 mb-6">
                    ¡Explora nuestro catálogo y realiza tu primera compra!
                  </p>
                  <Link 
                    href="/productos"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                  >
                    Ver Productos
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {pedidos.map((pedido) => {
                    const estadoInfo = getEstadoInfo(pedido.estado)
                    const IconoEstado = estadoInfo.icono

                    return (
                      <div key={pedido.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                        <div className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                            <div>
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-xl font-semibold">Pedido #{pedido.id}</h3>
                                <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${estadoInfo.color}`}>
                                  <IconoEstado size={16} />
                                  <span>{estadoInfo.texto}</span>
                                </span>
                              </div>
                              <p className="text-gray-600">
                                {new Date(pedido.created_at).toLocaleDateString('es-BO', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                      
                            <div className="mt-4 lg:mt-0 text-right">
                              <div className="text-2xl font-bold text-blue-600">
                                Bs {(Number(pedido.total) || 0).toFixed(2)}
                              </div>
                              <p className="text-sm text-gray-600">
                                {pedido.total_items} {pedido.total_items === 1 ? 'producto' : 'productos'}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>
                                <strong>Pago:</strong> {getMetodoPagoTexto(pedido.metodo_pago)}
                              </span>
                            </div>

                            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                              {pedido.estado === 'pendiente' && (
                                <>
                                  <Link
                                    href={`/pago/${pedido.id}?metodo=${pedido.metodo_pago}`}
                                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                                  >
                                    Realizar Pago
                                  </Link>
                                  <button
                                    onClick={() => eliminarPedido(pedido.id)}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium inline-flex items-center space-x-1 ml-2"
                                    title="Eliminar pedido"
                                  >
                                    <Trash2 size={16} />
                                    <span>Eliminar</span>
                                  </button>
                                </>
                              )}
                        
                              <Link
                                href={`/pedidos/${pedido.id}`}
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium inline-flex items-center space-x-1"
                              >
                                <Eye size={16} />
                                <span>Ver Detalles</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )
      }
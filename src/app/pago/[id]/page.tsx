'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Clock, CreditCard, Copy, ExternalLink } from 'lucide-react'

interface PedidoDetalle {
  id: number
  total: number
  estado: string
  metodo_pago: string
  created_at: string
  direccion_envio: string
  telefono_contacto: string
}

export default function PagoPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const pedidoId = params.id
  const metodoPago = searchParams.get('metodo')
  
  const [pedido, setPedido] = useState<PedidoDetalle | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    if (pedidoId) {
      cargarPedido()
    }
  }, [pedidoId])

  const cargarPedido = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/pedidos/${pedidoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPedido(data.pedido)
      }
    } catch (error) {
      console.error('Error cargando pedido:', error)
    }
    setLoading(false)
  }

  const copiarTexto = (texto: string) => {
    navigator.clipboard.writeText(texto)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const datosPago = {
    qr: {
      nombre: 'QR Bolivia',
      instrucciones: [
        'Abre tu app bancaria favorita',
        'Selecciona "Pagar con QR"',
        'Escanea el código QR que aparece abajo',
        'Confirma el pago por Bs ' + (pedido?.total?.toFixed(2) || '0.00'),
        'Envíanos captura del comprobante por WhatsApp'
      ],
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=boliviaqr://pay?amount=${pedido?.total || 0}&merchant=repuestos_bolivia&order=${pedidoId}`,
      whatsapp: '59170123456'
    },
    tigo_money: {
      nombre: 'Tigo Money',
      numero: '70123456',
      titular: 'Repuestos Bolivia',
      instrucciones: [
        'Abre tu app Tigo Money',
        'Selecciona "Enviar Dinero"',
        'Ingresa el número: 70123456',
        'Monto: Bs ' + (pedido?.total?.toFixed(2) || '0.00'),
        'Concepto: Pedido #' + pedidoId,
        'Envía captura del comprobante por WhatsApp'
      ],
      whatsapp: '59170123456'
    },
    transferencia: {
      nombre: 'Transferencia Bancaria',
      banco: 'Banco Nacional de Bolivia',
      cuenta: '1234567890',
      titular: 'Repuestos Bolivia SRL',
      ci: '12345678 LP',
      instrucciones: [
        'Realiza una transferencia bancaria',
        'Banco: Banco Nacional de Bolivia',
        'Cuenta: 1234567890',
        'Titular: Repuestos Bolivia SRL',
        'Monto: Bs ' + (pedido?.total?.toFixed(2) || '0.00'),
        'Concepto: Pedido #' + pedidoId,
        'Envía foto del comprobante por WhatsApp'
      ],
      whatsapp: '59170123456'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!pedido) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pedido no encontrado</h2>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  const datosMetodo = datosPago[metodoPago as keyof typeof datosPago]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header de éxito */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pedido Creado!</h1>
          <p className="text-gray-600 mb-4">
            Tu pedido #{pedidoId} ha sido registrado exitosamente
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="text-blue-600" size={20} />
              <span className="text-blue-800 font-medium">
                Estado: {pedido.estado === 'pendiente' ? 'Pendiente de pago' : pedido.estado}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información de pago */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <CreditCard className="mr-3" size={28} />
              Realizar Pago - {datosMetodo?.nombre}
            </h2>

            {/* QR Bolivia */}
            {metodoPago === 'qr' && 'qrCode' in datosMetodo && (
              <div className="text-center mb-6">
                <img 
                  src={datosMetodo.qrCode} 
                  alt="Código QR para pago" 
                  className="mx-auto border rounded-lg mb-4"
                />
                <p className="text-lg font-semibold">
                  Monto a pagar: <span className="text-blue-600">Bs {pedido.total.toFixed(2)}</span>
                </p>
              </div>
            )}

            {/* Tigo Money */}
            {metodoPago === 'tigo_money' && 'numero' in datosMetodo && (
              <div className="space-y-4 mb-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Número Tigo Money:</p>
                    <p className="text-2xl font-bold text-purple-600">{datosMetodo.numero}</p>
                    <p className="text-sm text-gray-600">{datosMetodo.titular}</p>
                  </div>
                  <button
                    onClick={() => copiarTexto(datosMetodo.numero)}
                    className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-1"
                  >
                    <Copy size={16} />
                    <span>{copiado ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <p className="text-lg font-semibold text-center">
                  Monto: <span className="text-purple-600">Bs {pedido.total.toFixed(2)}</span>
                </p>
              </div>
            )}

            {/* Transferencia Bancaria */}
            {metodoPago === 'transferencia' && 'banco' in datosMetodo && (
              <div className="space-y-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-gray-700">Banco:</p>
                      <p>{datosMetodo.banco}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Cuenta:</p>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-lg">{datosMetodo.cuenta}</span>
                        <button
                          onClick={() => copiarTexto(datosMetodo.cuenta)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Titular:</p>
                      <p>{datosMetodo.titular}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">CI:</p>
                      <p>{datosMetodo.ci}</p>
                    </div>
                  </div>
                </div>
                <p className="text-lg font-semibold text-center">
                  Monto: <span className="text-green-600">Bs {pedido.total.toFixed(2)}</span>
                </p>
              </div>
            )}

            {/* Instrucciones */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Instrucciones de pago:</h3>
              <ol className="space-y-2">
                {datosMetodo?.instrucciones.map((instruccion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{instruccion}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* WhatsApp */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-green-800 mb-2">¿Necesitas ayuda?</h4>
              <a
                href={`https://wa.me/${datosMetodo?.whatsapp}?text=Hola, necesito ayuda con mi pedido #${pedidoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 inline-flex items-center space-x-2"
              >
                <span>📱</span>
                <span>Contactar por WhatsApp</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Resumen del Pedido</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold">Número de Pedido:</span>
                <span>#{pedidoId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Fecha:</span>
                <span>{new Date(pedido.created_at).toLocaleDateString('es-BO')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Estado:</span>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  {pedido.estado === 'pendiente' ? 'Pendiente de pago' : pedido.estado}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Método de Pago:</span>
                <span>{datosMetodo?.nombre}</span>
              </div>
              <hr />
              <div className="flex justify-between text-xl font-bold">
                <span>Total a Pagar:</span>
                <span className="text-blue-600">Bs {pedido.total.toFixed(2)}</span>
              </div>
            </div>
            {/* Información de envío */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="font-semibold mb-4">Información de Envío</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Dirección:</strong> {pedido.direccion_envio}</p>
                <p><strong>Teléfono:</strong> {pedido.telefono_contacto}</p>
              </div>
            </div>
            {/* Botones de acción */}
            <div className="mt-8 space-y-3">
              <Link
                href="/pedidos"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block font-semibold"
              >
                Ver Mis Pedidos
              </Link>
              <Link
                href="/"
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors text-center block font-semibold"
              >
                Volver al Inicio
              </Link>
            </div>
            {/* Información adicional */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Información importante:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• El pedido será procesado una vez confirmado el pago</li>
                <li>• Recibirás actualizaciones por WhatsApp</li>
                <li>• El tiempo de envío es de 1-3 días hábiles</li>
                <li>• Todos los productos tienen garantía de 6 meses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

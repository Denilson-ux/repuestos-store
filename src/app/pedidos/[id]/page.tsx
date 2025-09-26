"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";


interface PedidoDetalle {
  id: number;
  total: number;
  estado: string;
  metodo_pago: string;
  created_at: string;
  direccion_envio: string;
  telefono_contacto: string;
  // Agrega aquí más campos si tu modelo tiene más
}

export default function PedidoDetallePage() {
  const params = useParams();
  const pedidoId = params.id;
  const [pedido, setPedido] = useState<PedidoDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/pedidos/${pedidoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPedido(data.pedido);
        }
      } catch (error) {
        setPedido(null);
      }
      setLoading(false);
    };
    if (pedidoId) fetchPedido();
  }, [pedidoId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pedido no encontrado</h2>
          <Link href="/pedidos" className="text-blue-600 hover:text-blue-700">
            Volver a Mis Pedidos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Detalle del Pedido #{pedidoId}</h1>
        <div className="mb-4">
          <span className="font-semibold">Estado:</span> {pedido.estado}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Total:</span> Bs {(Number(pedido.total) || 0).toFixed(2)}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Dirección de envío:</span> {pedido.direccion_envio}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Teléfono de contacto:</span> {pedido.telefono_contacto}
        </div>
        {/* Puedes agregar más detalles aquí según tu modelo */}
        <Link href="/pedidos" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Volver a Mis Pedidos
        </Link>
      </div>
    </div>
  );
}

// DELETE - Eliminar pedido pendiente por ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 401 })
    }
    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }
    const pedidoId = params.id
    const connection = await getConnection()
    // Solo permite eliminar pedidos pendientes y del usuario autenticado
    const [rows] = await connection.execute(
      'SELECT estado FROM pedidos WHERE id = ? AND user_id = ?',
      [pedidoId, payload.userId]
    )
    if (!Array.isArray(rows) || rows.length === 0) {
      await connection.end()
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }
    // Forzar tipado para evitar error de acceso a 'estado'
    const pedidoRow = Array.isArray(rows) ? (rows[0] as { estado: string }) : { estado: undefined };
    if (pedidoRow.estado !== 'pendiente') {
      await connection.end()
      return NextResponse.json({ error: 'Solo puedes eliminar pedidos pendientes' }, { status: 400 })
    }
    await connection.execute('DELETE FROM pedidos WHERE id = ? AND user_id = ?', [pedidoId, payload.userId])
    await connection.end()
    return NextResponse.json({ message: 'Pedido eliminado correctamente' })
  } catch (error) {
    return NextResponse.json({ error: 'Error eliminando pedido' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getConnection } from '../../../../../lib/supabase'
import { verifyToken } from '../../../../../lib/auth'

// GET - Obtener un pedido específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const pedidoId = parseInt(params.id)
    const connection = await getConnection()

    try {
      // Obtener información del pedido
      const [pedidoRows] = await connection.execute(`
        SELECT * FROM pedidos 
        WHERE id = ? AND user_id = ?
      `, [pedidoId, payload.userId])

      const pedidos = pedidoRows as any[]
      if (pedidos.length === 0) {
        return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
      }

      const pedido = pedidos[0]

      // Obtener items del pedido
      const [itemsRows] = await connection.execute(`
        SELECT 
          pi.*,
          p.nombre,
          p.marca,
          p.imagen_url
        FROM pedido_items pi
        INNER JOIN productos p ON pi.producto_id = p.id
        WHERE pi.pedido_id = ?
      `, [pedidoId])

      return NextResponse.json({
        pedido: {
          ...pedido,
          items: itemsRows
        }
      })

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Error obteniendo pedido:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
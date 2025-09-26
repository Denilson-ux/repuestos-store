import { NextRequest, NextResponse } from 'next/server'
import { getConnection } from '../../../../lib/supabase'
import { verifyToken } from '../../../../lib/auth'

// POST - Crear nuevo pedido
export async function POST(request: NextRequest) {
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

    const { items, total, metodo_pago, direccion_envio, telefono_contacto, notas } = await request.json()

    // Validaciones
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El pedido debe tener al menos un producto' }, { status: 400 })
    }

    if (!total || !metodo_pago || !direccion_envio || !telefono_contacto) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 })
    }

    const connection = await getConnection()

    try {
  // Iniciar transacción
  await connection.query('START TRANSACTION')

      // Verificar stock de todos los productos
      for (const item of items) {
        const [productRows] = await connection.execute(
          'SELECT stock, nombre FROM productos WHERE id = ? AND activo = true',
          [item.producto_id]
        )

        const products = productRows as any[]
        if (products.length === 0) {
          throw new Error(`Producto con ID ${item.producto_id} no encontrado`)
        }

        if (products[0].stock < item.cantidad) {
          throw new Error(`Stock insuficiente para ${products[0].nombre}. Disponible: ${products[0].stock}`)
        }
      }

      // Crear el pedido
      const [pedidoResult] = await connection.execute(`
        INSERT INTO pedidos (user_id, total, metodo_pago, direccion_envio, telefono_contacto, notas)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [payload.userId, total, metodo_pago, direccion_envio, telefono_contacto, notas])

      const pedidoId = (pedidoResult as any).insertId

      // Crear los items del pedido y actualizar stock
      for (const item of items) {
        // Insertar item del pedido
        await connection.execute(`
          INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
          VALUES (?, ?, ?, ?)
        `, [pedidoId, item.producto_id, item.cantidad, item.precio_unitario])

        // Actualizar stock
        await connection.execute(`
          UPDATE productos 
          SET stock = stock - ? 
          WHERE id = ?
        `, [item.cantidad, item.producto_id])
      }

      // Limpiar carrito del usuario
      await connection.execute(
        'DELETE FROM carrito WHERE user_id = ?',
        [payload.userId]
      )

  // Confirmar transacción
  await connection.query('COMMIT')

      return NextResponse.json({
        message: 'Pedido creado exitosamente',
        pedido_id: pedidoId
      }, { status: 201 })

    } catch (error) {
      // Revertir transacción en caso de error
      await connection.query('ROLLBACK')
      throw error
    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Error creando pedido:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Error interno del servidor'
    }, { status: 500 })
  }
}

// GET - Obtener pedidos del usuario
export async function GET(request: NextRequest) {
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

    const connection = await getConnection()

    try {
      const [rows] = await connection.execute(`
        SELECT 
          p.*,
          COUNT(pi.id) as total_items
        FROM pedidos p
        LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
        WHERE p.user_id = ?
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `, [payload.userId])

      return NextResponse.json({ pedidos: rows })

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Error obteniendo pedidos:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getConnection } from '../../../../lib/supabase'
import { verifyToken } from '../../../../lib/auth'

// GET - Obtener carrito del usuario
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
          c.id,
          c.producto_id,
          c.cantidad,
          p.nombre,
          p.precio,
          p.precio_oferta,
          p.imagen_url,
          p.marca,
          p.stock
        FROM carrito c
        INNER JOIN productos p ON c.producto_id = p.id
        WHERE c.user_id = ? AND p.activo = true
        ORDER BY c.created_at DESC
      `, [payload.userId])

      return NextResponse.json({ items: rows })

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Error obteniendo carrito:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// POST - Agregar producto al carrito
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

    const { producto_id, cantidad = 1 } = await request.json()

    if (!producto_id) {
      return NextResponse.json({ error: 'ID de producto requerido' }, { status: 400 })
    }

    const connection = await getConnection()

    try {
      // Verificar que el producto existe y tiene stock
      const [productRows] = await connection.execute(
        'SELECT id, nombre, stock FROM productos WHERE id = ? AND activo = true',
        [producto_id]
      )

      const products = productRows as any[]
      if (products.length === 0) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
      }

      const producto = products[0]

      // Verificar si el producto ya está en el carrito
      const [cartRows] = await connection.execute(
        'SELECT id, cantidad FROM carrito WHERE user_id = ? AND producto_id = ?',
        [payload.userId, producto_id]
      )

      const cartItems = cartRows as any[]

      if (cartItems.length > 0) {
        // Actualizar cantidad existente
        const nuevaCantidad = cartItems[0].cantidad + cantidad
        
        if (nuevaCantidad > producto.stock) {
          return NextResponse.json({ 
            error: `Solo hay ${producto.stock} unidades disponibles` 
          }, { status: 400 })
        }

        await connection.execute(
          'UPDATE carrito SET cantidad = ? WHERE id = ?',
          [nuevaCantidad, cartItems[0].id]
        )
      } else {
        // Agregar nuevo item
        if (cantidad > producto.stock) {
          return NextResponse.json({ 
            error: `Solo hay ${producto.stock} unidades disponibles` 
          }, { status: 400 })
        }

        await connection.execute(
          'INSERT INTO carrito (user_id, producto_id, cantidad) VALUES (?, ?, ?)',
          [payload.userId, producto_id, cantidad]
        )
      }

      return NextResponse.json({ message: 'Producto agregado al carrito' })

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Error agregando al carrito:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// DELETE - Vaciar carrito completo
export async function DELETE(request: NextRequest) {
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
      await connection.execute(
        'DELETE FROM carrito WHERE user_id = ?',
        [payload.userId]
      )

      return NextResponse.json({ message: 'Carrito vaciado' })

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Error vaciando carrito:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
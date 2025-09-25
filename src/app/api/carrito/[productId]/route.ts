import { NextRequest, NextResponse } from 'next/server'
import { getConnection } from '../../../../../lib/supabase'
import { verifyToken } from '../../../../../lib/auth'

// PUT - Actualizar cantidad de un producto en el carrito
export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } }
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

    const { cantidad } = await request.json()
    const productId = parseInt(params.productId)

    if (!cantidad || cantidad < 1) {
      return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 })
    }

    const connection = await getConnection()

    try {
      // Verificar stock disponible
      const [productRows] = await connection.execute(
        'SELECT stock FROM productos WHERE id = ? AND activo = true',
        [productId]
      )

      const products = productRows as any[]
      if (products.length === 0) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
      }

      if (cantidad > products[0].stock) {
        return NextResponse.json({ 
          error: `Solo hay ${products[0].stock} unidades disponibles` 
        }, { status: 400 })
      }

      // Actualizar cantidad
      const [result] = await connection.execute(
        'UPDATE carrito SET cantidad = ? WHERE user_id = ? AND producto_id = ?',
        [cantidad, payload.userId, productId]
      )

      const updateResult = result as any
      if (updateResult.affectedRows === 0) {
        return NextResponse.json({ error: 'Item no encontrado en el carrito' }, { status: 404 })
      }

      return NextResponse.json({ message: 'Cantidad actualizada' })

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Error actualizando cantidad:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// DELETE - Eliminar un producto específico del carrito
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
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

    const productId = parseInt(params.productId)
    const connection = await getConnection()

    try {
      const [result] = await connection.execute(
        'DELETE FROM carrito WHERE user_id = ? AND producto_id = ?',
        [payload.userId, productId]
      )

      const deleteResult = result as any
      if (deleteResult.affectedRows === 0) {
        return NextResponse.json({ error: 'Item no encontrado en el carrito' }, { status: 404 })
      }

      return NextResponse.json({ message: 'Producto eliminado del carrito' })

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Error eliminando del carrito:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
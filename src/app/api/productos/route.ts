import { NextRequest, NextResponse } from 'next/server'
import { getConnection } from '../../../../lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')
    const busqueda = searchParams.get('busqueda')
    const ofertas = searchParams.get('ofertas') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    const connection = await getConnection()

    try {
      let query = `
        SELECT 
          p.id,
          p.nombre,
          p.descripcion,
          p.precio,
          p.precio_oferta as precio_original,
          p.stock,
          p.marca,
          p.imagen_url as imagen,
          p.activo,
          p.created_at,
          c.nombre as categoria,
          CASE 
            WHEN p.precio_oferta IS NOT NULL AND p.precio_oferta > p.precio 
            THEN ROUND(((p.precio_oferta - p.precio) / p.precio_oferta) * 100)
            ELSE 0
          END as descuento
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.activo = true
      `
      const params: any[] = []

      // Filtrar por ofertas (productos con precio_oferta)
      if (ofertas) {
        query += ` AND p.precio_oferta IS NOT NULL AND p.precio_oferta > p.precio`
      }

      // Filtrar por categoría
      if (categoria && categoria !== 'todos') {
        query += ` AND c.nombre = ?`
        params.push(categoria)
      }

      // Filtrar por búsqueda
      if (busqueda) {
        query += ` AND (p.nombre LIKE ? OR p.descripcion LIKE ? OR p.marca LIKE ?)`
        const searchTerm = `%${busqueda}%`
        params.push(searchTerm, searchTerm, searchTerm)
      }

      // Ordenar - si es ofertas, ordenar por descuento descendente
      if (ofertas) {
        query += ` ORDER BY descuento DESC, p.created_at DESC`
      } else {
        query += ` ORDER BY p.created_at DESC`
      }
      
      query += ` LIMIT ? OFFSET ?`
      params.push(limit, offset)

      const [rows] = await connection.execute(query, params)
      const productos = rows as any[]

      // Contar total de productos para paginación
      let countQuery = `
        SELECT COUNT(*) as total
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.activo = true
      `
      const countParams: any[] = []

      if (ofertas) {
        countQuery += ` AND p.precio_oferta IS NOT NULL AND p.precio_oferta > p.precio`
      }

      if (categoria && categoria !== 'todos') {
        countQuery += ` AND c.nombre = ?`
        countParams.push(categoria)
      }

      if (busqueda) {
        countQuery += ` AND (p.nombre LIKE ? OR p.descripcion LIKE ? OR p.marca LIKE ?)`
        const searchTerm = `%${busqueda}%`
        countParams.push(searchTerm, searchTerm, searchTerm)
      }

      const [countRows] = await connection.execute(countQuery, countParams)
      const total = (countRows as any[])[0].total

      return NextResponse.json({
        success: true,
        productos,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      })

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Error obteniendo productos:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server'
import { getConnection } from '../../../../lib/supabase'

export async function GET() {
  try {
    const connection = await getConnection()

    try {
      const [rows] = await connection.execute(
        'SELECT * FROM categorias WHERE activo = true ORDER BY nombre'
      )

      return NextResponse.json({
        categorias: rows
      })

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Error obteniendo categorías:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
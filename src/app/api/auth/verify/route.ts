import { NextRequest, NextResponse } from 'next/server'
import { getConnection } from '../../../../../lib/supabase'
import { verifyToken } from '../../../../../lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const connection = await getConnection()

    try {
      // Obtener información actualizada del usuario
      const [rows] = await connection.execute(
        'SELECT id, email, nombre, telefono, direccion, rol, activo, created_at FROM usuarios WHERE id = ? AND activo = true',
        [payload.userId]
      )

      const users = rows as any[]
      
      if (users.length === 0) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        user: users[0]
      })

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Error verificando token:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
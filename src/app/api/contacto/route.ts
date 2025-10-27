import { NextRequest, NextResponse } from 'next/server'
import { getConnection } from '../../../../lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, email, telefono, asunto, mensaje } = body

    // Validar campos requeridos
    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Todos los campos obligatorios deben ser completados' 
        },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'El formato del email no es válido' 
        },
        { status: 400 }
      )
    }

    const connection = await getConnection()

    try {
      // Crear tabla de mensajes de contacto si no existe
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS mensajes_contacto (
          id INT PRIMARY KEY AUTO_INCREMENT,
          nombre VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          telefono VARCHAR(20),
          asunto VARCHAR(255) NOT NULL,
          mensaje TEXT NOT NULL,
          estado ENUM('nuevo', 'leido', 'respondido') DEFAULT 'nuevo',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `)

      // Insertar el mensaje de contacto
      const [result] = await connection.execute(
        'INSERT INTO mensajes_contacto (nombre, email, telefono, asunto, mensaje) VALUES (?, ?, ?, ?, ?)',
        [nombre, email, telefono || null, asunto, mensaje]
      )

      // En una implementación real, aquí enviarías un email de notificación
      // Por ahora solo logeamos la información
      console.log('Nuevo mensaje de contacto recibido:', {
        id: (result as any).insertId,
        nombre,
        email,
        asunto
      })

      return NextResponse.json({
        success: true,
        message: 'Mensaje enviado exitosamente. Te responderemos pronto.',
        id: (result as any).insertId
      })

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Error procesando mensaje de contacto:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor. Intenta nuevamente más tarde.' 
      },
      { status: 500 }
    )
  }
}

// GET endpoint para obtener mensajes (solo para admins)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const estado = searchParams.get('estado')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const connection = await getConnection()

    try {
      let query = 'SELECT * FROM mensajes_contacto'
      const params: any[] = []

      if (estado && estado !== 'todos') {
        query += ' WHERE estado = ?'
        params.push(estado)
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
      params.push(limit, offset)

      const [rows] = await connection.execute(query, params)
      const mensajes = rows as any[]

      // Contar total para paginación
      let countQuery = 'SELECT COUNT(*) as total FROM mensajes_contacto'
      const countParams: any[] = []

      if (estado && estado !== 'todos') {
        countQuery += ' WHERE estado = ?'
        countParams.push(estado)
      }

      const [countRows] = await connection.execute(countQuery, countParams)
      const total = (countRows as any[])[0].total

      return NextResponse.json({
        success: true,
        mensajes,
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
    console.error('Error obteniendo mensajes de contacto:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    )
  }
}
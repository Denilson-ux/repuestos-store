import { NextRequest, NextResponse } from 'next/server'
import { getConnection } from '../../../../../lib/supabase'
import { verifyPassword, generateToken, validateEmail } from '../../../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validaciones
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    const connection = await getConnection()

    try {
      // Buscar usuario
      const [rows] = await connection.execute(
        'SELECT * FROM usuarios WHERE email = ? AND activo = true',
        [email]
      )

      const users = rows as any[]
      
      if (users.length === 0) {
        return NextResponse.json(
          { error: 'Credenciales inválidas' },
          { status: 401 }
        )
      }

      const user = users[0]

      // Verificar contraseña
      const isValidPassword = await verifyPassword(password, user.password)
      
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Credenciales inválidas' },
          { status: 401 }
        )
      }

      // Generar token
      const token = generateToken({
        id: user.id,
        email: user.email,
        rol: user.rol
      })

      // Eliminar password de la respuesta
      const { password: _, ...userWithoutPassword } = user

      return NextResponse.json({
        message: 'Login exitoso',
        token,
        user: userWithoutPassword
      })

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

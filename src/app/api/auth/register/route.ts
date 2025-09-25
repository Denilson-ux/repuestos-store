import { NextRequest, NextResponse } from 'next/server'
import { getConnection } from '../../../../../lib/supabase'
import { hashPassword, generateToken, validateEmail, validatePassword } from '../../../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, nombre } = await request.json()

    // Validaciones
    if (!email || !password || !nombre) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      )
    }

    const connection = await getConnection()

    try {
      // Verificar si el usuario ya existe
      const [existingRows] = await connection.execute(
        'SELECT id FROM usuarios WHERE email = ?',
        [email]
      )

      const existingUsers = existingRows as any[]
      
      if (existingUsers.length > 0) {
        return NextResponse.json(
          { error: 'El email ya está registrado' },
          { status: 409 }
        )
      }

      // Hash de la contraseña
      const hashedPassword = await hashPassword(password)

      // Crear usuario
      const [result] = await connection.execute(
        'INSERT INTO usuarios (email, password, nombre) VALUES (?, ?, ?)',
        [email, hashedPassword, nombre]
      )

      const insertResult = result as any
      const userId = insertResult.insertId

      // Obtener el usuario creado
      const [userRows] = await connection.execute(
        'SELECT id, email, nombre, telefono, direccion, rol, activo, created_at FROM usuarios WHERE id = ?',
        [userId]
      )

      const users = userRows as any[]
      const user = users[0]

      // Generar token
      const token = generateToken({
        id: user.id,
        email: user.email,
        rol: user.rol
      })

      return NextResponse.json({
        message: 'Usuario registrado exitosamente',
        token,
        user
      }, { status: 201 })

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
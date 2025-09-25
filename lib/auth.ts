import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'tu_jwt_secret_super_seguro'

// Tipos de datos
export interface Usuario {
  id: number
  email: string
  nombre: string
  telefono?: string
  direccion?: string
  rol: 'cliente' | 'admin'
  activo: boolean
  created_at: string
}

export interface JWTPayload {
  userId: number
  email: string
  rol: string
}

// Funciones para JWT
export function generateToken(user: { id: number; email: string; rol: string }): string {
  return jwt.sign(
    { userId: user.id, email: user.email, rol: user.rol },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

// Funciones para passwords
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Validaciones
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' }
  }
  return { valid: true }
}
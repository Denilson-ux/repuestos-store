import mysql from 'mysql2/promise'

// Configuración de la base de datos
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'repuestos_bolivia',
}

// Crear conexión a la base de datos
export async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig)
    return connection
  } catch (error) {
    console.error('Error conectando a la base de datos:', error)
    throw error
  }
}

// Tipos de datos que usaremos
export interface User {
  id: string
  email: string
  nombre: string
  telefono?: string
  direccion?: string
  created_at: string
}

export interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  precio_oferta?: number
  stock: number
  categoria: string
  marca: string
  imagen_url: string
  activo: boolean
  created_at: string
}

export interface CarritoItem {
  id: string
  user_id: string
  producto_id: string
  cantidad: number
  created_at: string
  producto?: Producto
}

export interface Pedido {
  id: string
  user_id: string
  total: number
  estado: 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado'
  metodo_pago: string
  direccion_envio: string
  telefono_contacto: string
  created_at: string
}
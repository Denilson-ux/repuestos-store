// Simulación de usuarios para pruebas
import { Usuario } from './auth';

export const usuarios: (Usuario & { password: string })[] = [
  {
    id: 1,
    email: 'admin@demo.com',
    nombre: 'Admin',
    telefono: '123456789',
    direccion: 'Calle Falsa 123',
    rol: 'admin',
    activo: true,
    created_at: new Date().toISOString(),
    password: '$2a$10$7QwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', // hash de 'admin123'
  },
  {
    id: 2,
    email: 'cliente@demo.com',
    nombre: 'Cliente',
    telefono: '987654321',
    direccion: 'Avenida Siempre Viva 742',
    rol: 'cliente',
    activo: true,
    created_at: new Date().toISOString(),
    password: '$2a$10$7QwQwQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', // hash de 'cliente123'
  },
];

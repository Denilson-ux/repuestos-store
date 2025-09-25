-- Crear base de datos (ejecutar primero)
CREATE DATABASE IF NOT EXISTS repuestos_bolivia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE repuestos_bolivia;

-- Tabla de usuarios
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  direccion TEXT,
  rol ENUM('cliente', 'admin') DEFAULT 'cliente',
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE categorias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE productos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  precio_oferta DECIMAL(10,2) NULL,
  stock INT DEFAULT 0,
  categoria_id INT,
  marca VARCHAR(100) NOT NULL,
  imagen_url VARCHAR(500),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
  INDEX idx_categoria (categoria_id),
  INDEX idx_activo (activo),
  INDEX idx_precio (precio)
);

-- Tabla del carrito
CREATE TABLE carrito (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, producto_id)
);

-- Tabla de pedidos
CREATE TABLE pedidos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  estado ENUM('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado') DEFAULT 'pendiente',
  metodo_pago VARCHAR(50) NOT NULL,
  direccion_envio TEXT NOT NULL,
  telefono_contacto VARCHAR(20) NOT NULL,
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_estado (estado),
  INDEX idx_created_at (created_at)
);

-- Tabla de items del pedido
CREATE TABLE pedido_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- Insertar categorías iniciales
INSERT INTO categorias (nombre, descripcion) VALUES
('Motor', 'Repuestos para motor del vehículo'),
('Frenos', 'Sistema de frenos y componentes'),
('Suspensión', 'Amortiguadores, resortes y suspensión'),
('Eléctrico', 'Sistema eléctrico y electrónico'),
('Carrocería', 'Partes externas y carrocería'),
('Transmisión', 'Caja de cambios y transmisión'),
('Filtros', 'Filtros de aire, aceite, combustible'),
('Lubricantes', 'Aceites y lubricantes'),
('Neumáticos', 'Llantas y neumáticos'),
('Accesorios', 'Accesorios varios para vehículos');

-- Insertar usuario admin por defecto (password: admin123)
INSERT INTO usuarios (email, password, nombre, rol) VALUES
('admin@repuestosbolivia.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 'admin');

-- Insertar algunos productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, marca, imagen_url) VALUES
('Filtro de Aceite', 'Filtro de aceite para motor Toyota', 45.00, 50, 7, 'Toyota', '/images/productos/filtro-aceite.jpg'),
('Pastillas de Freno Delanteras', 'Pastillas de freno para Toyota Corolla', 120.00, 30, 2, 'Toyota', '/images/productos/pastillas-freno.jpg'),
('Amortiguador Trasero', 'Amortiguador trasero para Hyundai Accent', 180.00, 20, 3, 'Hyundai', '/images/productos/amortiguador.jpg'),
('Batería 12V', 'Batería de arranque 12V 60Ah', 350.00, 15, 4, 'Universal', '/images/productos/bateria.jpg'),
('Aceite Motor 5W30', 'Aceite sintético para motor 5W30', 85.00, 40, 8, 'Castrol', '/images/productos/aceite-motor.jpg');
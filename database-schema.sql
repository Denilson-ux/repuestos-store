-- =====================================================
-- SCRIPT COMPLETO DE BASE DE DATOS - REPUESTOS BOLIVIA
-- =====================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS repuestos_bolivia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE repuestos_bolivia;

-- =====================================================
-- CREAR TABLAS
-- =====================================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios ( 
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
CREATE TABLE IF NOT EXISTS categorias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
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
CREATE TABLE IF NOT EXISTS carrito (
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
CREATE TABLE IF NOT EXISTS pedidos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  estado ENUM('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado') DEFAULT 'pendiente',
  metodo_pago VARCHAR(50) NOT NULL,
  direccion_envio TEXT NOT NULL,
  telefono_contacto VARCHAR(20) NOT NULL,
  notas TEXT,
  transaction_id VARCHAR(255) NULL,
  payment_data JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_estado (estado),
  INDEX idx_created_at (created_at),
  INDEX idx_transaction_id (transaction_id)
);

-- Tabla de items del pedido
CREATE TABLE IF NOT EXISTS pedido_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- =====================================================
-- INSERTAR CATEGORÍAS
-- =====================================================

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
('Accesorios', 'Accesorios varios para vehículos'),
('Dirección', 'Sistema de dirección y componentes'),
('Cremalleras', 'Cremalleras de dirección hidráulicas y eléctricas');

-- =====================================================
-- INSERTAR USUARIO ADMIN
-- =====================================================
-- Email: admin@repuestosbolivia.com
-- Password: admin123

INSERT INTO usuarios (email, password, nombre, rol) VALUES
('admin@repuestosbolivia.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 'admin');

-- =====================================================
-- INSERTAR PRODUCTOS DE EJEMPLO
-- =====================================================

-- Productos iniciales básicos
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, marca, imagen_url) VALUES
('Filtro de Aceite', 'Filtro de aceite para motor Toyota', 45.00, 50, 7, 'Toyota', '/images/productos/filtro-aceite.png'),
('Pastillas de Freno Delanteras', 'Pastillas de freno para Toyota Corolla', 120.00, 30, 2, 'Toyota', '/images/productos/pastillas-freno-delanteras.png'),
('Amortiguador Trasero', 'Amortiguador trasero para Hyundai Accent', 180.00, 20, 3, 'Hyundai', '/images/productos/amortiguador-trasero.png'),
('Batería 12V', 'Batería de arranque 12V 60Ah', 350.00, 15, 4, 'Universal', '/images/productos/bateria-12v.png'),
('Aceite Motor 5W30', 'Aceite sintético para motor 5W30', 85.00, 40, 8, 'Castrol', '/images/productos/aceite-motor-5w30.png');

-- Más productos de ejemplo con imágenes locales
INSERT INTO productos (nombre, descripcion, precio, precio_oferta, stock, categoria_id, marca, imagen_url) VALUES
-- Motor
('Filtro de Aire', 'Filtro de aire para Toyota Corolla 2018-2023', 35.00, NULL, 25, 1, 'Toyota', '/images/productos/filtro-aire.png'),
('Bujías NGK', 'Set de 4 bujías NGK para motor 1.8L', 80.00, 70.00, 15, 1, 'NGK', '/images/productos/bujias-ngk.png'),
('Filtro de Combustible', 'Filtro de combustible universal', 25.00, NULL, 30, 1, 'Universal', '/images/productos/filtro-combustible.png'),

-- Frenos
('Pastillas de Freno Traseras', 'Pastillas de freno traseras para Hyundai Accent', 90.00, 80.00, 20, 2, 'Hyundai', '/images/productos/pastillas-freno-traseras.png'),
('Disco de Freno Delantero', 'Disco de freno ventilado delantero', 150.00, NULL, 12, 2, 'Brembo', '/images/productos/disco-freno-delantero.png'),
('Líquido de Frenos DOT 4', 'Líquido de frenos DOT 4 - 500ml', 40.00, NULL, 50, 2, 'Castrol', '/images/productos/liquido-frenos-dot4.png'),

-- Suspensión
('Amortiguador Delantero', 'Amortiguador delantero para Suzuki Swift', 160.00, 140.00, 18, 3, 'Suzuki', '/images/productos/amortiguador-delantero.png'),
('Resortes Traseros', 'Par de resortes traseros reforzados', 120.00, NULL, 10, 3, 'Universal', '/images/productos/resortes-traseros.png'),
('Bujes de Suspensión', 'Kit de bujes de suspensión delantera', 70.00, NULL, 25, 3, 'Toyota', '/images/productos/bujes-suspension.png'),

-- Eléctrico
('Alternador', 'Alternador 12V 90A para motor 1.6L', 380.00, 350.00, 8, 4, 'Bosch', '/images/productos/alternador.png'),
('Motor de Arranque', 'Motor de arranque reforzado', 420.00, NULL, 6, 4, 'Valeo', '/images/productos/motor-arranque.png'),
('Fusibles Set', 'Set de fusibles automotrices variados', 15.00, NULL, 100, 4, 'Universal', '/images/productos/fusibles-set.png'),

-- Carrocería
('Espejo Lateral Derecho', 'Espejo lateral derecho con señal', 95.00, 85.00, 15, 5, 'Toyota', '/images/productos/espejo-lateral-derecho.png'),
('Faro Delantero', 'Faro delantero LED para Hyundai i10', 180.00, NULL, 10, 5, 'Hyundai', '/images/productos/faro-delantero.png'),
('Parachoques Trasero', 'Parachoques trasero original', 250.00, 220.00, 5, 5, 'Suzuki', '/images/productos/parachoques-trasero.png'),

-- Filtros
('Filtro de Habitáculo', 'Filtro de aire acondicionado/calefacción', 30.00, NULL, 40, 7, 'Mann Filter', '/images/productos/filtro-habitaculo.png'),
('Filtro Hidráulico', 'Filtro para dirección hidráulica', 45.00, 40.00, 20, 7, 'Mahle', '/images/productos/filtro-hidraulico.png'),

-- Lubricantes
('Aceite Transmisión', 'Aceite para caja de cambios automática', 95.00, NULL, 25, 8, 'Mobil', '/images/productos/aceite-transmision.png'),
('Grasa Multiuso', 'Grasa multiuso para chasis - 400g', 35.00, NULL, 35, 8, 'Shell', '/images/productos/grasa-multiuso.png'),

-- Neumáticos
('Neumático 185/65 R14', 'Neumático radial 185/65 R14', 280.00, 260.00, 20, 9, 'Michelin', '/images/productos/neumatico-185-65-r14.png'),
('Neumático 205/55 R16', 'Neumático deportivo 205/55 R16', 350.00, NULL, 15, 9, 'Bridgestone', '/images/productos/neumatico-205-55-r16.png'),

-- Accesorios
('Tapetes de Goma', 'Set de 4 tapetes universales de goma', 60.00, 50.00, 30, 10, 'Universal', '/images/productos/tapetes-goma.png'),
('Fundas de Asientos', 'Fundas universales para asientos', 120.00, NULL, 20, 10, 'Universal', '/images/productos/fundas-asientos.png');

-- =====================================================
-- INSERTAR CREMALLERAS DE DIRECCIÓN
-- =====================================================

-- PRODUCTOS TOYOTA
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, marca, imagen_url) VALUES
('Cremallera Dirección Toyota Hilux Revo 2016-2022', 'Cremallera de dirección hidráulica YOKOMITSU. Código: SPTY508103', 2300.00, 5, 12, 'Toyota', '/images/productos/cremalleras/hilux-revo.png'),
('Cremallera Dirección Toyota Hilux Vigo 2005-2015', 'Cremallera de dirección hidráulica YOKOMITSU. Código: SPTY158103', 2300.00, 5, 12, 'Toyota', '/images/productos/cremalleras/hilux-vigo.png'),
('Cremallera Dirección Toyota Hilux 2.5 2007-/Fortuner', 'Cremallera de dirección NGP. Código: STG52798', 3000.00, 4, 12, 'Toyota', '/images/productos/cremalleras/hilux-fortuner.png'),
('Cremallera Dirección Toyota Highlander 2007-2014', 'Cremallera de dirección NGP LHD. Código: STG57979(LHD)', 3300.00, 3, 12, 'Toyota', '/images/productos/cremalleras/highlander.png'),
('Cremallera Dirección Toyota RAV4 2006-2012', 'Cremallera de dirección PALERMO. Código: R0612', 1500.00, 8, 12, 'Toyota', '/images/productos/cremalleras/rav4-2006.png'),
('Cremallera Dirección Toyota RAV4 2000-2004', 'Cremallera de dirección PALERMO. Código: TR44200', 1812.50, 6, 12, 'Toyota', '/images/productos/cremalleras/rav4-2000.png'),
('Cremallera Dirección Toyota RAV4 1996', 'Cremallera de dirección PALERMO. Código: TR44250', 1500.00, 4, 12, 'Toyota', '/images/productos/cremalleras/rav4-1996.png'),
('Cremallera Dirección Toyota RAV4 2018', 'Cremallera de dirección PREMIUM PLUS. Código: STG22815', 15180.00, 2, 12, 'Toyota', '/images/productos/cremalleras/rav4-2018.png'),
('Cremallera Dirección Toyota Corolla Americano 2013-2018', 'Cremallera de dirección PALERMO. Código: TC1318', 1875.00, 7, 12, 'Toyota', '/images/productos/cremalleras/corolla.png'),
('Cremallera Dirección Toyota Corolla/Hyundai Accent/Kia Rio', 'Cremallera de dirección YOKOMITSU universal. Código: CNCH000002', 1400.00, 10, 12, 'Toyota', '/images/productos/cremalleras/corolla-accent-rio.png'),
('Cremallera Dirección Toyota Tundra 2008-2020', 'Cremallera de dirección PREMIUM NYP. Código: 44250-0C070', 3200.00, 3, 12, 'Toyota', '/images/productos/cremalleras/tundra.png'),
('Cremallera Dirección Toyota Tacoma 2004-2012', 'Cremallera de dirección NGP LHD. Código: STG80291(LHD)', 3300.00, 3, 12, 'Toyota', '/images/productos/cremalleras/tacoma.png');

-- PRODUCTOS SUZUKI
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, marca, imagen_url) VALUES
('Cremallera Dirección Suzuki Alto 2015', 'Cremallera de dirección TOZAKI. Código: RT2107', 1500.00, 8, 12, 'Suzuki', '/images/productos/cremalleras/alto-2015.png'),
('Cremallera Dirección Suzuki Alto 2010', 'Cremallera de dirección YOKOMITSU. Código: 9909240749', 1350.00, 10, 12, 'Suzuki', '/images/productos/cremalleras/alto-2010.png'),
('Cremallera Dirección Suzuki Alto/Nissan Pixo 2009- Mecánica', 'Cremallera de dirección mecánica. Código: STG7A439', 1950.00, 6, 12, 'Suzuki', '/images/productos/cremalleras/alto-pixo.png'),
('Cremallera Dirección Suzuki SX4 Electrónica 2014', 'Cremallera de dirección electrónica TOZAKI. Código: 48500-SZ016', 2300.00, 5, 12, 'Suzuki', '/images/productos/cremalleras/sx4.png'),
('Cremallera Dirección Suzuki Swift', 'Cremallera de dirección FROTISE. Código: 48500-78M00', 2200.00, 7, 12, 'Suzuki', '/images/productos/cremalleras/swift.png');

-- PRODUCTOS HONDA
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, marca, imagen_url) VALUES
('Cremallera Dirección Honda Pilot 2009- 3.5L', 'Cremallera de dirección NGP. Código: STG8A457', 4200.00, 3, 12, 'Honda', '/images/productos/cremalleras/pilot.png'),
('Cremallera Dirección Honda HR-V', 'Cremallera de dirección YOKOMITSU. Código: SOH0088113', 1800.00, 7, 12, 'Honda', '/images/productos/cremalleras/hrv.png');

-- PRODUCTOS NISSAN
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, marca, imagen_url) VALUES
('Cremallera Dirección Nissan Versa 2020-2022', 'Cremallera de dirección YOKOMITSU. Código: SPN5608113', 2000.00, 6, 12, 'Nissan', '/images/productos/cremalleras/versa.png');

-- PRODUCTOS CHEVROLET
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, marca, imagen_url) VALUES
('Cremallera Dirección Chevrolet Aveo 2010-2017', 'Cremallera de dirección MXD-TEK. Código: 932386311', 2535.00, 5, 12, 'Chevrolet', '/images/productos/cremalleras/aveo.png');

-- PRODUCTOS HYUNDAI
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, marca, imagen_url) VALUES
('Cremallera Dirección Hyundai Accent 2018-2022', 'Cremallera de dirección YOKOMITSU. Código: SPHY018123', 1800.00, 7, 12, 'Hyundai', '/images/productos/cremalleras/accent.png');

-- PRODUCTOS JEEP
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, marca, imagen_url) VALUES
('Cremallera Dirección Jeep Renegade 2014-2019', 'Cremallera de dirección PREMIUM PLUS. Código: STG79641', 2200.00, 4, 12, 'Jeep', '/images/productos/cremalleras/renegade.png');

-- PRODUCTOS SUBARU
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, marca, imagen_url) VALUES
('Cremallera Dirección Subaru Forester', 'Cremallera de dirección PALERMO. Código: SFSA080', 2000.00, 5, 12, 'Subaru', '/images/productos/cremalleras/forester.png');

-- PRODUCTOS CHANGAN
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, marca, imagen_url) VALUES
('Cremallera Dirección Changan C535 Plus 2019-2020', 'Cremallera de dirección PREMIUM PLUS. Código: STG86249', 2200.00, 4, 12, 'Changan', '/images/productos/cremalleras/c535-plus.png');

-- PRODUCTOS MAZDA
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, marca, imagen_url) VALUES
('Cremallera Dirección Mazda CX-5 2013-2016', 'Cremallera de dirección NGP. Código: STG16636', 2300.00, 5, 12, 'Mazda', '/images/productos/cremalleras/cx5.png');

-- =====================================================
-- RESUMEN FINAL
-- =====================================================

SELECT '========================================' as '';
SELECT 'BASE DE DATOS CREADA EXITOSAMENTE' as '';
SELECT '========================================' as '';
SELECT '' as '';

SELECT 'RESUMEN DE CATEGORÍAS:' as '';
SELECT COUNT(*) as 'Total Categorías' FROM categorias;
SELECT '' as '';

SELECT 'RESUMEN DE PRODUCTOS:' as '';
SELECT 
    c.nombre as Categoria,
    COUNT(p.id) as 'Total Productos',
    CONCAT('Bs ', MIN(p.precio)) as 'Precio Mínimo',
    CONCAT('Bs ', MAX(p.precio)) as 'Precio Máximo'
FROM productos p
INNER JOIN categorias c ON p.categoria_id = c.id
GROUP BY c.nombre
ORDER BY c.nombre;

SELECT '' as '';
SELECT 'Usuario Admin creado:' as '';
SELECT 'Email: admin@repuestosbolivia.com' as '';
SELECT 'Password: admin123' as '';
SELECT '========================================' as '';
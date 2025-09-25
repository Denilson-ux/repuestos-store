-- Insertar más productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, precio_oferta, stock, categoria_id, marca, imagen_url) VALUES
-- Motor (categoria_id = 1)
('Filtro de Aire', 'Filtro de aire para Toyota Corolla 2018-2023', 35.00, NULL, 25, 1, 'Toyota', 'https://via.placeholder.com/300x300/2563eb/ffffff?text=Filtro+Aire'),
('Bujías NGK', 'Set de 4 bujías NGK para motor 1.8L', 80.00, 70.00, 15, 1, 'NGK', 'https://via.placeholder.com/300x300/dc2626/ffffff?text=Bujias'),
('Filtro de Combustible', 'Filtro de combustible universal', 25.00, NULL, 30, 1, 'Universal', 'https://via.placeholder.com/300x300/059669/ffffff?text=Filtro+Combustible'),

-- Frenos (categoria_id = 2)
('Pastillas de Freno Traseras', 'Pastillas de freno traseras para Hyundai Accent', 90.00, 80.00, 20, 2, 'Hyundai', 'https://via.placeholder.com/300x300/7c3aed/ffffff?text=Pastillas+Traseras'),
('Disco de Freno Delantero', 'Disco de freno ventilado delantero', 150.00, NULL, 12, 2, 'Brembo', 'https://via.placeholder.com/300x300/ea580c/ffffff?text=Disco+Freno'),
('Líquido de Frenos DOT 4', 'Líquido de frenos DOT 4 - 500ml', 40.00, NULL, 50, 2, 'Castrol', 'https://via.placeholder.com/300x300/0891b2/ffffff?text=Liquido+Frenos'),

-- Suspensión (categoria_id = 3)
('Amortiguador Delantero', 'Amortiguador delantero para Suzuki Swift', 160.00, 140.00, 18, 3, 'Suzuki', 'https://via.placeholder.com/300x300/be185d/ffffff?text=Amortiguador+Del'),
('Resortes Traseros', 'Par de resortes traseros reforzados', 120.00, NULL, 10, 3, 'Universal', 'https://via.placeholder.com/300x300/059669/ffffff?text=Resortes'),
('Bujes de Suspensión', 'Kit de bujes de suspensión delantera', 70.00, NULL, 25, 3, 'Toyota', 'https://via.placeholder.com/300x300/7c2d12/ffffff?text=Bujes'),

-- Eléctrico (categoria_id = 4)
('Alternador', 'Alternador 12V 90A para motor 1.6L', 380.00, 350.00, 8, 4, 'Bosch', 'https://via.placeholder.com/300x300/1d4ed8/ffffff?text=Alternador'),
('Motor de Arranque', 'Motor de arranque reforzado', 420.00, NULL, 6, 4, 'Valeo', 'https://via.placeholder.com/300x300/dc2626/ffffff?text=Motor+Arranque'),
('Fusibles Set', 'Set de fusibles automotrices variados', 15.00, NULL, 100, 4, 'Universal', 'https://via.placeholder.com/300x300/7c3aed/ffffff?text=Fusibles'),

-- Carrocería (categoria_id = 5)
('Espejo Lateral Derecho', 'Espejo lateral derecho con señal', 95.00, 85.00, 15, 5, 'Toyota', 'https://via.placeholder.com/300x300/ea580c/ffffff?text=Espejo+Derecho'),
('Faro Delantero', 'Faro delantero LED para Hyundai i10', 180.00, NULL, 10, 5, 'Hyundai', 'https://via.placeholder.com/300x300/0891b2/ffffff?text=Faro+LED'),
('Parachoques Trasero', 'Parachoques trasero original', 250.00, 220.00, 5, 5, 'Suzuki', 'https://via.placeholder.com/300x300/be185d/ffffff?text=Parachoques'),

-- Filtros (categoria_id = 7)
('Filtro de Habitáculo', 'Filtro de aire acondicionado/calefacción', 30.00, NULL, 40, 7, 'Mann Filter', 'https://via.placeholder.com/300x300/059669/ffffff?text=Filtro+Habitaculo'),
('Filtro Hidráulico', 'Filtro para dirección hidráulica', 45.00, 40.00, 20, 7, 'Mahle', 'https://via.placeholder.com/300x300/7c2d12/ffffff?text=Filtro+Hidraulico'),

-- Lubricantes (categoria_id = 8)
('Aceite Transmisión', 'Aceite para caja de cambios automática', 95.00, NULL, 25, 8, 'Mobil', 'https://via.placeholder.com/300x300/1d4ed8/ffffff?text=Aceite+Transmision'),
('Grasa Multiuso', 'Grasa multiuso para chasis - 400g', 35.00, NULL, 35, 8, 'Shell', 'https://via.placeholder.com/300x300/dc2626/ffffff?text=Grasa'),

-- Neumáticos (categoria_id = 9)
('Neumático 185/65 R14', 'Neumático radial 185/65 R14', 280.00, 260.00, 20, 9, 'Michelin', 'https://via.placeholder.com/300x300/7c3aed/ffffff?text=Neumatico+R14'),
('Neumático 205/55 R16', 'Neumático deportivo 205/55 R16', 350.00, NULL, 15, 9, 'Bridgestone', 'https://via.placeholder.com/300x300/ea580c/ffffff?text=Neumatico+R16'),

-- Accesorios (categoria_id = 10)
('Tapetes de Goma', 'Set de 4 tapetes universales de goma', 60.00, 50.00, 30, 10, 'Universal', 'https://via.placeholder.com/300x300/0891b2/ffffff?text=Tapetes'),
('Fundas de Asientos', 'Fundas universales para asientos', 120.00, NULL, 20, 10, 'Universal', 'https://via.placeholder.com/300x300/be185d/ffffff?text=Fundas');
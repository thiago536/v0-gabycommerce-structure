-- Seed data for GabySummer E-commerce

-- Insert categories
INSERT INTO categories (name, slug, description, background_image_url) VALUES
('Moda Praia', 'moda-praia', 'Biquínis, maiôs e saídas de praia para um verão perfeito', '/placeholder.svg?height=800&width=1200'),
('Fitness', 'fitness', 'Roupas esportivas para treinar com estilo', '/placeholder.svg?height=800&width=1200'),
('Acessórios', 'acessorios', 'Bolsas, chapéus e acessórios para completar seu look', '/placeholder.svg?height=800&width=1200');

-- Insert sample products for Moda Praia
INSERT INTO products (name, slug, description, short_description, price, promotional_price, sku, category_id, images, stock_quantity) VALUES
('Biquíni Tropical Laranja', 'biquini-tropical-laranja', 'Biquíni com estampa tropical em tons vibrantes de laranja. Tecido de alta qualidade com proteção UV. Ideal para dias ensolarados na praia.', 'Biquíni tropical com proteção UV', 89.90, 69.90, 'BIQ-TROP-001', (SELECT id FROM categories WHERE slug = 'moda-praia'), '["https://placeholder.svg?height=600&width=400&query=orange tropical bikini on model", "https://placeholder.svg?height=600&width=400&query=orange bikini detail shot"]', 25),

('Maiô Elegante Branco', 'maio-elegante-branco', 'Maiô de uma peça em branco puro com detalhes em dourado. Design sofisticado e confortável para o dia todo na praia.', 'Maiô branco com detalhes dourados', 129.90, NULL, 'MAI-ELEG-001', (SELECT id FROM categories WHERE slug = 'moda-praia'), '["https://placeholder.svg?height=600&width=400&query=elegant white one piece swimsuit", "https://placeholder.svg?height=600&width=400&query=white swimsuit back view"]', 15),

('Saída de Praia Coral', 'saida-praia-coral', 'Saída de praia leve e fluida em tom coral. Perfeita para usar sobre o biquíni ou maiô.', 'Saída de praia fluida coral', 79.90, 59.90, 'SAI-CORAL-001', (SELECT id FROM categories WHERE slug = 'moda-praia'), '["https://placeholder.svg?height=600&width=400&query=coral beach cover up flowing fabric"]', 20);

-- Insert sample products for Fitness
INSERT INTO products (name, slug, description, short_description, price, sku, category_id, images, stock_quantity) VALUES
('Top Fitness Laranja Neon', 'top-fitness-laranja-neon', 'Top esportivo de alta performance em laranja neon. Tecido que absorve o suor e oferece suporte durante os exercícios.', 'Top esportivo laranja neon', 49.90, 'TOP-FIT-001', (SELECT id FROM categories WHERE slug = 'fitness'), '["https://placeholder.svg?height=600&width=400&query=neon orange sports bra fitness top", "https://placeholder.svg?height=600&width=400&query=fitness top detail fabric texture"]', 30),

('Legging Fitness Branca', 'legging-fitness-branca', 'Legging de cintura alta em branco com detalhes em laranja. Tecido compressivo e confortável.', 'Legging branca cintura alta', 69.90, 'LEG-FIT-001', (SELECT id FROM categories WHERE slug = 'fitness'), '["https://placeholder.svg?height=600&width=400&query=white high waist fitness leggings with orange details"]', 25);

-- Insert sample products for Acessórios
INSERT INTO products (name, slug, description, short_description, price, sku, category_id, images, stock_quantity) VALUES
('Bolsa de Praia Palha Natural', 'bolsa-praia-palha-natural', 'Bolsa espaçosa de palha natural com alças em couro. Perfeita para levar tudo que você precisa para a praia.', 'Bolsa de praia em palha natural', 89.90, 'BOL-PALHA-001', (SELECT id FROM categories WHERE slug = 'acessorios'), '["https://placeholder.svg?height=600&width=400&query=natural straw beach bag with leather handles"]', 18),

('Chapéu de Palha Aba Larga', 'chapeu-palha-aba-larga', 'Chapéu de palha com aba larga para proteção solar. Fita decorativa em tom coral.', 'Chapéu de palha com proteção UV', 59.90, 'CHA-PALHA-001', (SELECT id FROM categories WHERE slug = 'acessorios'), '["https://placeholder.svg?height=600&width=400&query=wide brim straw hat with coral ribbon"]', 22);

-- Insert product variants for sizes
INSERT INTO product_variants (product_id, name, sku, attributes, stock_quantity) VALUES
-- Biquíni Tropical Laranja variants
((SELECT id FROM products WHERE sku = 'BIQ-TROP-001'), 'P', 'BIQ-TROP-001-P', '{"size": "P"}', 8),
((SELECT id FROM products WHERE sku = 'BIQ-TROP-001'), 'M', 'BIQ-TROP-001-M', '{"size": "M"}', 10),
((SELECT id FROM products WHERE sku = 'BIQ-TROP-001'), 'G', 'BIQ-TROP-001-G', '{"size": "G"}', 7),

-- Maiô Elegante Branco variants
((SELECT id FROM products WHERE sku = 'MAI-ELEG-001'), 'P', 'MAI-ELEG-001-P', '{"size": "P"}', 5),
((SELECT id FROM products WHERE sku = 'MAI-ELEG-001'), 'M', 'MAI-ELEG-001-M', '{"size": "M"}', 6),
((SELECT id FROM products WHERE sku = 'MAI-ELEG-001'), 'G', 'MAI-ELEG-001-G', '{"size": "G"}', 4),

-- Top Fitness variants
((SELECT id FROM products WHERE sku = 'TOP-FIT-001'), 'P', 'TOP-FIT-001-P', '{"size": "P"}', 10),
((SELECT id FROM products WHERE sku = 'TOP-FIT-001'), 'M', 'TOP-FIT-001-M', '{"size": "M"}', 12),
((SELECT id FROM products WHERE sku = 'TOP-FIT-001'), 'G', 'TOP-FIT-001-G', '{"size": "G"}', 8),

-- Legging Fitness variants
((SELECT id FROM products WHERE sku = 'LEG-FIT-001'), 'P', 'LEG-FIT-001-P', '{"size": "P"}', 8),
((SELECT id FROM products WHERE sku = 'LEG-FIT-001'), 'M', 'LEG-FIT-001-M', '{"size": "M"}', 10),
((SELECT id FROM products WHERE sku = 'LEG-FIT-001'), 'G', 'LEG-FIT-001-G', '{"size": "G"}', 7);

-- Insert sample coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_value, usage_limit, valid_until) VALUES
('VERAO2024', 'Desconto de verão - 15% off', 'percentage', 15.00, 100.00, 100, '2024-03-31 23:59:59'),
('PRIMEIRACOMPRA', 'Desconto primeira compra - R$ 20 off', 'fixed', 20.00, 80.00, 50, '2024-12-31 23:59:59'),
('FRETEGRATIS', 'Frete grátis acima de R$ 150', 'percentage', 10.00, 150.00, NULL, '2024-12-31 23:59:59');

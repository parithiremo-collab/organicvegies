INSERT INTO categories (id, name, slug, image_url, product_count) VALUES
('cat-1', 'Vegetables', 'vegetables', 'https://via.placeholder.com/300?text=Vegetables', 3),
('cat-2', 'Fruits', 'fruits', 'https://via.placeholder.com/300?text=Fruits', 2),
('cat-3', 'Grains', 'grains', 'https://via.placeholder.com/300?text=Grains', 0),
('cat-4', 'Dairy', 'dairy', 'https://via.placeholder.com/300?text=Dairy', 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, category_id, name, description, image_url, price, mrp, rating, review_count, origin, in_stock, low_stock, weight) VALUES
('prod-1', 'cat-1', 'Organic Tomatoes', 'Fresh red tomatoes from certified organic farms', 'https://via.placeholder.com/300?text=Tomatoes', 120.00, 150.00, 4.5, 120, 'Karnataka', true, false, '1kg'),
('prod-2', 'cat-1', 'Organic Spinach', 'Fresh spinach leaves, pesticide-free', 'https://via.placeholder.com/300?text=Spinach', 80.00, 100.00, 4.8, 95, 'Himachal Pradesh', true, false, '500g'),
('prod-3', 'cat-1', 'Organic Carrots', 'Sweet orange carrots from northern farms', 'https://via.placeholder.com/300?text=Carrots', 100.00, 130.00, 4.6, 110, 'Punjab', true, true, '1kg'),
('prod-4', 'cat-2', 'Organic Apples', 'Crispy red apples, fresh from orchards', 'https://via.placeholder.com/300?text=Apples', 200.00, 250.00, 4.7, 140, 'Himachal Pradesh', true, false, '1kg'),
('prod-5', 'cat-2', 'Organic Bananas', 'Ripe yellow bananas, naturally ripened', 'https://via.placeholder.com/300?text=Bananas', 60.00, 80.00, 4.5, 98, 'Gujarat', true, false, '1kg')
ON CONFLICT (id) DO NOTHING;

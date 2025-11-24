INSERT INTO products (id, category_id, name, description, image_url, price, mrp, rating, review_count, origin, in_stock, low_stock, weight) 
SELECT 
  'prod-1'::varchar, id, 'Organic Tomatoes', 'Fresh red tomatoes from certified organic farms', 'https://via.placeholder.com/300?text=Tomatoes', 120.00, 150.00, 4.5, 120, 'Karnataka', true, false, '1kg'
FROM categories WHERE name = 'Vegetables'
UNION ALL
SELECT 
  'prod-2'::varchar, id, 'Organic Spinach', 'Fresh spinach leaves, pesticide-free', 'https://via.placeholder.com/300?text=Spinach', 80.00, 100.00, 4.8, 95, 'Himachal Pradesh', true, false, '500g'
FROM categories WHERE name = 'Vegetables'
UNION ALL
SELECT 
  'prod-3'::varchar, id, 'Organic Carrots', 'Sweet orange carrots from northern farms', 'https://via.placeholder.com/300?text=Carrots', 100.00, 130.00, 4.6, 110, 'Punjab', true, true, '1kg'
FROM categories WHERE name = 'Vegetables'
UNION ALL
SELECT 
  'prod-4'::varchar, id, 'Organic Apples', 'Crispy red apples, fresh from orchards', 'https://via.placeholder.com/300?text=Apples', 200.00, 250.00, 4.7, 140, 'Himachal Pradesh', true, false, '1kg'
FROM categories WHERE name = 'Fruits'
UNION ALL
SELECT 
  'prod-5'::varchar, id, 'Organic Bananas', 'Ripe yellow bananas, naturally ripened', 'https://via.placeholder.com/300?text=Bananas', 60.00, 80.00, 4.5, 98, 'Gujarat', true, false, '1kg'
FROM categories WHERE name = 'Fruits'
ON CONFLICT (id) DO NOTHING;

-- Create useful views for reporting and analytics

-- Customer summary view
CREATE VIEW customer_summary AS
SELECT 
    c.id,
    c.name,
    c.email,
    c.phone,
    c.city,
    COUNT(o.id) as total_orders,
    COALESCE(SUM(o.total_amount), 0) as total_spent,
    MAX(o.created_at) as last_order_date,
    c.created_at as customer_since
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name, c.email, c.phone, c.city, c.created_at;

-- Order analytics view
CREATE VIEW order_analytics AS
SELECT 
    DATE(o.created_at) as order_date,
    COUNT(*) as total_orders,
    SUM(o.total_amount) as total_revenue,
    AVG(o.total_amount) as avg_order_value,
    p.category,
    COUNT(CASE WHEN o.status = 'completed' THEN 1 END) as completed_orders,
    COUNT(CASE WHEN o.status = 'pending' THEN 1 END) as pending_orders
FROM orders o
JOIN products p ON o.product_id = p.id
GROUP BY DATE(o.created_at), p.category;

-- Product performance view
CREATE VIEW product_performance AS
SELECT 
    p.id,
    p.name,
    p.category,
    p.price,
    COUNT(o.id) as total_orders,
    SUM(o.total_amount) as total_revenue,
    AVG(o.total_amount) as avg_order_value,
    COUNT(CASE WHEN o.status = 'completed' THEN 1 END) as completed_orders
FROM products p
LEFT JOIN orders o ON p.id = o.product_id
GROUP BY p.id, p.name, p.category, p.price
ORDER BY total_revenue DESC;

-- Payment status summary
CREATE VIEW payment_summary AS
SELECT 
    p.status,
    COUNT(*) as count,
    SUM(p.amount) as total_amount,
    AVG(p.amount) as avg_amount
FROM payments p
GROUP BY p.status;

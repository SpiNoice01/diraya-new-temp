-- Seed users and customers data
-- Insert admin user
INSERT INTO users (id, email, password_hash, name, phone, role) VALUES
('admin-001', 'admin@kateringaqiqah.com', '$2b$10$example_hash_for_admin123', 'Administrator', '081234567890', 'admin');

-- Insert sample customers
INSERT INTO users (id, email, password_hash, name, phone, role) VALUES
('user-001', 'ahmad.wijaya@email.com', '$2b$10$example_hash_for_user123', 'Ahmad Wijaya', '081234567891', 'customer'),
('user-002', 'siti.nurhaliza@email.com', '$2b$10$example_hash_for_user123', 'Siti Nurhaliza', '081234567892', 'customer'),
('user-003', 'budi.santoso@email.com', '$2b$10$example_hash_for_user123', 'Budi Santoso', '081234567893', 'customer'),
('user-004', 'rina.sari@email.com', '$2b$10$example_hash_for_user123', 'Rina Sari', '081234567894', 'customer'),
('user-005', 'dedi.kurniawan@email.com', '$2b$10$example_hash_for_user123', 'Dedi Kurniawan', '081234567895', 'customer');

-- Insert customer details
INSERT INTO customers (id, user_id, name, email, phone, address, city, postal_code, total_orders, total_spent) VALUES
('cust-001', 'user-001', 'Ahmad Wijaya', 'ahmad.wijaya@email.com', '081234567891', 'Jl. Merdeka No. 123', 'Jakarta', '12345', 3, 1500000.00),
('cust-002', 'user-002', 'Siti Nurhaliza', 'siti.nurhaliza@email.com', '081234567892', 'Jl. Sudirman No. 456', 'Bandung', '40123', 2, 1200000.00),
('cust-003', 'user-003', 'Budi Santoso', 'budi.santoso@email.com', '081234567893', 'Jl. Thamrin No. 789', 'Surabaya', '60123', 1, 750000.00),
('cust-004', 'user-004', 'Rina Sari', 'rina.sari@email.com', '081234567894', 'Jl. Gatot Subroto No. 321', 'Medan', '20123', 4, 2100000.00),
('cust-005', 'user-005', 'Dedi Kurniawan', 'dedi.kurniawan@email.com', '081234567895', 'Jl. Ahmad Yani No. 654', 'Yogyakarta', '55123', 2, 900000.00);

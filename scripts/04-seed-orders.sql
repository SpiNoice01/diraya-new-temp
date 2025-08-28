-- Seed orders data
INSERT INTO orders (id, customer_id, product_id, customer_name, customer_phone, customer_email, customer_address, event_date, event_time, event_address, quantity, unit_price, total_amount, special_requests, status) VALUES
('order-001', 'cust-001', 'prod-003', 'Ahmad Wijaya', '081234567891', 'ahmad.wijaya@email.com', 'Jl. Merdeka No. 123, Jakarta', '2024-02-15', '11:00:00', 'Jl. Merdeka No. 123, Jakarta', 1, 500000.00, 500000.00, 'Tolong siapkan tempat duduk tambahan', 'completed'),

('order-002', 'cust-002', 'prod-002', 'Siti Nurhaliza', '081234567892', 'siti.nurhaliza@email.com', 'Jl. Sudirman No. 456, Bandung', '2024-02-20', '12:00:00', 'Jl. Sudirman No. 456, Bandung', 1, 550000.00, 550000.00, 'Mohon sambal tidak terlalu pedas', 'delivered'),

('order-003', 'cust-003', 'prod-001', 'Budi Santoso', '081234567893', 'budi.santoso@email.com', 'Jl. Thamrin No. 789, Surabaya', '2024-02-25', '10:30:00', 'Jl. Thamrin No. 789, Surabaya', 1, 300000.00, 300000.00, NULL, 'preparing'),

('order-004', 'cust-004', 'prod-007', 'Rina Sari', '081234567894', 'rina.sari@email.com', 'Jl. Gatot Subroto No. 321, Medan', '2024-03-01', '11:30:00', 'Jl. Gatot Subroto No. 321, Medan', 1, 1250000.00, 1250000.00, 'Paket kambing untuk aqiqah anak pertama', 'confirmed'),

('order-005', 'cust-005', 'prod-004', 'Dedi Kurniawan', '081234567895', 'dedi.kurniawan@email.com', 'Jl. Ahmad Yani No. 654, Yogyakarta', '2024-03-05', '12:30:00', 'Jl. Ahmad Yani No. 654, Yogyakarta', 1, 750000.00, 750000.00, 'Mohon datang tepat waktu', 'pending'),

('order-006', 'cust-001', 'prod-005', 'Ahmad Wijaya', '081234567891', 'ahmad.wijaya@email.com', 'Jl. Merdeka No. 123, Jakarta', '2024-03-10', '11:00:00', 'Jl. Merdeka No. 123, Jakarta', 1, 750000.00, 750000.00, 'Acara di halaman belakang rumah', 'ready'),

('order-007', 'cust-002', 'prod-006', 'Siti Nurhaliza', '081234567892', 'siti.nurhaliza@email.com', 'Jl. Sudirman No. 456, Bandung', '2024-03-15', '10:00:00', 'Jl. Sudirman No. 456, Bandung', 1, 950000.00, 950000.00, 'Untuk acara aqiqah kembar', 'confirmed');

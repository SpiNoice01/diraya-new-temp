-- Seed activities data for admin dashboard
INSERT INTO activities (id, type, message, related_id, created_by) VALUES
('act-001', 'order', 'Pesanan baru dari Ahmad Wijaya - Paket Premium 50 Porsi', 'order-007', NULL),
('act-002', 'payment', 'Pembayaran terverifikasi untuk pesanan #order-006', 'pay-006', 'admin-001'),
('act-003', 'order', 'Status pesanan diubah menjadi "Siap" untuk #order-006', 'order-006', 'admin-001'),
('act-004', 'payment', 'Bukti pembayaran diunggah untuk pesanan #order-007', 'pay-007', NULL),
('act-005', 'customer', 'Customer baru terdaftar: Dedi Kurniawan', 'cust-005', NULL),
('act-006', 'order', 'Pesanan baru dari Rina Sari - Paket Kambing Premium', 'order-004', NULL),
('act-007', 'payment', 'Pembayaran terverifikasi untuk pesanan #order-003', 'pay-003', 'admin-001'),
('act-008', 'order', 'Status pesanan diubah menjadi "Sedang Dipersiapkan" untuk #order-003', 'order-003', 'admin-001'),
('act-009', 'order', 'Pesanan diselesaikan untuk customer Ahmad Wijaya', 'order-001', 'admin-001'),
('act-010', 'payment', 'Pembayaran lunas untuk pesanan #order-002', 'pay-002', 'admin-001');

-- Seed payments data
INSERT INTO payments (id, order_id, customer_id, amount, payment_method, bank_account, payment_proof, status, verified_by, verified_at, notes) VALUES
('pay-001', 'order-001', 'cust-001', 500000.00, 'bank_transfer', 'BCA - 1234567890', '/payment-proof-001.jpg', 'completed', 'admin-001', '2024-02-14 15:30:00', 'Pembayaran terverifikasi, transfer sesuai'),

('pay-002', 'order-002', 'cust-002', 550000.00, 'bank_transfer', 'Mandiri - 0987654321', '/payment-proof-002.jpg', 'completed', 'admin-001', '2024-02-19 10:15:00', 'Pembayaran lunas'),

('pay-003', 'order-003', 'cust-003', 300000.00, 'bank_transfer', 'BNI - 1122334455', '/payment-proof-003.jpg', 'verified', 'admin-001', '2024-02-24 14:20:00', 'Bukti transfer valid'),

('pay-004', 'order-004', 'cust-004', 1250000.00, 'bank_transfer', 'BRI - 5566778899', '/payment-proof-004.jpg', 'uploaded', NULL, NULL, NULL),

('pay-005', 'order-005', 'cust-005', 750000.00, 'bank_transfer', 'BCA - 9988776655', NULL, 'pending', NULL, NULL, NULL),

('pay-006', 'order-006', 'cust-001', 750000.00, 'bank_transfer', 'Mandiri - 4433221100', '/payment-proof-006.jpg', 'verified', 'admin-001', '2024-03-09 16:45:00', 'Pembayaran sesuai nominal'),

('pay-007', 'order-007', 'cust-002', 950000.00, 'bank_transfer', 'BNI - 7788990011', '/payment-proof-007.jpg', 'uploaded', NULL, NULL, NULL);

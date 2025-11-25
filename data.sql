-- Xóa dữ liệu cũ nếu có
TRUNCATE TABLE "user", "category", "book", "book_category", "order", "order_item", "payment" RESTART IDENTITY CASCADE;

-- Thêm dữ liệu cho bảng CATEGORY
INSERT INTO "category" (name) VALUES
('Lịch sử'),
('Tiểu thuyết'),
('Phát triển bản thân'),
('Khoa học'),
('Văn học Việt Nam');

-- Thêm dữ liệu cho bảng BOOK
-- Lưu ý: image_urls sử dụng cú pháp mảng của PostgreSQL
INSERT INTO "book" (title, author, isbn, price, stock_quantity, description, image_urls, featured) VALUES
('Sapiens: Lược sử loài người', 'Yuval Noah Harari', '978-604-56-5930-0', 150000.00, 50, 'Một cuốn sách khám phá lịch sử loài người từ thời kỳ Đồ đá cho đến ngày nay.', ARRAY['/covers/book1.jpg'], true),
('Nhà giả kim', 'Paulo Coelho', '978-604-56-1779-9', 80000.00, 100, 'Câu chuyện triết lý về chuyến phiêu lưu của cậu chăn cừu Santiago.', ARRAY['/covers/book2.jpg'], true),
('Đắc nhân tâm', 'Dale Carnegie', '978-604-58-3868-2', 90000.00, 70, 'Cuốn sách self-help kinh điển về nghệ thuật giao tiếp và ứng xử.', ARRAY['/covers/book3.jpg'], false),
('Lịch sử Việt Nam', 'Nhiều tác giả', '978-604-77-0131-0', 250000.00, 30, 'Tổng quan về lịch sử Việt Nam qua các thời kỳ.', ARRAY['/covers/book4.jpg'], false),
('Số đỏ', 'Vũ Trọng Phụng', '978-604-56-0393-8', 75000.00, 40, 'Một tác phẩm văn học hiện thực phê phán nổi tiếng của Việt Nam.', ARRAY['/covers/book1.jpg'], true);

-- Thêm dữ liệu cho bảng BOOK_CATEGORY (Bảng nối)
INSERT INTO "book_category" (book_id, category_id) VALUES
(1, 1), -- Sapiens -> Lịch sử
(1, 4), -- Sapiens -> Khoa học
(2, 2), -- Nhà giả kim -> Tiểu thuyết
(2, 3), -- Nhà giả kim -> Phát triển bản thân
(3, 3), -- Đắc nhân tâm -> Phát triển bản thân
(4, 1), -- Lịch sử Việt Nam -> Lịch sử
(5, 2), -- Số đỏ -> Tiểu thuyết
(5, 5); -- Số đỏ -> Văn học Việt Nam

-- Thêm dữ liệu cho bảng USER
-- Mật khẩu hash mẫu cho 'password123'
INSERT INTO "user" (username, email, password_hash) VALUES
('johndoe', 'john.doe@example.com', '$2b$10$f/3.a.w8.e.q2a.y8...'),
('adminuser', 'admin@bookhaven.com', '$2b$10$g/e.l.j1.r.y9...'),
('nguyenvana', 'vana@gmail.com', '$2b$10$k/v.a.z5.q.w4...');

-- Thêm dữ liệu cho bảng ORDER
INSERT INTO "order" (user_id, total_amount, status, shipping_first_name, shipping_last_name, shipping_address, shipping_city, shipping_country_code) VALUES
(1, 230000.00, 'completed', 'John', 'Doe', '123 Đường ABC', 'Hà Nội', 'VN');

-- Thêm dữ liệu cho bảng ORDER_ITEM
INSERT INTO "order_item" (order_id, book_id, quantity, price_each) VALUES
(1, 1, 1, 150000.00),
(1, 2, 1, 80000.00);

-- Thêm dữ liệu cho bảng PAYMENT
INSERT INTO "payment" (order_id, method, amount, status, paypal_id) VALUES
(1, 'paypal', 230000.00, 'completed', 'PAYPAL_ORDER_ID_123');
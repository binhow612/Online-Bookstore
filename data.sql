-- 1. Xóa dữ liệu cũ (Reset data)
-- Xóa tất cả các bảng liên quan để tránh lỗi khóa ngoại
TRUNCATE TABLE 
    "users", 
    "categories", 
    "books", 
    "book_categories", 
    "orders", 
    "book_order_items", -- Bảng chứa chi tiết đơn hàng sách
    "book_reviews",     -- Bảng đánh giá sách
    "order_items",      -- Xóa luôn bảng cũ nếu còn sót
    "product_reviews"   -- Xóa bảng cũ nếu còn sót
RESTART IDENTITY CASCADE;

-- 2. Thêm dữ liệu cho bảng CATEGORIES
INSERT INTO "categories" (id, name, description, image_url) VALUES
('van-hoc-viet-nam', 'Văn học Việt Nam', 'Những tác phẩm kinh điển và hiện đại của nền văn học nước nhà.', 'https://images.unsplash.com/photo-1519681393784-d120267933ba'),
('tieu-thuyet', 'Tiểu thuyết nước ngoài', 'Các tiểu thuyết nổi tiếng thế giới được dịch sang tiếng Việt.', 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1'),
('kinh-te-ky-nang', 'Kinh tế & Kỹ năng', 'Sách phát triển bản thân, bài học kinh doanh và tài chính.', 'https://images.unsplash.com/photo-1554774853-710156d9c1e2'),
('lich-su', 'Lịch sử & Địa lý', 'Khám phá dòng chảy lịch sử và các vùng đất trên thế giới.', 'https://images.unsplash.com/photo-1461360370896-922624d12aa1'),
('khoa-hoc', 'Khoa học & Công nghệ', 'Kiến thức về vũ trụ, công nghệ và đời sống.', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d'),
('truyen-tranh', 'Truyện tranh & Manga', 'Thế giới hình ảnh sống động dành cho mọi lứa tuổi.', 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe'),
('thieu-nhi', 'Sách Thiếu nhi', 'Nuôi dưỡng tâm hồn trẻ thơ.', 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('tam-ly-hoc', 'Tâm lý học', 'Thấu hiểu bản thân và con người.', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c');

-- 3. Thêm dữ liệu cho bảng BOOKS
INSERT INTO "books" (id, title, author, description, price, discount_percent, stock_quantity, featured, cover_url, isbn, publisher, publication_year, page_count) VALUES
('sapiens', 'Sapiens: Lược sử loài người', 'Yuval Noah Harari', 'Một cuốn sách chấn động khám phá lịch sử loài người từ thời kỳ Đồ đá cho đến ngày nay.', 185000.00, 20.00, 50, true, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f', '978-604-56-5930-0', 'NXB Tri Thức', 2017, 500),
('nha-gia-kim', 'Nhà giả kim', 'Paulo Coelho', 'Câu chuyện triết lý nhẹ nhàng nhưng sâu sắc về chuyến phiêu lưu của cậu chăn cừu Santiago đi tìm kho báu.', 79000.00, 0.00, 100, true, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e', '978-604-56-1779-9', 'NXB Văn Học', 2013, 220),
('dac-nhan-tam', 'Đắc nhân tâm', 'Dale Carnegie', 'Cuốn sách self-help kinh điển nhất mọi thời đại về nghệ thuật thu phục lòng người.', 86000.00, 15.00, 80, true, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73', '978-604-58-3868-2', 'First News', 2010, 320),
('so-do', 'Số đỏ', 'Vũ Trọng Phụng', 'Kiệt tác văn học hiện thực phê phán, châm biếm sâu cay xã hội tư sản thành thị Việt Nam.', 65000.00, 0.00, 40, true, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353', '978-604-56-0393-8', 'NXB Văn Học', 2005, 250),
('mat-biec', 'Mắt biếc', 'Nguyễn Nhật Ánh', 'Một câu chuyện tình yêu buồn man mác, gắn liền với tuổi thơ và làng quê Việt Nam.', 110000.00, 10.00, 60, true, 'https://images.unsplash.com/photo-1512820790803-83ca734da794', '978-604-1-15234-5', 'NXB Trẻ', 2015, 300),
('de-men-phieu-luu-ky', 'Dế Mèn phiêu lưu ký', 'Tô Hoài', 'Tác phẩm văn học thiếu nhi kinh điển của Việt Nam về những chuyến phiêu lưu của Dế Mèn.', 50000.00, 0.00, 150, false, 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e', '978-604-2-12345-6', 'NXB Kim Đồng', 2000, 180),
('harry-potter-1', 'Harry Potter và Hòn đá Phù thủy', 'J.K. Rowling', 'Tập đầu tiên trong bộ truyện giả tưởng lừng danh về cậu bé phù thủy Harry Potter.', 150000.00, 0.00, 45, true, 'https://images.unsplash.com/photo-1618666012174-83b441c0bc76', '978-604-3-98765-4', 'NXB Trẻ', 2002, 400),
('tuoi-tre-dang-gia-bao-nhieu', 'Tuổi trẻ đáng giá bao nhiêu', 'Rosie Nguyễn', 'Cuốn sách truyền cảm hứng cho giới trẻ Việt Nam về việc tự học và khám phá thế giới.', 90000.00, 25.00, 90, true, 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6', '978-604-9-87654-3', 'NXB Hội Nhà Văn', 2016, 280),
('khuyen-hoc', 'Khuyến học', 'Fukuzawa Yukichi', 'Tác phẩm khai sáng tinh thần học tập của người Nhật Bản thời Minh Trị.', 85000.00, 0.00, 30, false, 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d', '978-604-5-67890-1', 'NXB Tri Thức', 2008, 300),
('rung-na-uy', 'Rừng Na Uy', 'Haruki Murakami', 'Một tiểu thuyết đầy ám ảnh về sự mất mát và trưởng thành của tuổi trẻ.', 130000.00, 0.00, 35, false, 'https://images.unsplash.com/photo-1448375240586-882707db888b', '978-604-6-54321-0', 'NXB Hội Nhà Văn', 2010, 450),
('bo-gia', 'Bố già (The Godfather)', 'Mario Puzo', 'Câu chuyện kinh điển về gia đình tội phạm Corleone và thế giới ngầm.', 140000.00, 10.00, 55, true, 'https://images.unsplash.com/photo-1541963463532-d68292c34b19', '978-604-8-12345-6', 'NXB Văn Học', 2000, 500),
('hoang-tu-be', 'Hoàng tử bé', 'Antoine de Saint-Exupéry', 'Câu chuyện ngụ ngôn đầy chất thơ dành cho cả trẻ em và người lớn.', 60000.00, 0.00, 120, true, 'https://images.unsplash.com/photo-1457052271742-6b6b66887aeb', '978-604-7-54321-9', 'NXB Kim Đồng', 2005, 100),
('luoc-su-thoi-gian', 'Lược sử thời gian', 'Stephen Hawking', 'Cuốn sách phổ biến khoa học về vũ trụ, Big Bang và lỗ đen.', 125000.00, 5.00, 40, true, 'https://images.unsplash.com/photo-1532012197267-da84d127e765', '978-604-4-56789-0', 'NXB Trẻ', 2010, 300),
('to-kill-a-mockingbird', 'Giết con chim nhại', 'Harper Lee', 'Một tiểu thuyết cảm động về nạn phân biệt chủng tộc ở miền Nam nước Mỹ.', 115000.00, 0.00, 60, true, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f', '978-604-5-43210-9', 'NXB Nhã Nam', 2015, 350),
('sherlock-holmes', 'Những cuộc phiêu lưu của Sherlock Holmes', 'Arthur Conan Doyle', 'Tuyển tập các vụ án trinh thám nổi tiếng của thám tử lừng danh Sherlock Holmes.', 160000.00, 20.00, 50, true, 'https://images.unsplash.com/photo-1476275466078-4007374efbbe', '978-604-2-98765-1', 'NXB Văn Học', 2005, 600),
('doraemon-1', 'Doraemon Tập 1', 'Fujiko F. Fujio', 'Chú mèo máy đến từ tương lai và những câu chuyện hài hước.', 25000.00, 0.00, 200, false, 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe', '978-604-2-11111-1', 'NXB Kim Đồng', 1992, 180),
('dragon-ball-1', 'Dragon Ball - 7 Viên Ngọc Rồng Tập 1', 'Akira Toriyama', 'Hành trình tìm ngọc rồng của Son Goku.', 25000.00, 0.00, 150, false, 'https://images.unsplash.com/photo-1608889476561-6242cfdbf622', '978-604-2-22222-2', 'NXB Kim Đồng', 1995, 180),
('tam-quoc-dien-nghia', 'Tam Quốc Diễn Nghĩa (Trọn bộ)', 'La Quán Trung', 'Tiểu thuyết lịch sử kinh điển của Trung Quốc.', 450000.00, 15.00, 20, false, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e', '978-604-1-33333-3', 'NXB Văn Học', 2000, 1500),
('nguoi-giau-co-nhat-thanh-babylon', 'Người giàu có nhất thành Babylon', 'George S. Clason', 'Những bài học tài chính đơn giản nhưng hiệu quả từ thời cổ đại.', 70000.00, 0.00, 80, true, 'https://images.unsplash.com/photo-1616645004064-aebe96923cbb', '978-604-5-44444-4', 'First News', 2012, 200),
('chien-tranh-tien-te', 'Chiến tranh tiền tệ', 'Song Hongbing', 'Cuốn sách gây tranh cãi về lịch sử tiền tệ và các âm mưu tài chính.', 145000.00, 0.00, 30, false, 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e', '978-604-6-55555-5', 'NXB Trẻ', 2008, 400),
('cay-cam-ngot-cua-toi', 'Cây cam ngọt của tôi', 'José Mauro de Vasconcelos', 'Câu chuyện cảm động về cậu bé Zeze và thế giới tưởng tượng của em.', 88000.00, 10.00, 75, true, 'https://images.unsplash.com/photo-1512820790803-83ca734da794', '978-604-7-66666-6', 'NXB Hội Nhà Văn', 2018, 250),
('vo-nhat', 'Vợ nhặt (Tuyển tập Nam Cao)', 'Nam Cao', 'Tuyển tập những truyện ngắn hiện thực xuất sắc nhất của Nam Cao.', 55000.00, 0.00, 40, false, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d', '978-604-8-77777-7', 'NXB Văn Học', 2005, 200),
('conan-1', 'Thám tử lừng danh Conan Tập 1', 'Gosho Aoyama', 'Vụ án đầu tiên của chàng thám tử bị teo nhỏ.', 25000.00, 0.00, 180, false, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73', '978-604-2-88888-8', 'NXB Kim Đồng', 1996, 180),
('nghin-le-mot-dem', 'Nghìn lẻ một đêm', 'Dân gian Ả Rập', 'Tuyển tập truyện cổ tích huyền bí của thế giới Ả Rập.', 200000.00, 10.00, 25, false, 'https://images.unsplash.com/photo-1519681393784-d120267933ba', '978-604-3-99999-9', 'NXB Văn Học', 2000, 800),
('tu-duy-nhanh-va-cham', 'Tư duy nhanh và chậm', 'Daniel Kahneman', 'Khám phá hai hệ thống tư duy chi phối nhận thức của con người.', 190000.00, 0.00, 30, false, 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d', '978-604-4-00000-0', 'NXB Thế Giới', 2014, 600);


-- 4. Thêm dữ liệu cho bảng BOOK_CATEGORIES (Bảng nối)
INSERT INTO "book_categories" (book_id, category_id) VALUES
('sapiens', 'lich-su'), ('sapiens', 'khoa-hoc'),
('nha-gia-kim', 'tieu-thuyet'), ('nha-gia-kim', 'kinh-te-ky-nang'),
('dac-nhan-tam', 'kinh-te-ky-nang'), ('dac-nhan-tam', 'tam-ly-hoc'),
('so-do', 'van-hoc-viet-nam'), ('so-do', 'tieu-thuyet'),
('mat-biec', 'van-hoc-viet-nam'), ('mat-biec', 'tieu-thuyet'),
('de-men-phieu-luu-ky', 'thieu-nhi'), ('de-men-phieu-luu-ky', 'van-hoc-viet-nam'),
('harry-potter-1', 'tieu-thuyet'), ('harry-potter-1', 'thieu-nhi'),
('tuoi-tre-dang-gia-bao-nhieu', 'kinh-te-ky-nang'),
('khuyen-hoc', 'kinh-te-ky-nang'), ('khuyen-hoc', 'lich-su'),
('rung-na-uy', 'tieu-thuyet'),
('bo-gia', 'tieu-thuyet'),
('hoang-tu-be', 'thieu-nhi'), ('hoang-tu-be', 'tieu-thuyet'),
('luoc-su-thoi-gian', 'khoa-hoc'),
('to-kill-a-mockingbird', 'tieu-thuyet'),
('sherlock-holmes', 'tieu-thuyet'),
('doraemon-1', 'truyen-tranh'), ('doraemon-1', 'thieu-nhi'),
('dragon-ball-1', 'truyen-tranh'),
('tam-quoc-dien-nghia', 'tieu-thuyet'), ('tam-quoc-dien-nghia', 'lich-su'),
('nguoi-giau-co-nhat-thanh-babylon', 'kinh-te-ky-nang'),
('chien-tranh-tien-te', 'kinh-te-ky-nang'), ('chien-tranh-tien-te', 'lich-su'),
('cay-cam-ngot-cua-toi', 'tieu-thuyet'), ('cay-cam-ngot-cua-toi', 'thieu-nhi'),
('vo-nhat', 'van-hoc-viet-nam'),
('conan-1', 'truyen-tranh'),
('nghin-le-mot-dem', 'tieu-thuyet'), ('nghin-le-mot-dem', 'thieu-nhi'),
('tu-duy-nhanh-va-cham', 'tam-ly-hoc'), ('tu-duy-nhanh-va-cham', 'khoa-hoc');

-- 5. Thêm dữ liệu cho bảng USERS
INSERT INTO "users" (id, first_name, last_name, email, password_hash, phone_number, address, city, country_code, role, created_at) VALUES
(100, 'Minh', 'Nguyen', 'minh.nguyen@example.com', '$2b$10$f/3.a.w8.e.q2a.y8...', '0901234567', '123 Le Loi', 'Ho Chi Minh', 'VN', 'admin', now()),
(101, 'Lan', 'Tran', 'lan.tran@example.com', '$2b$10$g/e.l.j1.r.y9...', '0912345678', '456 Nguyen Hue', 'Ho Chi Minh', 'VN', 'user', now()),
(102, 'Hung', 'Le', 'hung.le@example.com', '$2b$10$k/v.a.z5.q.w4...', '0987654321', '789 Ba Trieu', 'Hanoi', 'VN', 'user', now()),
(103, 'Hoa', 'Pham', 'hoa.pham@example.com', '$2b$10$h/k.m.n1.p.o2...', '0909998887', '12 Tran Phu', 'Da Nang', 'VN', 'user', now()),
(104, 'Tuan', 'Do', 'tuan.do@example.com', '$2b$10$a/b.c.d2.e.f3...', '0933445566', '34 Le Duan', 'Hue', 'VN', 'user', now());

-- 6. Thêm dữ liệu cho bảng ORDERS
INSERT INTO "orders" (user_id, total_price, status, shipping_first_name, shipping_last_name, shipping_address, shipping_city, shipping_country_code, created_at) VALUES
(101, 264000.00, 'completed', 'Lan', 'Tran', '456 Nguyen Hue', 'Ho Chi Minh', 'VN', now() - INTERVAL '5 days'),
(102, 110000.00, 'processing', 'Hung', 'Le', '789 Ba Trieu', 'Hanoi', 'VN', now() - INTERVAL '1 day'),
(101, 79000.00, 'pending', 'Lan', 'Tran', '456 Nguyen Hue', 'Ho Chi Minh', 'VN', now());

-- 7. Thêm dữ liệu cho bảng BOOK_ORDER_ITEMS
-- (QUAN TRỌNG: Đổi từ order_items sang book_order_items và dùng book_id)
INSERT INTO "book_order_items" (order_id, book_id, quantity, price, subtotal) VALUES
(1, 'sapiens', 1, 185000.00, 185000.00),
(1, 'nha-gia-kim', 1, 79000.00, 79000.00),
(2, 'mat-biec', 1, 110000.00, 110000.00),
(3, 'nha-gia-kim', 1, 79000.00, 79000.00);

-- 8. Thêm dữ liệu cho bảng BOOK_REVIEWS
INSERT INTO "book_reviews" (book_id, user_id, rating, comment, created_at) VALUES
('sapiens', 101, 5, 'Sách quá hay, mở mang tầm mắt về lịch sử loài người.', now() - INTERVAL '4 days'),
('sapiens', 102, 4, 'Kiến thức đồ sộ nhưng hơi khó đọc với người mới.', now() - INTERVAL '3 days'),
('nha-gia-kim', 101, 5, 'Câu chuyện nhẹ nhàng, truyền cảm hứng. Rất đáng đọc.', now() - INTERVAL '2 days'),
('so-do', 103, 5, 'Văn phong trào phúng của Vũ Trọng Phụng quá xuất sắc.', now()),
('mat-biec', 102, 4, 'Truyện buồn quá, nhưng văn của Nguyễn Nhật Ánh thì luôn hay.', now() - INTERVAL '10 days'),
('dac-nhan-tam', 104, 5, 'Cuốn sách thay đổi cách tôi giao tiếp.', now() - INTERVAL '1 month'),
('harry-potter-1', 101, 5, 'Tuổi thơ ùa về, bản dịch rất tốt.', now()),
('tuoi-tre-dang-gia-bao-nhieu', 103, 3, 'Hơi sáo rỗng so với kỳ vọng của mình.', now()),
('de-men-phieu-luu-ky', 104, 5, 'Mua cho con đọc nhưng bố cũng mê.', now());
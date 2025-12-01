# The Book Haven (OldBookSaigon)

<div align="center">
  <img src="./public/logo.png" alt="The Book Haven Logo" width="200" />
  <br />
</div>

**The Book Haven** (còn được biết đến với tên "OldBookSaigon") là dự án cho môn học *Thương mại Điện tử (CO3027)* tại Trường Đại học Bách khoa, Đại học Quốc gia Thành phố Hồ Chí Minh.

Mục tiêu của dự án là:

- 🛒 Xây dựng trang web thương mại điện tử B2C chuyên biệt để bán **sách cũ**, tập trung vào thị trường TP. Hồ Chí Minh.
- 💳 Tích hợp cổng thanh toán trực tuyến (PayPal).
- 🤖 Triển khai tính năng AI **Chatbot (LLM)** để cách mạng hóa trải nghiệm tìm kiếm.
- 🔍 Cho phép người dùng **"khám phá" sách** bằng truy vấn ngôn ngữ tự nhiên (ví dụ: *"tìm sách về lịch sử Sài Gòn"*).

---

## 🛠 Technologies

Dự án được xây dựng dựa trên các công nghệ hiện đại:

- **Frontend & Backend:** [Next.js 14+](https://nextjs.org/) (App Router), [Node.js](https://nodejs.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Vector Database (AI):** [Milvus](https://milvus.io/)
- **Payment:** [PayPal SDK](https://developer.paypal.com/home/)
- **Styling:** Tailwind CSS

---

## 🚀 Getting Started

Làm theo các bước sau để chạy dự án trên máy cá nhân.

### Prerequisites (Yêu cầu)

- [Node.js](https://nodejs.org/en/) (Version >= 20)
- [Docker & Docker Compose](https://docs.docker.com/get-started/get-docker/) (Để chạy PostgreSQL và Milvus)
- Tài khoản [PayPal Developer](https://developer.paypal.com/home/) (Để lấy Client ID test thanh toán)

### Installation (Cài đặt)

1. **Clone repository:**

   ```bash
   git clone [https://github.com/binhow612/Online-Bookstore.git](https://github.com/binhow612/Online-Bookstore.git)
   cd Online-Bookstore
````

2.  **Cài đặt các thư viện (Dependencies):**

    ```bash
    npm install
    ```

3.  **Cấu hình biến môi trường:**

    Tạo file `.env` tại thư mục gốc và điền các thông tin sau:

    ```bash
    # Database Configuration
    DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres

    # Milvus (Vector DB) Configuration
    MILVUS_HOST=localhost:19530
    MILVUS_TOKEN=root:Milvus

    # PayPal Configuration
    PAYPAL_CLIENT_ID=your_paypal_client_id_here
    PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here

    # Authentication & App
    JWT_SECRET=your_complex_random_string
    SECRET_KEY=your_secret_key
    APP_URL=http://localhost:3000
    ```

4.  **Khởi chạy Database (PostgreSQL & Milvus):**

    Đảm bảo Docker Desktop đang chạy, sau đó gõ lệnh:

    ```bash
    docker compose up -d
    ```

5.  **Chạy Migration & Seed dữ liệu:**

    Đẩy cấu trúc bảng (Schema) vào Database:

    ```bash
    npm run migrate
    # Hoặc nếu dùng drizzle-kit trực tiếp:
    # npx drizzle-kit push
    ```

    *(Tùy chọn)* Nạp dữ liệu mẫu từ file `data.sql`:

    ```bash
    # Yêu cầu máy đã cài psql client, hoặc dùng tool quản lý DB để import file data.sql
    psql -U postgres -h localhost -d postgres -f data.sql
    ```

6.  **Chạy dự án:**

    ```bash
    npm run dev
    ```

    Truy cập trang web tại: [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)

-----

## 🐳 Deployment (Triển khai với Docker)

Toàn bộ ứng dụng bao gồm Next.js server, Database và AI service có thể được triển khai cùng lúc bằng Docker Compose.

1.  **Sửa file `.env`**:
    Khi chạy trong môi trường Docker container, các service cần gọi nhau bằng tên service (hostname) thay vì `localhost`.

    ```bash
    # .env for Docker production
    DATABASE_URL=postgres://postgres:postgres@postgres:5432/postgres
    MILVUS_HOST=milvus:19530
    ```

2.  **Build và chạy:**

    ```bash
    docker compose -f docker-compose.prod.yml up -d --build
    ```

    *(Lưu ý: Sử dụng `docker-compose.prod.yml` nếu bạn có file cấu hình riêng cho production, hoặc dùng file mặc định).*

-----

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

```

### Các thay đổi chính tôi đã thực hiện:
1.  **Thêm Logo:** Sử dụng thẻ `<img>` html để căn giữa logo cho đẹp mắt (`src="./public/logo.png"`).
2.  **Bổ sung Tech Stack:** Thêm **Drizzle ORM** và **Tailwind CSS** vì đây là thành phần quan trọng trong code của bạn.
3.  **Sửa lỗi cú pháp Markdown:** Sửa lại link `git clone` bị thừa dấu ngoặc `[]`.
4.  **Làm rõ phần cấu hình:** Phân chia các biến trong `.env` thành từng nhóm (DB, PayPal, App) để người khác dễ điền.
5.  **Cập nhật lệnh Migration:** Thêm chú thích về `drizzle-kit` phòng trường hợp lệnh `npm run migrate` chưa được định nghĩa trong `package.json`.
```
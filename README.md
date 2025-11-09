# The Book Haven (OldBookSaigon)

[cite\_start]The Book Haven (còn được biết đến với tên "OldBookSaigon" [cite: 452][cite\_start]) là một dự án cho môn học *Thương mại Điện tử (CO3027)* tại Trường Đại học Bách khoa, Đại học Quốc gia Thành phố Hồ Chí Minh[cite: 447, 449]. Mục tiêu của dự án là:

  - Xây dựng một trang web thương mại điện tử B2C chuyên biệt để bán **sách cũ**, tập trung vào thị trường TP. [cite\_start]Hồ Chí Minh[cite: 470, 476].
  - [cite\_start]Tích hợp với các cổng thanh toán trực tuyến (như PayPal, MoMo, ZaloPay, VNPay)[cite: 856].
  - [cite\_start]Triển khai một tính năng AI đổi mới là **Chatbot Mô hình Ngôn ngữ Lớn (LLM)** để cách mạng hóa trải nghiệm tìm kiếm của người dùng[cite: 480, 496].
  - [cite\_start]Cho phép người dùng **"khám phá" sách** bằng các truy vấn ngôn ngữ tự nhiên (ví dụ: "tìm sách về lịch sử Sài Gòn" [cite: 481][cite\_start]), vượt xa các công cụ tìm kiếm từ khóa truyền thống[cite: 723].

## Technologies

  - [Node.js](https://nodejs.org/en/)
  - [Next.js](https://nextjs.org/)
  - [PostgreSQL](https://www.postgresql.org/)
  - [Milvus](https://milvus.io/)
  - [PayPal](https://developer.paypal.com/home/)

## Getting Started

### Prerequisites

  - [Node.js and npm](https://nodejs.org/en/) (Node.js version \>= 20)
  - [Docker and Docker Compose](https://docs.docker.com/get-started/get-docker/)
  - [PayPal Developer Account](https://developer.paypal.com/home/)

### Installation

1.  Clone the repository:

<!-- end list -->

```bash
git clone https://github.com/hoangvvo/ai-oven.git
cd ai-oven
```

2.  Install dependencies:

<!-- end list -->

```bash
npm install
```

3.  Create a `.env` file in the root directory and fill in the following environment variables:

<!-- end list -->

```bash
    DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
    POSTGRES_PASSWORD=postgres
    MILVUS_HOST=localhost:19530
    MILVUS_TOKEN=milvus
    PAYPAL_CLIENT_ID=<YOUR_PAYPAL_CLIENT_ID>
    PAYPAL_CLIENT_SECRET=<YOUR_PAYPAL_CLIENT_SECRET>
    JWT_SECRET=<YOUR_JWT_SECRET>
    SECRET_KEY=secret
    APP_URL=http://localhost:3000
```

4.  Start the PostgreSQL and Milvus services:

<!-- end list -->

```bash
docker compose up -d
```

5.  Run the migrations:

<!-- end list -->

```bash
npm run migrate
```

6.  Start the server:

<!-- end list -->

```bash
npm run dev
```

Optionally, you can seed the database with some initial data from the [data.sql](https://www.google.com/search?q=data.sql) file:

```bash
psql -U postgres -d postgres -a -f data.sql
```

### Deployment

All services, including the Next.js server, can be conveniently deployed using Docker Compose.

Due to the network setup in Docker, first change the `.env` file to use service names in the URLs:

```bash
DATABASE_URL=postgres://postgres:postgres@postgres:5432/postgres
MILVUS_HOST=milvus:19530
```

````

```bash
docker compose up -d
````

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.
# The Book Haven (OldBookSaigon)

The Book Haven (còn được biết đến với tên "OldBookSaigon") là một dự án cho môn học *Thương mại Điện tử (CO3027)* tại Trường Đại học Bách khoa, Đại học Quốc gia Thành phố Hồ Chí Minh. Mục tiêu của dự án là:

- Xây dựng một trang web thương mại điện tử B2C chuyên biệt để bán **sách cũ**, tập trung vào thị trường TP. Hồ Chí Minh.
- Tích hợp với các cổng thanh toán trực tuyến (như PayPal, MoMo, ZaloPay, VNPay).
- Triển khai một tính năng AI đổi mới là **Chatbot Mô hình Ngôn ngữ Lớn (LLM)** để cách mạng hóa trải nghiệm tìm kiếm của người dùng.
- Cho phép người dùng **"khám phá" sách** bằng các truy vấn ngôn ngữ tự nhiên (ví dụ: "tìm sách về lịch sử Sài Gòn"), vượt xa các công cụ tìm kiếm từ khóa truyền thống.

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

1. Clone the repository:

   ```bash
   git clone [https://github.com/binhow612/Online-Bookstore/](https://github.com/binhow612/Online-Bookstore/)


2. Install dependencies:

npm install


3. Create a .env file in the root directory and fill in the following environment variables:

    DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
    POSTGRES_PASSWORD=postgres
    MILVUS_HOST=localhost:19530
    MILVUS_TOKEN=milvus
    PAYPAL_CLIENT_ID=<YOUR_PAYPAL_CLIENT_ID>
    PAYPAL_CLIENT_SECRET=<YOUR_PAYPAL_CLIENT_SECRET>
    JWT_SECRET=<YOUR_JWT_SECRET>
    SECRET_KEY=secret
    APP_URL=http://localhost:3000


4. Start the PostgreSQL and Milvus services:

docker compose up -d


5. Run the migrations:

npm run migrate


6. Start the server:

npm run dev

Optionally, you can seed the database with some initial data from the data.sql file:

psql -U postgres -d postgres -a -f data.sql


### Deployment
All services, including the Next.js server, can be conveniently deployed using Docker Compose.

Due to the network setup in Docker, first change the .env file to use service names in the URLs:

DATABASE_URL=postgres://postgres:postgres@postgres:5432/postgres
MILVUS_HOST=milvus:19530

docker compose up -d


### License
This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.
import { Metadata } from "next";
import { BookOpen, Heart, Users, Globe } from "lucide-react"; // Sử dụng icon minh họa

export const metadata: Metadata = {
  title: "Về Chúng Tôi - The Book Haven",
  description: "Câu chuyện và sứ mệnh của The Book Haven.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#FBF8F3] min-h-screen text-[#4E3B31] font-sans">
      
      {/* 1. HERO SECTION: Nền tối tạo ấn tượng mạnh */}
      <section className="relative py-20 md:py-32 bg-[#4E3B31] text-[#F5EDE3] overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 leading-tight">
            Nơi Những Câu Chuyện <br /> Tìm Thấy Người Đọc
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#F5EDE3]/80 font-light leading-relaxed">
            Chúng tôi tin rằng mỗi cuốn sách cũ đều mang trong mình một linh hồn, đợi chờ người tri kỷ tiếp theo để sẻ chia những trang viết.
          </p>
        </div>
      </section>

      {/* 2. CÂU CHUYỆN (OUR STORY): Nền sáng (Warm White) */}
      <section className="py-16 md:py-24 bg-[#FBF8F3]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Hình ảnh minh họa (Placeholder bằng div màu) */}
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(78,59,49,0.15)] bg-[#F5EDE3] border border-[#8B6B4F]/10 flex items-center justify-center">
               <div className="text-center p-6">
                  <div className="text-6xl mb-4">📖</div>
                  <p className="text-[#8B6B4F] font-serif italic text-xl">"Sách là giấc mơ bạn cầm trên tay"</p>
               </div>
            </div>
            
            {/* Nội dung văn bản */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-serif text-[#8B6B4F]">Câu Chuyện Của Chúng Tôi</h2>
              <div className="w-20 h-1 bg-[#C8A165] rounded-full"></div>
              <p className="text-lg leading-relaxed text-[#4E3B31]/80">
                The Book Haven bắt đầu từ một tiệm sách nhỏ nằm nép mình trong con hẻm yên tĩnh. Xuất phát từ tình yêu mãnh liệt với những trang sách cũ nhuốm màu thời gian, chúng tôi mong muốn tạo ra một không gian nơi văn hóa đọc được trân trọng và gìn giữ.
              </p>
              <p className="text-lg leading-relaxed text-[#4E3B31]/80">
                Không chỉ là nơi mua bán, The Book Haven là điểm dừng chân cho những tâm hồn đồng điệu, nơi bạn có thể tìm thấy những ấn bản hiếm, những câu chuyện đã thất lạc, hay đơn giản là một khoảnh khắc bình yên giữa bộn bề cuộc sống.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GIÁ TRỊ CỐT LÕI: Nền Beige Nhạt (#F5EDE3) để tách biệt */}
      <section className="py-16 md:py-24 bg-[#F5EDE3]">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-bold font-serif text-[#8B6B4F] mb-4">Giá Trị Cốt Lõi</h2>
          <p className="text-[#4E3B31]/70 max-w-2xl mx-auto mb-16">
            Những nguyên tắc định hình nên phong cách phục vụ và chất lượng của The Book Haven.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-[#FBF8F3] p-8 rounded-xl shadow-sm border border-[#8B6B4F]/10 hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#8B6B4F]/10 rounded-full flex items-center justify-center text-[#8B6B4F] mx-auto mb-6">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">Tri Thức</h3>
              <p className="text-[#4E3B31]/70 text-sm leading-relaxed">
                Tuyển chọn kỹ lưỡng từng đầu sách để đảm bảo giá trị nội dung và hình thức tốt nhất.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FBF8F3] p-8 rounded-xl shadow-sm border border-[#8B6B4F]/10 hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#8B6B4F]/10 rounded-full flex items-center justify-center text-[#8B6B4F] mx-auto mb-6">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">Đam Mê</h3>
              <p className="text-[#4E3B31]/70 text-sm leading-relaxed">
                Phục vụ bằng tất cả tình yêu sách và sự trân trọng đối với từng độc giả ghé thăm.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#FBF8F3] p-8 rounded-xl shadow-sm border border-[#8B6B4F]/10 hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#8B6B4F]/10 rounded-full flex items-center justify-center text-[#8B6B4F] mx-auto mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">Cộng Đồng</h3>
              <p className="text-[#4E3B31]/70 text-sm leading-relaxed">
                Xây dựng một cộng đồng đọc sách văn minh, nơi sẻ chia và kết nối những tâm hồn.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#FBF8F3] p-8 rounded-xl shadow-sm border border-[#8B6B4F]/10 hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#8B6B4F]/10 rounded-full flex items-center justify-center text-[#8B6B4F] mx-auto mb-6">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">Bền Vững</h3>
              <p className="text-[#4E3B31]/70 text-sm leading-relaxed">
                Lan tỏa văn hóa đọc sách cũ như một cách sống xanh, tiết kiệm và bảo vệ môi trường.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THỐNG KÊ (STATS): Nền tối (#4E3B31) */}
      <section className="py-20 bg-[#4E3B31] text-[#F5EDE3]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-[#F5EDE3]/10">
            <div>
              <div className="text-4xl md:text-5xl font-bold font-serif mb-2 text-[#C8A165]">5000+</div>
              <div className="text-sm md:text-base opacity-80 uppercase tracking-widest">Đầu Sách</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold font-serif mb-2 text-[#C8A165]">10k+</div>
              <div className="text-sm md:text-base opacity-80 uppercase tracking-widest">Độc Giả</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold font-serif mb-2 text-[#C8A165]">5</div>
              <div className="text-sm md:text-base opacity-80 uppercase tracking-widest">Năm Hoạt Động</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold font-serif mb-2 text-[#C8A165]">99%</div>
              <div className="text-sm md:text-base opacity-80 uppercase tracking-widest">Hài Lòng</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. KÊU GỌI HÀNH ĐỘNG (CTA): Nền sáng */}
      <section className="py-24 bg-[#FBF8F3] text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#4E3B31] mb-6">
            Bắt Đầu Hành Trình Của Bạn
          </h2>
          <p className="text-lg text-[#4E3B31]/70 mb-10 leading-relaxed">
            Hàng ngàn câu chuyện thú vị đang chờ bạn khám phá. Hãy để The Book Haven là người bạn đồng hành tin cậy trên con đường tri thức.
          </p>
          <a
            href="/catalog"
            className="inline-block bg-[#8B6B4F] text-white px-10 py-4 rounded-md font-bold text-lg shadow-[0_4px_14px_rgba(139,107,79,0.3)] hover:bg-[#6d543e] hover:shadow-[0_6px_20px_rgba(139,107,79,0.4)] transition-all transform hover:-translate-y-0.5"
          >
            Khám Phá Cửa Hàng Ngay
          </a>
        </div>
      </section>
    </div>
  );
}
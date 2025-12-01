"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  MapPin, 
  Mail, 
  Phone,
  ArrowRight
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#8B6B4F] border-t border-[#F5EDE3]/10 pt-16 pb-8 mt-auto text-[#F5EDE3]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* CỘT 1: THƯƠNG HIỆU & GIỚI THIỆU (Chiếm 4 phần) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Bọc Logo trong khung sáng để nổi bật trên nền nâu */}
            <div className="-ml-2 inline-block bg-[#F5EDE3] py-2 px-4 rounded-lg shadow-sm">
                <Logo />
            </div>
            <p className="text-[#F5EDE3]/90 leading-relaxed max-w-sm font-serif">
              Nơi những câu chuyện tìm thấy người đọc. Chúng tôi tuyển chọn những cuốn sách cũ chất lượng, mang lại sức sống mới cho tri thức và gìn giữ văn hóa đọc truyền thống.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#F5EDE3]/10 flex items-center justify-center text-[#F5EDE3] hover:bg-[#F5EDE3] hover:text-[#8B6B4F] transition-all shadow-sm border border-[#F5EDE3]/20">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#F5EDE3]/10 flex items-center justify-center text-[#F5EDE3] hover:bg-[#F5EDE3] hover:text-[#8B6B4F] transition-all shadow-sm border border-[#F5EDE3]/20">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#F5EDE3]/10 flex items-center justify-center text-[#F5EDE3] hover:bg-[#F5EDE3] hover:text-[#8B6B4F] transition-all shadow-sm border border-[#F5EDE3]/20">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* CỘT 2: CỬA HÀNG (SHOP) */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="font-serif font-bold text-lg text-white mb-6 border-b border-[#F5EDE3]/20 pb-2 inline-block">Cửa Hàng</h3>
            <ul className="space-y-4 text-[#F5EDE3]/80">
              <li>
                <Link href="/catalog" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#F5EDE3]" />
                  Tất cả sách
                </Link>
              </li>
              <li>
                <Link href="/catalog?sort=newest" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#F5EDE3]" />
                  Sách mới về
                </Link>
              </li>
              <li>
                <Link href="/catalog?sort=best_selling" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#F5EDE3]" />
                  Sách bán chạy
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=fiction" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#F5EDE3]" />
                  Văn học
                </Link>
              </li>
            </ul>
          </div>

          {/* CỘT 3: HỖ TRỢ (SUPPORT) */}
          <div className="lg:col-span-3">
            <h3 className="font-serif font-bold text-lg text-white mb-6 border-b border-[#F5EDE3]/20 pb-2 inline-block">Hỗ Trợ</h3>
            <ul className="space-y-4 text-[#F5EDE3]/80 mb-6">
              <li>
                <Link href="/support" className="hover:text-white transition-colors">Trung tâm trợ giúp</Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">Tra cứu đơn hàng</Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">Tài khoản của tôi</Link>
              </li>
            </ul>

            <div className="space-y-3 text-sm text-[#F5EDE3]/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F5EDE3] mt-0.5 shrink-0" />
                <span>123 Đường Sách, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#F5EDE3] shrink-0" />
                <span>1900 123 456 (8:00 - 21:00)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#F5EDE3] shrink-0" />
                <span>support@thebookhaven.com</span>
              </div>
            </div>
          </div>

          {/* CỘT 4: CÔNG TY (COMPANY) */}
          <div className="lg:col-span-2">
            <h3 className="font-serif font-bold text-lg text-white mb-6 border-b border-[#F5EDE3]/20 pb-2 inline-block">Về Chúng Tôi</h3>
            <ul className="space-y-4 text-[#F5EDE3]/80">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">Câu chuyện thương hiệu</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link>
              </li>
              <li>
                <Link href="/policy" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link href="/refunds-and-returns-terms" className="hover:text-white transition-colors">Chính sách đổi trả</Link>
              </li>
              <li>
                <Link href="/promotion-terms" className="hover:text-white transition-colors">Điều khoản khuyến mãi</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-[#F5EDE3]/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#F5EDE3]/60">
          <p>© {new Date().getFullYear()} The Book Haven. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="cursor-pointer hover:text-white transition-colors">Privacy</span>
            <span className="cursor-pointer hover:text-white transition-colors">Terms</span>
            <span className="cursor-pointer hover:text-white transition-colors">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
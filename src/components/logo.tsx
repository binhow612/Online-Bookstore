import Link from "next/link";
import Image from "next/image"; // Import component Image

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
      {/* Phần hình ảnh Logo */}
      <div className="relative w-8 h-8 md:w-10 md:h-10">
        <Image
          src="/logo.png" // Đường dẫn tới file trong thư mục public
          alt="The Book Haven Logo"
          fill // Tự động co giãn theo khung chứa (div cha)
          className="object-contain" // Giữ nguyên tỉ lệ ảnh
          priority // Ưu tiên load ảnh này vì nó ở đầu trang
        />
      </div>

      {/* Phần tên trang web */}
      <span className="font-bold text-xl text-[#8B6B4F] font-serif tracking-tight">
        The Book Haven
      </span>
    </Link>
  );
};
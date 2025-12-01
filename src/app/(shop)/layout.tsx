export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Không cần CartProvider/SessionProvider ở đây nữa vì RootLayout đã lo rồi
  return <>{children}</>;
}
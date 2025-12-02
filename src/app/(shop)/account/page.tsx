import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "./action";
import {
  UserIcon,
  ShoppingBagIcon,
  MapPinIcon,
  LockClosedIcon,
  ArrowLeftOnRectangleIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { cn, formatPrice } from "@/lib/utils";
import { db } from "@/db";
import { ordersTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
// SỬA: Đổi AddressForm thành PersonalInfoForm cho khớp với file account-forms.tsx
import { PersonalInfoForm, ChangePasswordForm } from "./account-forms";

export const metadata: Metadata = {
  title: "My Account - The Book Haven",
  description: "Manage your account and view orders.",
};

type TabType = "dashboard" | "orders" | "personal-info" | "password";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await getSession();
  const user = session.user;
  const { tab } = await searchParams;
  const currentTab = (tab as TabType) || "dashboard";

  if (!user) {
    redirect("/login?next=/account");
  }

  // --- FETCH REAL DATA (Kết nối Database) ---
  const orders = await db.query.ordersTable.findMany({
    where: eq(ordersTable.user_id, user.id),
    orderBy: [desc(ordersTable.created_at)],
    limit: 10,
  });

  // --- SUB-COMPONENTS FOR TABS ---

  const DashboardTab = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="prose text-[#4E3B31]/80 max-w-none">
        <p className="text-lg">
          Hello <span className="font-bold text-[#8B6B4F]">{user.first_name || user.email}</span>,
        </p>
        <p>
          From your account dashboard you can view your{" "}
          <Link href="?tab=orders" className="text-[#8B6B4F] font-medium hover:underline">
            recent orders
          </Link>
          , manage your{" "}
          <Link href="?tab=personal-info" className="text-[#8B6B4F] font-medium hover:underline">
            personal information
          </Link>
          , and{" "}
          <Link href="?tab=password" className="text-[#8B6B4F] font-medium hover:underline">
            change your password
          </Link>
          .
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="?tab=orders" className="group bg-[#FBF8F3] p-6 rounded-xl border border-[#E8DFC5] hover:border-[#8B6B4F] hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-[#F5EDE3] rounded-full flex items-center justify-center text-[#8B6B4F] mb-4 group-hover:bg-[#8B6B4F] group-hover:text-white transition-colors">
            <ShoppingBagIcon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#4E3B31] mb-1">Orders</h3>
          <p className="text-sm text-[#4E3B31]/60">Check order history</p>
        </Link>

        <Link href="?tab=personal-info" className="group bg-[#FBF8F3] p-6 rounded-xl border border-[#E8DFC5] hover:border-[#8B6B4F] hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-[#F5EDE3] rounded-full flex items-center justify-center text-[#8B6B4F] mb-4 group-hover:bg-[#8B6B4F] group-hover:text-white transition-colors">
            <UserIcon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#4E3B31] mb-1">Personal Info</h3>
          <p className="text-sm text-[#4E3B31]/60">Update details & address</p>
        </Link>

        <Link href="?tab=password" className="group bg-[#FBF8F3] p-6 rounded-xl border border-[#E8DFC5] hover:border-[#8B6B4F] hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-[#F5EDE3] rounded-full flex items-center justify-center text-[#8B6B4F] mb-4 group-hover:bg-[#8B6B4F] group-hover:text-white transition-colors">
            <LockClosedIcon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#4E3B31] mb-1">Security</h3>
          <p className="text-sm text-[#4E3B31]/60">Change password</p>
        </Link>
      </div>
    </div>
  );

  const OrdersTab = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="text-xl font-bold text-[#4E3B31] font-serif border-b border-[#4E3B31]/10 pb-4">Order History</h3>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#FBF8F3] rounded-lg border border-[#4E3B31]/10 p-4 md:p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:shadow-sm transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-[#4E3B31]">#{order.id}</span>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium capitalize",
                    order.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                    order.status === "processing" ? "bg-blue-100 text-blue-700" :
                    order.status === "cancelled" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  )}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-[#4E3B31]/60">Date: {new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#8B6B4F]">{formatPrice(order.total_price)}</p>
              </div>
              <Link href={`/orders/${order.id}`}>
                <Button variant="outline" className="border-[#8B6B4F] text-[#8B6B4F] hover:bg-[#F5EDE3]">
                  View Details
                </Button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-[#FBF8F3] rounded-lg border border-[#4E3B31]/10">
          <ShoppingBagIcon className="w-12 h-12 text-[#4E3B31]/20 mx-auto mb-3" />
          <p className="text-[#4E3B31]/60 italic">No orders found.</p>
          <Link href="/catalog" className="text-[#8B6B4F] hover:underline mt-2 inline-block text-sm font-medium">Start Shopping</Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-[#F5EDE3] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-serif font-bold text-[#4E3B31] mb-10 text-center">My Account</h1>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* SIDEBAR NAVIGATION */}
            <aside className="w-full md:w-80 shrink-0 bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#4E3B31]/10 overflow-hidden sticky top-24">
                <div className="p-6 bg-[#FBF8F3] border-b border-[#4E3B31]/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#E8DFC5] flex items-center justify-center text-[#8B6B4F] font-bold text-xl uppercase">
                        {user.first_name?.[0] || user.email[0]}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm text-[#4E3B31]/60">Hello,</p>
                        <p className="font-bold text-[#4E3B31] truncate">{user.first_name || user.email}</p>
                    </div>
                </div>
                
                <nav className="flex flex-col p-2 space-y-1">
                     <Link 
                        href="?tab=dashboard" 
                        className={cn(
                          "px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors",
                          currentTab === "dashboard" ? "bg-[#8B6B4F] text-white shadow-md" : "text-[#4E3B31]/70 hover:bg-[#F5EDE3] hover:text-[#4E3B31]"
                        )}
                     >
                        <Squares2X2Icon className="w-5 h-5" />
                        Dashboard
                     </Link>
                     
                     <Link 
                        href="?tab=orders" 
                        className={cn(
                          "px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors",
                          currentTab === "orders" ? "bg-[#8B6B4F] text-white shadow-md" : "text-[#4E3B31]/70 hover:bg-[#F5EDE3] hover:text-[#4E3B31]"
                        )}
                     >
                        <ShoppingBagIcon className="w-5 h-5" />
                        Orders
                     </Link>
                     
                     <Link 
                        href="?tab=personal-info" 
                        className={cn(
                          "px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors",
                          currentTab === "personal-info" ? "bg-[#8B6B4F] text-white shadow-md" : "text-[#4E3B31]/70 hover:bg-[#F5EDE3] hover:text-[#4E3B31]"
                        )}
                     >
                         <MapPinIcon className="w-5 h-5" />
                         Personal Information
                     </Link>
                     
                     <Link 
                        href="?tab=password" 
                        className={cn(
                          "px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors",
                          currentTab === "password" ? "bg-[#8B6B4F] text-white shadow-md" : "text-[#4E3B31]/70 hover:bg-[#F5EDE3] hover:text-[#4E3B31]"
                        )}
                     >
                         <LockClosedIcon className="w-5 h-5" />
                         Change Password
                     </Link>

                     {user.role === 'admin' && (
                         <Link 
                            href="/admin" 
                            className="px-4 py-3 rounded-lg text-[#4E3B31]/70 hover:bg-[#F5EDE3] hover:text-[#4E3B31] transition-colors flex items-center gap-3"
                         >
                             <UserIcon className="w-5 h-5" />
                             Admin Dashboard
                         </Link>
                     )}
                     
                     <div className="h-px bg-[#4E3B31]/10 my-2 mx-4"></div>

                     <form action={logoutAction}>
                         <button type="submit" className="w-full px-4 py-3 rounded-lg text-red-600/80 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-3 text-left font-medium">
                             <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                             Log out
                         </button>
                     </form>
                </nav>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 w-full bg-white p-8 md:p-10 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#4E3B31]/10 min-h-[500px]">
                {currentTab === "dashboard" && <DashboardTab />}
                {currentTab === "orders" && <OrdersTab />}
                {/* SỬA: Thay AddressForm bằng PersonalInfoForm */}
                {currentTab === "personal-info" && <PersonalInfoForm user={user} />}
                {currentTab === "password" && <ChangePasswordForm />}
            </div>
        </div>
      </div>
    </div>
  );
}
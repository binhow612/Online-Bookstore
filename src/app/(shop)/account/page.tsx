import { Button, buttonVariants } from "@/components/ui/button";
import { getSession } from "@/lib/session";
import { Metadata } from "next";
import Link from "next/link";
import { logoutAction } from "./action";

function Card({
  title,
  description,
  href,
  variant = "default",
}: {
  title: string;
  description: string;
  href: string;
  variant?: "default" | "admin";
}) {
  return (
    <Link 
      href={href} 
      className={`p-4 hover:shadow-md transition flex ${
        variant === "admin" 
          ? "bg-teal-600 hover:bg-teal-700" 
          : "bg-gray-50 hover:bg-gray-100"
      }`}
    >
      <div className="flex-1 flex flex-col ml-4">
        <h2 className={`text-lg font-medium ${variant === "admin" ? "text-white" : ""}`}>
          {title}
        </h2>
        <p className={`text-sm mb-2 ${variant === "admin" ? "text-teal-100" : "text-gray-700"}`}>
          {description}
        </p>
      </div>
    </Link>
  );
}

export default async function AccountPage() {
  const session = await getSession();
  console.log('Session user:', session.user);
  console.log('User role:', session.user?.role);
  console.log('Is admin?:', session.user?.role === 'admin');
  return (
    <div className="container max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-medium mb-4">My Account</h1>
      <div className="flex gap-4 items-center">
        <p className="text-gray-900 text-md">
          {session.user ? (
            <span>
              You are currently logged in as{" "}
              <span className="font-semibold">{session.user?.email}</span>.
            </span>
          ) : (
            <span>You are not logged in.</span>
          )}
        </p>
        {session.user ? (
          <form action={logoutAction}>
            <Button type="submit" variant="primary" size="sm">
              Logout
            </Button>
          </form>
        ) : (
          <Link href="/login" className={buttonVariants({ size: "sm" })}>
            Login
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {session.user?.role === 'admin' && (
          <Card
            title="Admin Dashboard"
            description="Manage your store, products, and orders"
            href="/admin"
            variant="admin"
          />
        )}
        <Card
          title="My Orders"
          description="View your order history"
          href="/orders"
        />
        <Card
          title="Update information"
          description="Update your account information"
          href="/account/update"
        />
        <Card
          title="Contact Support"
          description="Get help with your account or orders"
          href="/support"
        />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "My Account - The Book Haven",
  description: "View your account information and order history.",
};
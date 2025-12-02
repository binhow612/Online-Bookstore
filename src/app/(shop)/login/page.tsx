import { getSession } from "@/lib/session";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await getSession();

  if (session.user) {
    redirect("/account");
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-[var(--beige-cream)] px-4">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg border border-[rgba(78,59,49,0.15)] bg-[var(--warm-white)]">
        <h1 className="text-3xl font-bold text-center mb-2 text-[var(--wood-brown)]">
          Welcome Back
        </h1>

        <p className="text-center text-[var(--dark-coffee)] mb-8">
          Login to continue your reading journey 📚
        </p>

        <LoginForm />

        <p className="text-center text-[var(--dark-coffee)] mt-8">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="underline font-semibold text-[var(--wood-brown)]"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Login - The Book Haven",
  description: "Login to your Book Haven account.",
};

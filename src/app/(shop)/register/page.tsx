import { getSession } from "@/lib/session";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "./register-form";

export default async function CreateAccountPage() {
  const session = await getSession();

  if (session.user) redirect("/account");

  return (
    <div className="container max-w-xl mx-auto py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[var(--wood-brown)] mb-3">
          Create Account
        </h1>
        <p className="text-neutral-700">
          Join The Book Haven and start exploring your reading journey.
        </p>
      </div>

      <RegisterForm />

      <p className="text-neutral-600 mt-8 text-center">
        Already have an account?{" "}
        <Link href="/login" className="underline text-[var(--dark-coffee)]">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Create Account - The Book Haven",
  description: "Register an account to explore books and manage your orders.",
};

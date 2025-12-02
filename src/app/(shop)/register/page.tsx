import { getSession } from "@/lib/session";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "./register-form";

export default async function CreateAccountPage() {
  const session = await getSession();

  if (session.user) {
    redirect("/account");
  }

  return (
    <div className="container max-w-xl mx-auto py-24">
      <div className="bg-[var(--warm-white)] border border-[rgba(78,59,49,0.12)] shadow-lg rounded-2xl p-10">
        <h1 className="text-3xl font-medium mb-3 text-[var(--wood-brown)]">
          Create Account
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Join The Book Haven and enjoy a seamless reading & shopping experience.
        </p>

        <RegisterForm />

        <p className="text-gray-600 mt-8 text-center">
          Already have an account?{" "}
          <Link href="/login" className="underline text-[var(--dark-coffee)] font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Create Account - The Book Haven",
  description: "Register to enjoy a smoother reading & shopping experience.",
};

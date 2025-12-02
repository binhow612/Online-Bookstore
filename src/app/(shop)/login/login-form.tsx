"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { loginAction, LoginActionState } from "./actions";

const initialState: LoginActionState = {
  values: {
    email: "",
    password: "",
  },
};

export function LoginForm() {
  const searchParams = useSearchParams();
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-[var(--dark-coffee)]">
          Email
        </label>
        <Input
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          name="email"
          defaultValue={state.values.email}
          required
          className="border-[var(--wood-brown)] focus:ring-[var(--wood-brown)]"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-[var(--dark-coffee)]">
          Password
        </label>
        <Input
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          name="password"
          required
          className="border-[var(--wood-brown)] focus:ring-[var(--wood-brown)]"
        />
      </div>

      {/* Hidden redirect */}
      <input type="hidden" name="next" value={searchParams.get("next") || ""} />

      {/* Error */}
      {state.result && "error" in state.result && (
        <div className="text-red-600 text-center">
          {state.result.error}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full flex bg-[var(--wood-brown)] hover:bg-[var(--dark-coffee)] text-white py-3 text-lg justify-center"
        disabled={pending}
      >
        {pending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}

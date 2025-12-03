"use client";

import { CountrySelect } from "@/components/country-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_COUNTRY_CODE } from "@/lib/constants";
import { useActionState } from "react";
import { registerAction, RegisterActionState } from "./actions";

const initialState: RegisterActionState = {
  values: {
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  },
};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-10 bg-white/70 p-8 rounded-xl shadow-lg border border-neutral-200"
    >
      {/* ----------- Your Account ----------- */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[var(--wood-brown)]">
          Your Account
        </h2>

        <div className="flex flex-col gap-4">
          {/* FIRST NAME */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">
              First Name
            </label>
            <Input
              type="text"
              name="first_name"
              placeholder="Enter your first name"
              defaultValue={state.values.first_name}
              autoComplete="given-name"
              required
            />
          </div>

          {/* LAST NAME */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">
              Last Name
            </label>
            <Input
              type="text"
              name="last_name"
              placeholder="Enter your last name"
              defaultValue={state.values.last_name}
              autoComplete="family-name"
              required
            />
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              defaultValue={state.values.email}
              autoComplete="email"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">
              Password
            </label>
            <Input
              type="password"
              name="password"
              placeholder="Create a password"
              autoComplete="new-password"
              required
            />
          </div>
        </div>
      </div>

      {/* ----------- Optional Information ----------- */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[var(--wood-brown)]">
          Your Information (Optional)
        </h2>

        <p className="text-sm text-neutral-600 leading-relaxed">
          These details help us autofill your shipping and billing info for a
          smoother checkout experience.
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">
              Address
            </label>
            <Input
              type="text"
              name="address"
              placeholder="Street address"
              defaultValue={state.values.address}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">City</label>
            <Input
              type="text"
              name="city"
              placeholder="Your city"
              defaultValue={state.values.city}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">
              Country
            </label>
            <CountrySelect
              name="country_code"
              defaultValue={state.values.country_code || DEFAULT_COUNTRY_CODE}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">
              Phone Number
            </label>
            <Input
              type="tel"
              name="phone_number"
              placeholder="Phone number"
              defaultValue={state.values.phone_number}
            />
          </div>
        </div>
      </div>

      {state.result && "error" in state.result && (
        <div className="text-red-600 text-sm">{state.result.error}</div>
      )}

      <Button type="submit" variant="primary" className="w-full" disabled={pending}>
        Create Account
      </Button>
    </form>
  );
}

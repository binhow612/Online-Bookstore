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
    <form action={formAction} className="flex flex-col gap-10">

      {/* ACCOUNT SECTION */}
      <div className="bg-white p-6 rounded-xl border border-[rgba(78,59,49,0.12)] shadow-sm flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-[var(--wood-brown)]">
          Your Account
        </h2>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="First Name"
              name="first_name"
              defaultValue={state.values.first_name}
              autoComplete="given-name"
              required
              className="flex-1"
            />

            <Input
              type="text"
              placeholder="Last Name"
              name="last_name"
              defaultValue={state.values.last_name}
              autoComplete="family-name"
              required
              className="flex-1"
            />
          </div>

          <Input
            type="email"
            placeholder="Email"
            name="email"
            defaultValue={state.values.email}
            autoComplete="email"
            required
          />

          <Input
            type="password"
            placeholder="Password"
            name="password"
            autoComplete="new-password"
            required
          />
        </div>
      </div>

      {/* OPTIONAL INFO */}
      <div className="bg-white p-6 rounded-xl border border-[rgba(78,59,49,0.12)] shadow-sm flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-[var(--wood-brown)]">
          Your Information (Optional)
        </h2>
        <p className="text-sm text-gray-500">
          Prefill your details for a smoother checkout experience.
        </p>

        <div className="flex flex-col gap-3">
          <Input
            type="text"
            placeholder="Address"
            name="address"
            defaultValue={state.values.address}
          />

          <Input
            type="text"
            placeholder="City"
            name="city"
            defaultValue={state.values.city}
          />

          <CountrySelect
            name="country_code"
            defaultValue={state.values.country_code || DEFAULT_COUNTRY_CODE}
          />

          <Input
            type="tel"
            placeholder="Phone Number"
            name="phone_number"
            defaultValue={state.values.phone_number}
          />
        </div>
      </div>

      {state.result && "error" in state.result && (
        <div className="text-red-600 text-center">{state.result.error}</div>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={pending}
        className="w-full py-3 text-lg font-medium rounded-xl shadow-md"
      >
        Create Account
      </Button>
    </form>
  );
}

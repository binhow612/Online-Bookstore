"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountrySelect } from "@/components/country-select";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import {
  changePasswordAction,
  updateAddressAction,
  FormState
} from "./action";

import { User } from "@/types";

// ------------------------
// Shared Submit Button
// ------------------------
function SubmitButton({ text, loadingText }: { text: string; loadingText: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="bg-[#8B6B4F] hover:bg-[#6d543e] text-white h-11 px-6 rounded-lg font-semibold shadow disabled:opacity-60"
      disabled={pending}
    >
      {pending ? loadingText : text}
    </Button>
  );
}

// ------------------------
// CHANGE PASSWORD
// ------------------------
export function ChangePasswordForm() {
  const initialState: FormState = { error: undefined, success: undefined };
  const [state, formAction] = useActionState(changePasswordAction, initialState);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
    if (state?.success) toast.success(state.success);
  }, [state]);

  return (
    <form action={formAction} className="space-y-6 max-w-lg animate-in fade-in duration-300 pb-10">
      <h3 className="text-2xl font-serif font-bold text-[#4E3B31] border-b border-[#4E3B31]/10 pb-4">
        Change Password
      </h3>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#4E3B31]">Current Password</label>
        <Input
          name="currentPassword"
          type="password"
          placeholder="••••••••"
          className="h-11 bg-white border-[#4E3B31]/20 focus:ring-[#8B6B4F]"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#4E3B31]">New Password</label>
        <Input
          name="newPassword"
          type="password"
          placeholder="••••••••"
          className="h-11 bg-white border-[#4E3B31]/20 focus:ring-[#8B6B4F]"
          required
        />
        <p className="text-xs text-[#4E3B31]/50">Minimum 6 characters.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#4E3B31]">Confirm New Password</label>
        <Input
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          className="h-11 bg-white border-[#4E3B31]/20 focus:ring-[#8B6B4F]"
          required
        />
      </div>

      <div className="pt-4">
        <SubmitButton text="Save Changes" loadingText="Saving..." />
      </div>
    </form>
  );
}

// ------------------------
// PERSONAL INFORMATION FORM
// ------------------------
export function PersonalInfoForm({ user }: { user: User }) {
  const initialState: FormState = { error: undefined, success: undefined };
  const [state, formAction] = useActionState(updateAddressAction, initialState);
  const [isEditing, setIsEditing] = useState(!user.address);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
    if (state?.success) {
      toast.success(state.success);
      setIsEditing(false);
    }
  }, [state]);

  // VIEW MODE
  if (!isEditing) {
    return (
      <div className="animate-in fade-in duration-200 space-y-6">
        <div className="flex justify-between items-center border-b border-[#4E3B31]/10 pb-4">
          <h3 className="text-2xl font-serif font-bold text-[#4E3B31]">Personal Information</h3>
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-[#8B6B4F] hover:bg-[#6d543e] text-white px-4 py-2"
          >
            Edit Information
          </Button>
        </div>

        <div className="bg-[#FBF8F3] border border-[#8B6B4F]/30 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-[#4E3B31] mb-3">
            {user.first_name} {user.last_name}
          </h4>

          <div className="space-y-2 text-sm text-[#4E3B31]/80">
            <p><span className="font-medium text-[#4E3B31]">Phone:</span> {user.phone_number}</p>
            <p><span className="font-medium text-[#4E3B31]">Address:</span> {user.address}</p>
            <p><span className="font-medium text-[#4E3B31]">City:</span> {user.city}</p>
            <p><span className="font-medium text-[#4E3B31]">Country:</span> {user.country_code}</p>
          </div>
        </div>
      </div>
    );
  }

  // EDIT MODE
  return (
    <form action={formAction} className="space-y-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center border-b border-[#4E3B31]/10 pb-4">
        <h3 className="text-2xl font-serif font-bold text-[#4E3B31]">
          Edit Personal Information
        </h3>

        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsEditing(false)}
          className="text-[#4E3B31]/70 hover:bg-[#F5EDE3]"
        >
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

        <div className="flex flex-col gap-1">
          <label className="text-sm text-[#4E3B31]">First Name</label>
          <Input
            name="firstName"
            defaultValue={user.first_name}
            className="h-11 border-[#4E3B31]/20"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-[#4E3B31]">Last Name</label>
          <Input
            name="lastName"
            defaultValue={user.last_name}
            className="h-11 border-[#4E3B31]/20"
            required
          />
        </div>

        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-sm text-[#4E3B31]">Phone Number</label>
          <Input
            name="phone"
            defaultValue={user.phone_number}
            className="h-11 border-[#4E3B31]/20"
            required
          />
        </div>

        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-sm text-[#4E3B31]">Address</label>
          <Input
            name="address"
            defaultValue={user.address}
            className="h-11 border-[#4E3B31]/20"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-[#4E3B31]">City</label>
          <Input
            name="city"
            defaultValue={user.city}
            className="h-11 border-[#4E3B31]/20"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-[#4E3B31]">Country</label>
          <CountrySelect
            name="countryCode"
            defaultValue={user.country_code || "VN"}
            className="h-11 border-[#4E3B31]/20"
          />
        </div>

      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsEditing(false)}
          className="border-[#4E3B31]/20 text-[#4E3B31]"
        >
          Cancel
        </Button>

        <SubmitButton text="Save Information" loadingText="Saving..." />
      </div>
    </form>
  );
}

// ------------------------
// PAGE + LAYOUT + SIDEBAR
// ------------------------
export default function MyAccountPage() {
  const user: User = {
    first_name: "Phan",
    last_name: "Hao2",
    phone_number: "+84901234567",
    address: "123 abc",
    city: "ho chi minh",
    country_code: "Vietnam",
  };

  const [tab, setTab] = useState<"info" | "password">("info");

  return (
    <div className="min-h-screen bg-[#F4EDE4] py-10 px-6 md:px-20">
      <h1 className="text-center font-serif text-4xl font-bold text-[#4E3B31] mb-12">
        My Account
      </h1>

      <div className="grid md:grid-cols-[260px,1fr] gap-10">

        {/* SIDEBAR */}
        <div className="bg-white rounded-2xl shadow-sm p-6 h-fit flex flex-col gap-2">
          <div className="font-serif text-lg font-semibold text-[#4E3B31] mb-4">
            Hello, <span className="font-bold">{user.first_name}</span>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setTab("info")}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                tab === "info"
                  ? "bg-[#8B6B4F] text-white"
                  : "hover:bg-[#F5EDE3] text-[#4E3B31]"
              }`}
            >
              Personal Information
            </button>

            <button
              onClick={() => setTab("password")}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                tab === "password"
                  ? "bg-[#8B6B4F] text-white"
                  : "hover:bg-[#F5EDE3] text-[#4E3B31]"
              }`}
            >
              Change Password
            </button>

            <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
              Log out
            </button>
          </nav>
        </div>

        {/* CONTENT */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {tab === "info" ? <PersonalInfoForm user={user} /> : <ChangePasswordForm />}
        </div>

      </div>
    </div>
  );
}

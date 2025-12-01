"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountrySelect } from "@/components/country-select";
// [!code change] Update imports for React 19 compatibility
// import { useFormState } from "react-dom"; // Old
import { useActionState } from "react"; // New React 19 hook
import { useFormStatus } from "react-dom"; // Keep this for child buttons if needed
import { changePasswordAction, updateAddressAction, FormState } from "./action";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User } from "@/types";

const initialState: FormState = { error: undefined, success: undefined };

function SubmitButton({ text, loadingText }: { text: string; loadingText: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full bg-[#8B6B4F] hover:bg-[#6d543e] text-white h-11 font-bold shadow-sm disabled:opacity-70"
      disabled={pending}
    >
      {pending ? loadingText : text}
    </Button>
  );
}

export function ChangePasswordForm() {
  // [!code change] Switch to useActionState. Note: It returns [state, action, isPending]
  const [state, formAction] = useActionState(changePasswordAction, initialState);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
    if (state?.success) toast.success(state.success);
  }, [state]);

  return (
    <form action={formAction} className="space-y-5 max-w-lg animate-in fade-in duration-500">
      <h3 className="text-xl font-bold text-[#4E3B31] font-serif border-b border-[#4E3B31]/10 pb-4">
        Change Password
      </h3>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#4E3B31]">Current Password</label>
        <Input
          name="currentPassword"
          type="password"
          placeholder="••••••••"
          className="bg-white border-[#4E3B31]/20 focus:ring-[#8B6B4F] h-11"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#4E3B31]">New Password</label>
        <Input
          name="newPassword"
          type="password"
          placeholder="••••••••"
          className="bg-white border-[#4E3B31]/20 focus:ring-[#8B6B4F] h-11"
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
          className="bg-white border-[#4E3B31]/20 focus:ring-[#8B6B4F] h-11"
          required
        />
      </div>
      <div className="pt-4">
        <SubmitButton text="Save Changes" loadingText="Saving..." />
      </div>
    </form>
  );
}

export function AddressForm({ user }: { user: User }) {
  // [!code change] Switch to useActionState
  const [state, formAction] = useActionState(updateAddressAction, initialState);
  
  // Logic: If user has no address, default to Edit mode.
  const [isEditing, setIsEditing] = useState(!user.address);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
    if (state?.success) {
      toast.success(state.success);
      setIsEditing(false); // Switch back to View mode on success
    }
  }, [state]);

  // VIEW MODE
  if (!isEditing) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center border-b border-[#4E3B31]/10 pb-4">
          <h3 className="text-xl font-bold text-[#4E3B31] font-serif">Personal Information</h3>
          <Button 
            onClick={() => setIsEditing(true)} 
            className="bg-[#8B6B4F] hover:bg-[#6d543e] text-white"
          >
            Edit Information
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#FBF8F3] p-6 rounded-xl border border-[#8B6B4F]/30 relative">
            <span className="absolute top-4 right-4 text-xs font-bold text-[#8B6B4F] bg-[#F5EDE3] px-2 py-1 rounded">Primary</span>
            <h4 className="font-bold text-[#4E3B31] mb-2">{user.first_name} {user.last_name}</h4>
            <div className="space-y-1">
                <p className="text-sm text-[#4E3B31]/70"><span className="font-medium text-[#4E3B31]">Phone:</span> {user.phone_number || "No phone number"}</p>
                <p className="text-sm text-[#4E3B31]/70"><span className="font-medium text-[#4E3B31]">Address:</span> {user.address || "No address set"}</p>
                <p className="text-sm text-[#4E3B31]/70"><span className="font-medium text-[#4E3B31]">Location:</span> {user.city ? `${user.city}, ${user.country_code}` : "Not set"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // EDIT MODE
  return (
    <form action={formAction} className="space-y-5 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-[#4E3B31]/10 pb-4">
        <h3 className="text-xl font-bold text-[#4E3B31] font-serif">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#4E3B31]">First Name</label>
          <Input 
            name="firstName" 
            defaultValue={user.first_name || ""} 
            required 
            className="bg-white border-[#4E3B31]/20 focus:ring-[#8B6B4F] h-11" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#4E3B31]">Last Name</label>
          <Input 
            name="lastName" 
            defaultValue={user.last_name || ""} 
            required 
            className="bg-white border-[#4E3B31]/20 focus:ring-[#8B6B4F] h-11" 
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-[#4E3B31]">Phone Number</label>
          <Input 
            name="phone" 
            defaultValue={user.phone_number || ""} 
            required 
            className="bg-white border-[#4E3B31]/20 focus:ring-[#8B6B4F] h-11" 
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-[#4E3B31]">Address</label>
          <Input 
            name="address" 
            defaultValue={user.address || ""} 
            placeholder="Street address, Apt, Suite, etc." 
            required 
            className="bg-white border-[#4E3B31]/20 focus:ring-[#8B6B4F] h-11" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#4E3B31]">City</label>
          <Input 
            name="city" 
            defaultValue={user.city || ""} 
            required 
            className="bg-white border-[#4E3B31]/20 focus:ring-[#8B6B4F] h-11" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#4E3B31]">Country</label>
          <CountrySelect 
            name="countryCode" 
            defaultValue={user.country_code || "VN"} 
            required 
            className="bg-white border-[#4E3B31]/20 focus:ring-[#8B6B4F] h-11" 
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
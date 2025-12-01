"use server";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { getSession, clearSession } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyPassword, hashPassword } from "@/lib/hash";
import { z } from "zod";

export type FormState = {
  error?: string;
  success?: string;
};

const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Phone number is invalid"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(1, "City is required"),
  countryCode: z.string().min(2, "Country code is required"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

export async function updateAddressAction(
  prevState: FormState, 
  formData: FormData
): Promise<FormState> {
  const session = await getSession();
  if (!session.user) return { error: "Unauthorized" };

  const data = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city: formData.get("city"),
    countryCode: formData.get("countryCode"),
  };

  const parsed = addressSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await db
      .update(usersTable)
      .set({
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        phone_number: parsed.data.phone,
        address: parsed.data.address,
        city: parsed.data.city,
        country_code: parsed.data.countryCode,
      })
      .where(eq(usersTable.id, session.user.id));

    revalidatePath("/account");
    return { success: "Personal information updated successfully" };
  } catch (error) {
    return { error: "Failed to update personal information" };
  }
}

export async function changePasswordAction(
  prevState: FormState, 
  formData: FormData
): Promise<FormState> {
  const session = await getSession();
  if (!session.user) return { error: "Unauthorized" };

  const data = {
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = passwordSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, session.user.id),
  });

  if (!user || !user.password_hash) {
    return { error: "User not found" };
  }

  const isPasswordValid = await verifyPassword(parsed.data.currentPassword, user.password_hash);
  if (!isPasswordValid) {
    return { error: "Incorrect current password" };
  }

  const newPasswordHash = await hashPassword(parsed.data.newPassword);

  try {
    await db
      .update(usersTable)
      .set({
        password_hash: newPasswordHash,
      })
      .where(eq(usersTable.id, session.user.id));

    return { success: "Password changed successfully" };
  } catch (error) {
    return { error: "Failed to change password" };
  }
}
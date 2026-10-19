"use server";

import { JSON_HEADER } from "@/src/lib/constants/api.constant";
import { getNextAuthToken } from "@/src/lib/utils/auth.utils";
import getSignature from "@/src/lib/utils/get-signature.utils";
import { UpdatePasswordFields } from "../_schemas/update-password.schema";

export const updateUserPasswordAction = async (data: UpdatePasswordFields) => {
  // token & signature
  const token = await getNextAuthToken();
  const signature = getSignature(token?.user?.role);

  const response = await fetch(
    `${process.env.DATABASE_URL}/users/update-password`,
    {
      method: "PATCH",
      headers: {
        ...JSON_HEADER,
        Authorization: `${signature} ${token?.token}`,
      },
      body: JSON.stringify({
        oldPassword: data.oldPassword,
        password: data.newPassword,
        confirmPassword: data.confirmPassword,
        flag: data.flag,
      }),
    },
  );

  const payload: APIResponseNoData<UpdatePasswordFields> =
    await response.json();

  if (!payload?.success) {
    throw new Error(
      typeof payload.message === "string"
        ? payload.message
        : (payload?.message?.[0]?.message ?? "Failed to update user password"),
    );
  }
  return payload.message;
};

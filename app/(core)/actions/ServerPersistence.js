"use server";

import { cookies } from "next/headers";

export async function persistLogin(user) {
  const cookieStore = await cookies();
  cookieStore.set("x-loginUserDetail", JSON.stringify(user), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { ok: true };
}

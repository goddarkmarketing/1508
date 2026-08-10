import { NextResponse } from "next/server";
import { AUTH_COOKIE, demoUsers, encodeSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const user = demoUsers.find(
    (u) =>
      u.email.toLowerCase() === parsed.data.email.toLowerCase() &&
      u.password === parsed.data.password,
  );

  if (!user) {
    return NextResponse.json({ error: "Email or password is incorrect" }, { status: 401 });
  }

  const response = NextResponse.json({
    data: { email: user.email, name: user.name, role: user.role },
  });

  response.cookies.set(
    AUTH_COOKIE,
    encodeSession({ email: user.email, name: user.name, role: user.role }),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    },
  );

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}

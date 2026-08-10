import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/forms/login-form";
import { company } from "@/data/company";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin login",
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-svh items-center justify-center bg-secondary/40 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src={company.logo}
            alt={company.name}
            width={64}
            height={64}
            className="size-16 rounded-full bg-white object-contain"
          />
          <h1 className="mt-4 text-2xl font-semibold">Back office</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage tours and inquiries
          </p>
        </div>
        <LoginForm />
        <div className="mt-6 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Demo accounts</p>
          <p className="mt-1">Admin: ggmthaimanagement@gmail.com / admin123</p>
          <p>Sales: ggm.thaitravel@gmail.com / sales123</p>
        </div>
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-primary hover:underline">
            Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

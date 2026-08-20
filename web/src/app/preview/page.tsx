"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { SiteImage as Image } from "@/components/shared/site-image";
import { company } from "@/data/company";
import {
  getPreviewAccessUrl,
  setPreviewSession,
  verifyPreviewPassword,
} from "@/lib/feedback-preview";
import {
  previewPasswordSchema,
  type PreviewPasswordFormValues,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PreviewAccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PreviewPasswordFormValues>({
    resolver: zodResolver(previewPasswordSchema),
    defaultValues: { password: "" },
  });

  async function onSubmit(values: PreviewPasswordFormValues) {
    setLoading(true);
    try {
      if (!verifyPreviewPassword(values.password)) {
        throw new Error("รหัสผ่านไม่ถูกต้อง");
      }
      setPreviewSession();
      toast.success("เข้าสู่โหมดตรวจงานแล้ว");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ไม่สามารถเข้าสู่ระบบได้");
    } finally {
      setLoading(false);
    }
  }

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
          <h1 className="mt-4 text-2xl font-semibold">ตรวจงานเว็บไซต์</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            กรอกรหัสผ่านเพื่อเปิดโหมด Preview และแจ้งแก้ไข
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">รหัสผ่านตรวจงาน</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              data-sensitive
              placeholder="••••••••"
              disabled={loading}
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            ) : null}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                กำลังตรวจสอบ...
              </>
            ) : (
              <>
                <Lock className="size-4" />
                เข้าสู่โหมดตรวจงาน
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
          <p className="flex items-center gap-2 font-medium text-foreground">
            <Eye className="size-3.5" />
            ลิงก์สำหรับส่งให้ลูกค้า
          </p>
          <p className="mt-2 break-all">{getPreviewAccessUrl("/")}</p>
        </div>
      </div>
    </div>
  );
}

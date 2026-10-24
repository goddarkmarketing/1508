"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { adminFetch, downloadBackup } from "@/lib/admin-api";

type BackupFile = {
  name: string;
  size: number;
  createdAt: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function BackupManager() {
  const [backups, setBackups] = useState<BackupFile[]>([]);
  const [creating, setCreating] = useState(false);
  const [busyName, setBusyName] = useState("");

  const reload = useCallback(async () => {
    const data = await adminFetch<{ backups: BackupFile[] }>("/backups");
    setBackups(data.backups);
  }, []);

  useEffect(() => {
    reload().catch((error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Could not load backups");
    });
  }, [reload]);

  async function create() {
    setCreating(true);
    try {
      await adminFetch("/backups", { method: "POST" });
      await reload();
      toast.success("สร้างแบ็คอัพแล้ว");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create the backup");
    } finally {
      setCreating(false);
    }
  }

  async function restore(name: string) {
    const confirmed = window.confirm(
      "กู้คืนข้อมูลจากแบ็คอัพนี้จะแทนที่ทัวร์ สถานที่ รูปแกลเลอรี วิดีโอ และคำขอใบเสนอราคาด้วยข้อมูลในไฟล์ บัญชีที่ล็อกอินอยู่จะยังใช้ได้",
    );
    if (!confirmed) return;
    setBusyName(name);
    try {
      await adminFetch(`/backups/${encodeURIComponent(name)}/restore`, { method: "POST" });
      toast.success("กู้คืนข้อมูลแล้ว");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Restore failed");
    } finally {
      setBusyName("");
    }
  }

  async function remove(name: string) {
    if (!window.confirm("ลบไฟล์แบ็คอัพนี้จากเซิร์ฟเวอร์?")) return;
    setBusyName(name);
    try {
      await adminFetch(`/backups/${encodeURIComponent(name)}`, { method: "DELETE" });
      await reload();
      toast.success("ลบแบ็คอัพแล้ว");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setBusyName("");
    }
  }

  return (
    <section className="rounded-2xl border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Backup</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            ไฟล์แบ็คอัพรวมทัวร์ สถานที่ แกลเลอรี วิดีโอ คำขอใบเสนอราคา บัญชีผู้ใช้ และรูปที่อัปโหลดไว้
            ดาวน์โหลดเก็บไว้ในเครื่องได้ ระบบเก็บบนเซิร์ฟเวอร์ไม่เกิน 20 ไฟล์ล่าสุด
          </p>
        </div>
        <Button type="button" onClick={create} disabled={creating}>
          {creating ? "กำลังสร้าง..." : "สร้างแบ็คอัพ"}
        </Button>
      </div>
      <div className="mt-4 space-y-2">
        {backups.length === 0 ? (
          <p className="text-sm text-muted-foreground">ยังไม่มีไฟล์แบ็คอัพ</p>
        ) : (
          backups.map((backup) => (
            <div
              key={backup.name}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border px-3 py-3"
            >
              <div>
                <p className="text-sm font-medium">{backup.name}</p>
                <p className="text-xs text-muted-foreground">
                  {backup.createdAt.replace("T", " ").replace("Z", " UTC")} · {formatSize(backup.size)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busyName === backup.name}
                  onClick={() => {
                    downloadBackup(backup.name).catch((error: unknown) => {
                      toast.error(error instanceof Error ? error.message : "Download failed");
                    });
                  }}
                >
                  ดาวน์โหลด
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busyName === backup.name}
                  onClick={() => restore(backup.name)}
                >
                  กู้คืน
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={busyName === backup.name}
                  onClick={() => remove(backup.name)}
                >
                  ลบ
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

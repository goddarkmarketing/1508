"use client";

import { useState } from "react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/admin-api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ImageField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [uploading, setUploading] = useState(false);

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      onChange(await uploadImage(file));
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder="/uploads/..."
      />
      <Input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onFile}
        disabled={disabled || uploading}
      />
    </div>
  );
}

export function linesToList(value: string) {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { FeedbackExportButtons } from "@/components/admin/feedback-export-buttons";
import { FeedbackStatusSelect } from "@/components/admin/feedback-status-select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  categoryLabels,
  priorityLabels,
} from "@/lib/feedback-export";
import { loadFeedback } from "@/lib/feedback-store";
import type {
  FeedbackCategory,
  FeedbackItem,
  FeedbackPriority,
  FeedbackStatus,
} from "@/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function priorityVariant(priority: FeedbackPriority) {
  if (priority === "high") return "destructive" as const;
  if (priority === "medium") return "default" as const;
  return "secondary" as const;
}

export default function AdminFeedbackPage() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [pageFilter, setPageFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<FeedbackCategory | "">("");
  const [priorityFilter, setPriorityFilter] = useState<FeedbackPriority | "">("");
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "">("");

  const refresh = useCallback(() => {
    setItems(loadFeedback());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const pages = useMemo(
    () => Array.from(new Set(items.map((item) => item.page))).sort(),
    [items],
  );

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (pageFilter && item.page !== pageFilter) return false;
      if (categoryFilter && item.category !== categoryFilter) return false;
      if (priorityFilter && item.priority !== priorityFilter) return false;
      if (statusFilter && item.status !== statusFilter) return false;
      return true;
    });
  }, [items, pageFilter, categoryFilter, priorityFilter, statusFilter]);

  return (
    <div data-feedback-id="feedback-admin">
      <PageHeader
        title="Website Feedback"
        description="รายการแก้ไขจากลูกค้าในโหมดตรวจงาน — Export เป็น JSON / Markdown / ZIP สำหรับ Cursor"
        actions={<FeedbackExportButtons items={filtered} />}
      />

      <div className="mb-6 grid gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
        <select
          className="h-10 rounded-lg border bg-background px-3 text-sm"
          value={pageFilter}
          onChange={(e) => setPageFilter(e.target.value)}
        >
          <option value="">ทุกหน้า</option>
          {pages.map((page) => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </select>
        <select
          className="h-10 rounded-lg border bg-background px-3 text-sm"
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value as FeedbackCategory | "")
          }
        >
          <option value="">ทุกประเภท</option>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          className="h-10 rounded-lg border bg-background px-3 text-sm"
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value as FeedbackPriority | "")
          }
        >
          <option value="">ทุกความสำคัญ</option>
          {Object.entries(priorityLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          className="h-10 rounded-lg border bg-background px-3 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as FeedbackStatus | "")}
        >
          <option value="">ทุกสถานะ</option>
          <option value="pending">pending</option>
          <option value="in-progress">in-progress</option>
          <option value="completed">completed</option>
          <option value="rejected">rejected</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="ยังไม่มี Feedback"
          description="ให้ลูกค้าเข้า /preview หรือลิงก์ ?preview= เพื่อแจ้งแก้ไขจากหน้าเว็บ"
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border bg-card lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>หมายเลข</TableHead>
                  <TableHead>ภาพ</TableHead>
                  <TableHead>หน้า / ส่วน</TableHead>
                  <TableHead>รายละเอียด</TableHead>
                  <TableHead>ประเภท</TableHead>
                  <TableHead>ความสำคัญ</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>วันที่</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>
                      {item.screenshot ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.screenshot}
                          alt={item.id}
                          className="h-16 w-24 rounded-md border object-cover"
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="max-w-[180px]">
                      <p className="line-clamp-2 text-sm font-medium">{item.page}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.section || item.feedbackId}
                      </p>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="line-clamp-3 text-sm">{item.comment}</p>
                      {item.customerName ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          โดย {item.customerName}
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell>{categoryLabels[item.category]}</TableCell>
                    <TableCell>
                      <Badge variant={priorityVariant(item.priority)}>
                        {priorityLabels[item.priority]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <FeedbackStatusSelect
                        id={item.id}
                        status={item.status}
                        onUpdated={refresh}
                      />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-4 lg:hidden">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border bg-card"
              >
                {item.screenshot ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.screenshot}
                    alt={item.id}
                    className="h-40 w-full object-cover object-top"
                  />
                ) : null}
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.id}</p>
                      <p className="text-xs text-muted-foreground">{item.page}</p>
                    </div>
                    <Badge variant={priorityVariant(item.priority)}>
                      {priorityLabels[item.priority]}
                    </Badge>
                  </div>
                  <p className="text-sm">{item.comment}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>{categoryLabels[item.category]}</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  <FeedbackStatusSelect
                    id={item.id}
                    status={item.status}
                    onUpdated={refresh}
                  />
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

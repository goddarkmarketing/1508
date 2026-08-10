import { NextResponse } from "next/server";
import { z } from "zod";
import { getInquiry, updateInquiryStatus } from "@/data/inquiries";
import { getSession } from "@/lib/auth";

const schema = z.object({
  status: z.enum(["new", "in-progress", "quoted", "closed"]),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = updateInquiryStatus(id, parsed.data.status);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: getInquiry(id) });
}

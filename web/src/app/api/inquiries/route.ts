import { NextResponse } from "next/server";
import { createInquiry, listInquiries } from "@/data/inquiries";
import { getSession } from "@/lib/auth";
import { inquirySchema } from "@/lib/validations";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ data: listInquiries() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const item = createInquiry({
      ...parsed.data,
      phone: parsed.data.phone || undefined,
      company: parsed.data.company || undefined,
      tourSlug: parsed.data.tourSlug || undefined,
      destinationSlug: parsed.data.destinationSlug || undefined,
      travelDate: parsed.data.travelDate || undefined,
      pax: parsed.data.pax || undefined,
    });

    return NextResponse.json({ data: item }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create inquiry" }, { status: 500 });
  }
}

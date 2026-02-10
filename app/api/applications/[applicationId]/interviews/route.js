import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET /api/applications/[applicationId]/interviews?userId=<email>
export async function GET(request, { params }) {
  const { applicationId } = params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "userId is required" },
      { status: 400 }
    );
  }

  const result = await db
    .select()
    .from(MockInterview)
    .where(
      and(
        eq(MockInterview.applicationId, Number(applicationId)),
        eq(MockInterview.createdBy, userId)
      )
    )
    .orderBy(MockInterview.id);

  return NextResponse.json({ success: true, data: result });
}

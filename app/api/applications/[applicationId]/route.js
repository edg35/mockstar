import { db } from "@/utils/db";
import { JobApplications } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET /api/applications/[applicationId]?userId=<userId>
export async function GET(request, { params }) {
  const { applicationId } = params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const result = await db
      .select()
      .from(JobApplications)
      .where(
        and(
          eq(JobApplications.id, Number(applicationId)),
          eq(JobApplications.userId, userId)
        )
      );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/applications/[applicationId]
export async function PUT(request, { params }) {
  const { applicationId } = params;
  const { userId, ...data } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const result = await db
      .update(JobApplications)
      .set({
        ...data,
        dateUpdated: new Date(),
      })
      .where(
        and(
          eq(JobApplications.id, Number(applicationId)),
          eq(JobApplications.userId, userId)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/applications/[applicationId]
export async function DELETE(request, { params }) {
  const { applicationId } = params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const result = await db
      .delete(JobApplications)
      .where(
        and(
          eq(JobApplications.id, Number(applicationId)),
          eq(JobApplications.userId, userId)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

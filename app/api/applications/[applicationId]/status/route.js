import { db } from "@/utils/db";
import { JobApplications, ActivityLog } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

// PUT /api/applications/[applicationId]/status
export async function PUT(request, { params }) {
  const { applicationId } = params;
  const { userId, status } = await request.json();

  if (!userId || !status) {
    return NextResponse.json(
      { error: "userId and status are required" },
      { status: 400 }
    );
  }

  try {
    const result = await db
      .update(JobApplications)
      .set({
        applicationStatus: status,
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

    await db.insert(ActivityLog).values({
      userId,
      applicationId: Number(applicationId),
      activityType: "status_change",
      description: `Status changed to ${status}`,
    });

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

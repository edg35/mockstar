import { db } from "@/utils/db";
import { JobApplications } from "@/utils/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET /api/applications/stats?userId=<userId>
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [statusCounts, weekCount, monthCount] = await Promise.all([
      db
        .select({
          status: JobApplications.applicationStatus,
          count: sql`count(*)`.mapWith(Number),
        })
        .from(JobApplications)
        .where(eq(JobApplications.userId, userId))
        .groupBy(JobApplications.applicationStatus),

      db
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(JobApplications)
        .where(
          and(
            eq(JobApplications.userId, userId),
            gte(JobApplications.dateAdded, startOfWeek)
          )
        ),

      db
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(JobApplications)
        .where(
          and(
            eq(JobApplications.userId, userId),
            gte(JobApplications.dateAdded, startOfMonth)
          )
        ),
    ]);

    const byStatus = {};
    let total = 0;
    for (const row of statusCounts) {
      byStatus[row.status] = row.count;
      total += row.count;
    }

    return NextResponse.json({
      success: true,
      data: {
        total,
        byStatus,
        thisWeek: weekCount[0].count,
        thisMonth: monthCount[0].count,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

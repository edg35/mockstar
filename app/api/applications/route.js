import { db } from "@/utils/db";
import { JobApplications, ActivityLog } from "@/utils/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET /api/applications?userId=<userId>&status=<status>&dateFrom=<date>&dateTo=<date>
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const conditions = [eq(JobApplications.userId, userId)];

  const status = searchParams.get("status");
  if (status) {
    conditions.push(eq(JobApplications.applicationStatus, status));
  }

  const dateFrom = searchParams.get("dateFrom");
  if (dateFrom) {
    conditions.push(gte(JobApplications.dateAdded, new Date(dateFrom)));
  }

  const dateTo = searchParams.get("dateTo");
  if (dateTo) {
    conditions.push(lte(JobApplications.dateAdded, new Date(dateTo)));
  }

  try {
    const result = await db
      .select()
      .from(JobApplications)
      .where(and(...conditions))
      .orderBy(desc(JobApplications.dateAdded));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/applications
export async function POST(request) {
  const { userId, ...data } = await request.json();

  if (!userId || !data.companyName || !data.jobTitle) {
    return NextResponse.json(
      { error: "userId, companyName, and jobTitle are required" },
      { status: 400 }
    );
  }

  try {
    const result = await db
      .insert(JobApplications)
      .values({
        userId,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription || null,
        jobUrl: data.jobUrl || null,
        location: data.location || null,
        salary: data.salary || null,
        applicationStatus: data.applicationStatus || "wishlist",
        dateApplied: data.dateApplied ? new Date(data.dateApplied) : null,
        notes: data.notes || null,
        priority: data.priority || null,
        contactPerson: data.contactPerson || null,
        contactEmail: data.contactEmail || null,
      })
      .returning();

    await db.insert(ActivityLog).values({
      userId,
      applicationId: result[0].id,
      activityType: "created",
      description: `Application created for ${data.jobTitle} at ${data.companyName}`,
    });

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

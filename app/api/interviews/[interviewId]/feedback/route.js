import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET /api/interviews/[interviewId]/feedback
export async function GET(request, { params }) {
  const { interviewId } = params;

  const feedback = await db
    .select()
    .from(UserAnswer)
    .where(eq(UserAnswer.mockId, interviewId))
    .orderBy(UserAnswer.id);

  const feedbackScore = feedback.reduce(
    (total, item) => total + Number(item.rating),
    0
  );

  return NextResponse.json({ feedbackList: feedback, score: feedbackScore });
}

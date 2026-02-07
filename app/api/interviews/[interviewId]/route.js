import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET /api/interviews/[interviewId]
export async function GET(request, { params }) {
  const { interviewId } = params;

  const result = await db
    .select()
    .from(MockInterview)
    .where(eq(MockInterview.mockId, interviewId));

  if (!result.length) {
    return NextResponse.json(
      { error: "Interview not found" },
      { status: 404 }
    );
  }

  const jsonMockRes = JSON.parse(result[0].jsonMockRes);

  return NextResponse.json({
    mockInterviewQuestion: jsonMockRes,
    interviewData: result[0],
  });
}

// DELETE /api/interviews/[interviewId]
export async function DELETE(request, { params }) {
  const { interviewId } = params;

  const deleteInterview = await db
    .delete(MockInterview)
    .where(eq(MockInterview.mockId, interviewId));

  const deleteFeedback = await db
    .delete(UserAnswer)
    .where(eq(UserAnswer.mockId, interviewId));

  return NextResponse.json({
    interview: deleteInterview,
    feedback: deleteFeedback,
  });
}

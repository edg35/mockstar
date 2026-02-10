import { db } from "@/utils/db";
import { chatSession } from "@/utils/geminiaimodel";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import moment from "moment";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// GET /api/interviews?email=<userEmail>
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const result = await db
    .select()
    .from(MockInterview)
    .where(eq(MockInterview.createdBy, email))
    .orderBy(MockInterview.id);

  return NextResponse.json(result);
}

// POST /api/interviews
export async function POST(request) {
  const { jobPosition, jobDescription, yearsOfExperience, userEmail, applicationId } =
    await request.json();

  if (!applicationId) {
    return NextResponse.json(
      { error: "applicationId is required" },
      { status: 400 }
    );
  }

  const InputPrompt =
    "Job Position: " +
    jobPosition +
    ", Job Description: " +
    jobDescription +
    ", Years Experience: " +
    yearsOfExperience +
    ". From this information, can you give me " +
    process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
    " interview questions and answers in json format. Give question and answer as fields in json";

  const result = await chatSession.sendMessage(InputPrompt);

  const mockJsonRes = result.response
    .text()
    .replace("```json", "")
    .replace("```", "");

  if (!mockJsonRes) {
    return NextResponse.json(
      { error: "Failed to generate interview questions" },
      { status: 500 }
    );
  }

  try {
    const dbRes = await db
      .insert(MockInterview)
      .values({
        mockId: uuidv4(),
        jsonMockRes: mockJsonRes,
        jobPosition,
        jobDescription,
        jobExperience: yearsOfExperience,
        createdBy: userEmail,
        createdAt: moment().format("DD-MM-YYYY"),
        applicationId,
      })
      .returning({ mockId: MockInterview.mockId });

    return NextResponse.json(dbRes);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

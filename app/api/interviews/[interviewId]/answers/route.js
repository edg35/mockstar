import { db } from "@/utils/db";
import { chatSession } from "@/utils/geminiaimodel";
import { UserAnswer } from "@/utils/schema";
import moment from "moment";
import { NextResponse } from "next/server";

// POST /api/interviews/[interviewId]/answers
export async function POST(request, { params }) {
  const { interviewId } = params;
  const { question, correctAnswer, userAnswer, userEmail } =
    await request.json();

  const feedbackPrompt =
    "Question:" +
    question +
    ", Answer:" +
    userAnswer +
    ", From the user answer for the given interview question " +
    "please give me a rating for answer quality (on a scale of 1 - 10, 1 being not good and 10 being perfect) and feedback for areas of improvement (just 3-5 lines) if any.  Please return this in json format with rating field and feedback field.";

  const result = await chatSession.sendMessage(feedbackPrompt);
  const mockJsonRes = result.response
    .text()
    .replace("```json", "")
    .replace("```", "");
  const jsonFeedbackRes = JSON.parse(mockJsonRes);

  const storeAnswer = await db.insert(UserAnswer).values({
    mockId: interviewId,
    question,
    correctAnswer,
    userAnswer,
    rating: String(jsonFeedbackRes.rating),
    feedback: jsonFeedbackRes.feedback,
    userEmail,
    createdAt: moment().format("DD-MM-YYYY"),
  });

  return NextResponse.json({
    rating: jsonFeedbackRes.rating,
    feedback: jsonFeedbackRes.feedback,
    success: true,
  });
}

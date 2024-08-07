"use server";
import { db } from "@/utils/db";
import { chatSession } from "@/utils/geminiaimodel";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

export async function createNewInterview(formData, userEmail) {
  const { jobPosition, jobDescription, yearsOfExperience } = formData;

  const InputPrompt =
    "Job Position: " +
    jobPosition +
    ", Job Description: " +
    jobDescription +
    ", Years Experience: " +
    yearsOfExperience +
    ". From this information, can you give me " +
    process.env.INTERVIEW_QUESTION_COUNT +
    " interview questions and answers in json format. Give question and answer as fields in json";

  const result = await chatSession.sendMessage(InputPrompt);

  const mockJsonRes = result.response
    .text()
    .replace("```json", "")
    .replace("```", "");

  if (mockJsonRes) {
    try {
      const dbRes = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockRes: mockJsonRes,
          jobPosition: jobPosition,
          jobDescription: jobDescription,
          jobExperience: yearsOfExperience,
          createdBy: userEmail,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: MockInterview.mockId });

      return dbRes;
    } catch (err) {
      return { error: err };
    }
  }
}

export async function deleteInterviewAPI(interviewId) {
  const deleteInterview = await db
    .delete(MockInterview)
    .where(eq(MockInterview.mockId, interviewId));

  const deleteFeedback = await db
    .delete(UserAnswer)
    .where(eq(UserAnswer.mockId, interviewId));

  return { interview: deleteInterview, feedback: deleteFeedback };
}

export async function getInterviewDetails(interviewId) {
  const result = await db
    .select()
    .from(MockInterview)
    .where(eq(MockInterview.mockId, interviewId));

  const jsonMockRes = JSON.parse(result[0].jsonMockRes);

  return { mockInterviewQuestion: jsonMockRes, interviewData: result[0] };
}

export async function fetchFeedback(interviewId) {
  const feedback = await db
    .select()
    .from(UserAnswer)
    .where(eq(UserAnswer.mockId, interviewId))
    .orderBy(UserAnswer.id);

  const feedbackScore = feedback.reduce(
    (total, item) => total + Number(item.rating),
    0
  );

  return { feedbackList: feedback, score: feedbackScore };
}
export async function getInterviewFeedback(interviewId) {
  const feedback = await db
    .select()
    .from(UserAnswer)
    .where(eq(UserAnswer.mockId, interviewId))
    .orderBy(UserAnswer.id);

  const feedbackScore = feedback.reduce(
    (total, item) => total + Number(item.rating),
    0
  );

  return { feedbackList: feedback, score: feedbackScore };
}

export async function getInterviewListAPI(userEmail) {
  const result = await db
    .select()
    .from(MockInterview)
    .where(eq(MockInterview.createdBy, userEmail))
    .orderBy(MockInterview.id);

  return result;
}

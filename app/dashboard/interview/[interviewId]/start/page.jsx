"use client"
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { useEffect, useState } from "react";
import QuestionSection from "./_components/questionSection";
import RecordAnswerSection from "./_components/recordAnswerSecton";

function InterviewStart({params}) {

    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
    const [activeQuestion, setActiveQuestion] = useState(0);

    useEffect(() => {
        getInterviewDetails();
    }, []);

    /**
   * Get interview details by mockid/interview id
   */
  const getInterviewDetails = async() => {
    const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId));
    const jsonMockRes = JSON.parse(result[0].jsonMockRes);
    setMockInterviewQuestion(jsonMockRes);
    setInterviewData(result[0]);
  }

  return mockInterviewQuestion&&(
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Questions */}
        <div>
            <QuestionSection 
                mockInterviewQuestion={mockInterviewQuestion} 
                activeQuestion={activeQuestion} 
            />
        </div>
        {/* Video and audio recording section */}
        <div>
            <RecordAnswerSection
                mockInterviewQuestion={mockInterviewQuestion}
                activeQuestion={activeQuestion}
                interviewData={interviewData}
            />
        </div>
      </div>
        <div className="flex justify-end gap-6">
            {activeQuestion != 0&&<Button
                onClick={() => setActiveQuestion(activeQuestion - 1)}
            >
                Previous Question
            </Button>}
            {activeQuestion != mockInterviewQuestion.length - 1&&<Button
                onClick={() => setActiveQuestion(activeQuestion + 1)}
            >
                Next Question
            </Button>}
            {activeQuestion === mockInterviewQuestion.length - 1&&<Link href={"/dashboard/interview/"+params.interviewId+"/feedback"}><Button className="bg-green-500">End Interview</Button></Link>}
        </div>
    </div>
  )
}

export default InterviewStart

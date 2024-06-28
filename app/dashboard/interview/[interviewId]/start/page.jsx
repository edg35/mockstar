"use client"
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
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
    console.log(jsonMockRes);
    setMockInterviewQuestion(jsonMockRes);
    setInterviewData(result[0]);
  }

  return (
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
            />
        </div>
      </div>
    </div>
  )
}

export default InterviewStart

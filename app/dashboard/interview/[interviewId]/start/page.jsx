"use client";
import { getInterviewDetails } from "@/app/_actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import QuestionSection from "./_components/questionSection";
import RecordAnswerSection from "./_components/recordAnswerSecton";

function InterviewStart({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [activeQuestion, setActiveQuestion] = useState(0);

  const fetchInterviewDetails = async () => {
    const interviewDetails = await getInterviewDetails(params.interviewId);
    setMockInterviewQuestion(interviewDetails.mockInterviewQuestion);
    setInterviewData(interviewDetails.interviewData);
  };

  useEffect(() => {
    fetchInterviewDetails();
  }, [params.interviewId]);

  return (
    mockInterviewQuestion && (
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
          {activeQuestion != 0 && (
            <Button onClick={() => setActiveQuestion(activeQuestion - 1)}>
              Previous Question
            </Button>
          )}
          {activeQuestion != mockInterviewQuestion.length - 1 && (
            <Button onClick={() => setActiveQuestion(activeQuestion + 1)}>
              Next Question
            </Button>
          )}
          {activeQuestion === mockInterviewQuestion.length - 1 && (
            <Link
              href={"/dashboard/interview/" + params.interviewId + "/feedback"}
            >
              <Button className="bg-green-500">End Interview</Button>
            </Link>
          )}
        </div>
      </div>
    )
  );
}

export default InterviewStart;

"use client";

import { fetchFeedback } from "@/app/_actions";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function feedbackPage({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    getFeedback();
  }, []);

  const getFeedback = async () => {
    const feedback = await fetchFeedback(params.interviewId);
    setFeedbackList(feedback.feedbackList);
    setScore(feedback.score);
  };

  return (
    <div className="p-10">
      {feedbackList?.length == 0 ? (
        <h2 className="text-3xl font-semibold text-red-500">
          No feedback available
        </h2>
      ) : (
        <>
          <h2 className="text-3xl font-semibold text-green-500">
            Congratulations!
          </h2>
          <h2 className="font-semibold text-2xl">
            Here is your interview feedback
          </h2>
          <h2 className="text-primary text-lg my-3">
            Your overall interview rating:{" "}
            <strong>
              {score} / {feedbackList.length * 10}
            </strong>
          </h2>

          <h2 className="text-sm text-gray-500">
            Below is your feedback on your answers
          </h2>
          {feedbackList &&
            feedbackList.map((item, index) => (
              <Collapsible key={index} className="mt-7">
                <CollapsibleTrigger className="flex justify-between gap-5 p-2 bg-secondary rounded-lg my-2 text-left w-full">
                  {item.question}
                  <ChevronsUpDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-2">
                    <h2 className="p-2 border rounded-lg">
                      Rating: <strong>{item.rating}</strong>
                    </h2>
                    <h2 className="p-2 border rounded-lg text-sm">
                      <strong>Your Answer: </strong>
                      {item.userAnswer}
                    </h2>
                    <h2 className="p-2 border rounded-lg text-sm bg-green-50 text-green-900">
                      <strong>Preferred Answer: </strong>
                      {item.correctAnswer}
                    </h2>
                    <h2 className="p-2 border rounded-lg text-sm bg-blue-50 text-blue-900">
                      <strong>Feedback: </strong>
                      {item.feedback}
                    </h2>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
        </>
      )}
      <Link href="/dashboard">
        <Button className="mt-5">Return to Dashboard</Button>
      </Link>
    </div>
  );
}

export default feedbackPage;

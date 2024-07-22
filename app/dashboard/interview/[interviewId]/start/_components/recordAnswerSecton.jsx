"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/utils/db";
import { chatSession } from "@/utils/geminiaimodel";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { Mic } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import Webcam from "react-webcam";

function RecordAnswerSection({
  mockInterviewQuestion,
  activeQuestion,
  interviewData,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.map((result) => {
      setUserAnswer((prevAns) => prevAns + result?.transcript);
    });
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      updateUserAnswer();
    }
  }, [userAnswer]);

  /**
   * Toggle the users mircophone for recording answers
   */
  const saveUserAnswer = async () => {
    // Save user answer to the database
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const updateUserAnswer = async () => {
    // Update user answer to the database
    setLoading(true);
    const feedbackPrompt =
      "Question:" +
      mockInterviewQuestion[activeQuestion]?.question +
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
      mockId: interviewData?.mockId,
      question: mockInterviewQuestion[activeQuestion]?.question,
      correctAnswer: mockInterviewQuestion[activeQuestion]?.answer,
      userAnswer: userAnswer,
      rating: jsonFeedbackRes.rating,
      feedback: jsonFeedbackRes.feedback,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format("DD-MM-YYYY"),
    });

    if (storeAnswer) {
      toast({
        title: "Success!",
        description: "Your answer has been recorded successfully.",
      });
    }
    setResults([]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col mt-20 justify-center items-center bg-secondary rounded-lg p-5">
        <Image
          src={"/webcam.png"}
          width={200}
          height={200}
          className="absolute"
          atl="webcam image"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button
        disabled={loading}
        className="my-10"
        variant="outline"
        onClick={saveUserAnswer}
      >
        {isRecording ? (
          <h2 className="flex gap-2 text-red-400">
            <Mic />
            Stop Recording
          </h2>
        ) : (
          "Record Answer"
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;

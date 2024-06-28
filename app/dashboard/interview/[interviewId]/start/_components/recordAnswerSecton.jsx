"use client"

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { chatSession } from "@/utils/geminiaimodel";
import { Mic } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSpeechToText from 'react-hook-speech-to-text';
import Webcam from "react-webcam";

function RecordAnswerSection({mockInterviewQuestion, activeQuestion}) {
    const [userAnswer, setUserAnswer] = useState('');
    const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(() => {
    results.map((result) => {
        setUserAnswer(prevAns => prevAns + result?.transcript);
    })
  },[results]);

  const saveUserAnswer = async() => {
    // Save user answer to the database
    if (isRecording) {
        stopSpeechToText();
        if(userAnswer?.length < 10) {
          toast({
            title: "Uh oh! Something went wrong.",
            description: "Please try to record a longer response.",
          });
          return;
        }

        // Save user answer to the database
        const feedbackPrompt = "Question:" + mockInterviewQuestion[activeQuestion]?.question + ", Answer:" + userAnswer + ", From the user answer for the given interview question " +
        "please give me a rating for answer quality (on a scale of 1 - 10, 1 being not good and 10 being perfect) and feedback for areas of improvement (just 3-5 lines) if any.  Please return this in json format with rating field and feedback field.";

        const result = await chatSession.sendMessage(feedbackPrompt);
        const mockJsonRes = (result.response.text()).replace('```json','').replace('```', '');
        const jsonFeedbackRes = JSON.parse(mockJsonRes);
        
    } else {
      startSpeechToText();
    }


  }


  return (
    <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col mt-20 justify-center items-center bg-secondary rounded-lg p-5">
        <Image src={'/webcam.png'} width={200} height={200} className="absolute" />
        <Webcam 
            mirrored={true}
            style={{
                height:300,
                width:'100%',
                zIndex:10,
            }}
        />

        </div>
        <Button 
            className="my-10" 
            variant="outline" 
            onClick={saveUserAnswer}
        >
            {isRecording ? <h2 className="flex gap-2 text-red-400"><Mic />Stop Recording</h2> : 'Record Answer'}
        </Button>
        <ul>
            {results.map((result) => (
            <li key={result.timestamp}>{result.transcript}</li>
            ))}
            {interimResult && <li>{interimResult}</li>}
        </ul>
    </div>
  )
}

export default RecordAnswerSection

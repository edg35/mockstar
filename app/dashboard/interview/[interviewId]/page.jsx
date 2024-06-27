"use client"
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({params}) {

  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    getInterviewDetails();
  },[]);

  /**
   * Get interview details by mockid/interview id
   */
  const getInterviewDetails = async() => {
    const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId))
    setInterviewData(result[0]);
  }

  return (
    <div className="my-10">
      <h2 className="font-semibold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {interviewData ? (
          <div className="flex flex-col my-5 gap-5">
            <div className="flex flex-col p-5 rounded-lg border gap-5">
              <h2 className="text-lg"><strong>Job Position: </strong>{interviewData.jobPosition}</h2>
              <h2 className="text-lg"><strong>Job Description: </strong>{interviewData.jobDescription}</h2>
              <h2 className="text-lg"><strong>Years of Experience: </strong>{interviewData.jobExperience}</h2>
            </div>
            <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
              <h2 className="flex gap-2 items-center"><Lightbulb /><strong>Information</strong></h2>
              <h2 className="mt-3">Enable Video Web Cam and Microphone to start your AI generated mock interview. it has {process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} questions
                which you can answer and recieve a report on the basis of your answer. NOTE: we never record your video. Web cam access can be disabled at any time.
              </h2>
            </div>
          </div>
        ) : (
          <p>Loading interview details...</p>
        )}
        <div>
          {webCamEnabled ? <>
              <Webcam 
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                mirrored={true}
                style={{
                  height:300,
                  width:300,
                }}
              />
              <Button variant="ghost" className="w-full text-center" onClick={() => setWebCamEnabled(false)}>Disable Webcam and Audio</Button>
            </>
            :
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <Button variant="ghost" className="w-full text-center" onClick={() => setWebCamEnabled(true)}>Enable Webcam and Audio</Button>
            </>
          }
        </div>
      </div>
      <div className="flex justify-end items-end">
        <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
          <Button >Start Interview</Button>
        </Link>
      </div>
    </div>
  )
}

export default Interview

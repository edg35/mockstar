"use client"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/utils/db";
import { chatSession } from "@/utils/geminiaimodel";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { LoaderCircle } from "lucide-react";
import moment from "moment";
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [yearsOfExperience, setYearsOfExperience] = useState(0);
    const [loading, setLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState([]);
    const {user} = useUser();

    const onSubmit = async(e) => {
        setLoading(true);
        e.preventDefault();

        const InputPrompt = "Job Position: " + jobPosition + ", Job Description: " + jobDescription + ", Years Experience: " + yearsOfExperience + ". From this information, can you give me " + process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT + " interview questions and answers in json format. Give question and answer as fields in json";
        const result = await chatSession.sendMessage(InputPrompt);
        const mockJsonRes = (result.response.text()).replace('```json','').replace('```', '');
        setJsonResponse(mockJsonRes);
        
        if(mockJsonRes) {
            const dbRes = await db.insert(MockInterview).values({
                mockId: uuidv4(),
                jsonMockRes: mockJsonRes,
                jobPosition: jobPosition,
                jobDescription: jobDescription,
                jobExperience: yearsOfExperience,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-YYYY'),
            }).returning({mockId:MockInterview.mockId});

            console.log("inserted:", dbRes);
            if(dbRes) {
                setOpenDialog(false);
            }
        } else {
            console.log("Error in getting response");
        }

        setLoading(false);
    }

  return (
    <div>
      <div className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-sm transition-all" onClick={() => setOpenDialog(true)}>
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-xl">
            <DialogHeader>
            <DialogTitle className="text-2xl">Tell us more about your job interview</DialogTitle>
            <DialogDescription>
                <form onSubmit={onSubmit}>
                <div>
                    <h2 className="text-gray-500">Add details about your job position, description, and years of experience</h2>
                    <div className="mt-7 my-2">
                        <label>Job Position</label>
                        <Input placeholder="Ex. Full Stack Developer" required onChange={(event) => setJobPosition(event.target.value)} />
                    </div>
                    <div className="my-2">
                        <label>Job Descriptionn</label>
                        <Textarea placeholder="Ex. React, Angular, NodeJs" required onChange={(event) => setJobDescription(event.target.value)}/>
                    </div>
                    <div className="my-2">
                        <label>Years of Experience</label>
                        <Input placeholder="Ex. 5" type="number" max="100" required onChange={(event) => setYearsOfExperience(event.target.value)}/>
                    </div>
                </div>
                <div className="flex gap-5 justify-end my-5">
                    <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancle</Button>
                    <Button type="submit" disabled={loading}>
                    {loading ? 
                        <>
                            <LoaderCircle className="animate-spin"/> Generating
                        </>: 'Start Interview'
                    }
                    </Button>
                </div>
                </form>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>
    </div>
  )
}

export default AddNewInterview

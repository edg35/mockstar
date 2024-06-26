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
import { useState } from 'react';

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [yearsOfExperience, setYearsOfExperience] = useState(0);

    const onSubmit = (e) => {
        e.preventDefault();
        console.log("Job Position: ", jobPosition);
        console.log("Job Description: ", jobDescription);
        console.log("Years of Experience: ", yearsOfExperience);
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
                    <Button type="submit">Start Interview</Button>
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

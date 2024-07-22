"use client";
import { createNewInterview } from "@/app/_actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function AddNewInterview() {
  // Declare state variables

  const initialFormState = {
    jobPosition: "",
    jobDescription: "",
    yearsOfExperience: 0,
  };
  const [formState, setFormState] = useState(initialFormState);
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast;
  const { user } = useUser();
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  /**
   * handle creaton of a new interview in system
   * @param {*} e
   * @return null
   */

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    // Fill in AI prompt user information provided, then send prompt message
    const createdInterview = await createNewInterview(
      formState,
      user?.primaryEmailAddress?.emailAddress
    );

    if (createdInterview) {
      setOpenDialog(false);
      console.log(createdInterview);
      router.push("/dashboard/interview/" + createdInterview[0]?.mockId);
    } else {
      toast({
        title: "Error",
        description: "An error occurred while creating interview",
        status: "error",
      });
    }

    // close the dialog
    setLoading(false);
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-sm transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2 className="text-gray-500">
                    Add details about your job position, description, and years
                    of experience
                  </h2>
                  <div className="mt-7 my-2">
                    <label>Job Position</label>
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      name="jobPosition"
                      id="jobPosition"
                      value={formState.jobPosition}
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="my-2">
                    <label>Job Description</label>
                    <Textarea
                      placeholder="Ex. React, Angular, NodeJs"
                      name="jobDescription"
                      id="jobDescription"
                      value={formState.jobDescription}
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="my-2">
                    <label>Years of Experience</label>
                    <Input
                      placeholder="Ex. 5"
                      name="yearsOfExperience"
                      id="yearsOfExperience"
                      type="number"
                      value={formState.yearsOfExperience}
                      max="100"
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex gap-5 justify-end my-5">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancle
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" /> Generating
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;

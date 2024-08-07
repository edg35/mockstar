import { deleteInterviewAPI } from "@/app/_actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";

import Link from "next/link";

function InterviewItemCard({ interview }) {
  const { toast } = useToast();

  const deleteInterview = async () => {
    const removed = await deleteInterviewAPI(interview?.mockId);

    if (removed) {
      window.location.reload();
      toast({
        title: "Interview Deleted",
        description: "Your interview has been successfully deleted",
        status: "success",
      });
    } else {
      toast({
        title: "Error",
        description: "An error occurred while deleting the interview",
        status: "error",
      });
    }
  };

  return (
    <div className="border shadow-sm rounded-lg p-2 px-5">
      <div className="flex flex-row justify-between">
        <div>
          <h2 className="font-semibold text-primary">
            {interview?.jobPosition}
          </h2>
          <h2 className="text-sm text-gray-500">
            {interview?.jobExperience} years of experience
          </h2>
          <h2 className="text-sm text-gray-500">{interview?.createdAt}</h2>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-500 transition-all"
            >
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                interview and remove your data from our database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-400"
                onClick={deleteInterview}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="flex justify-between mt-3 mb-2 gap-5">
        <Link
          href={`/dashboard/interview/${interview?.mockId}/feedback`}
          className="w-full"
        >
          <Button size="sm" variant="outline" className="w-full">
            Feedback
          </Button>
        </Link>
        <Link
          href={`/dashboard/interview/${interview?.mockId}`}
          className="w-full"
        >
          <Button size="sm" className="w-full">
            Start
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InterviewItemCard;

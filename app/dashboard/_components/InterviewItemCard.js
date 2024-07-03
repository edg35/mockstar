import { Button } from "@/components/ui/button";
import Link from "next/link";

function InterviewItemCard({ interview }) {
  return (
    <div className="border shadow-sm rounded-lg p-2 px-5">
      <h2 className="font-semibold text-primary">{interview?.jobPosition}</h2>
      <h2 className="text-sm text-gray-500">
        {interview?.jobExperience} years of experience
      </h2>
      <h2 className="text-sm text-gray-500">{interview?.createdAt}</h2>
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

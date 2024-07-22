"use client";

import { getInterviewListAPI } from "@/app/_actions";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";
import { SkeletonCard } from "./SkeletonCard";

function InterviewList() {
  // Get user info from clerk and initialize state variables
  const { user } = useUser();
  const [InterviewList, setInterviewList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Call use when user loads in order to get list of previous interviews
  useEffect(() => {
    user && getInterviewList();
  }, [user]);

  /**
   * getInterviewList callback function
   * @param {user, db}
   * @return null
   */

  const getInterviewList = async () => {
    // Get user interview information from database
    const result = await getInterviewListAPI(
      user?.primaryEmailAddress?.emailAddress
    );

    // Save results in state
    setInterviewList(result);
    setIsLoading(false);
  };

  return (
    <div>
      <h2 className="font-medium text-xl ">Previous Mock Interviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
        {isLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
        {InterviewList &&
          InterviewList.map((interview, index) => (
            <InterviewItemCard key={index} interview={interview} />
          ))}
      </div>
    </div>
  );
}

export default InterviewList;

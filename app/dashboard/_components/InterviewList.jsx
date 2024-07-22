"use client";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";

function InterviewList() {
  // Get user info from clerk and initialize state variables
  const { user } = useUser();
  const [InterviewList, setInterviewList] = useState([]);

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
    const result = await db
      .select()
      .from(MockInterview)
      .where(
        eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress)
      )
      .orderBy(desc(MockInterview.id));

    // Save results in state
    setInterviewList(result);
  };

  return (
    <div>
      <h2 className="font-medium text-xl ">Previous Mock Interviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
        {InterviewList &&
          InterviewList.map((interview, index) => (
            <InterviewItemCard key={index} interview={interview} />
          ))}
      </div>
    </div>
  );
}

export default InterviewList;

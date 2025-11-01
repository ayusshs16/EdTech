import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import React from "react";
import TopicPills from "@/components/ui/topicPills";

function CourseIntroCard({ course }) {
  return (
    <div className="flex gap-5 items-center p-10 border shadow-md rounded-lg">
      <Image src={"/knowledge.png"} alt="knowledge" width={70} height={70} />
      <div>
        <h2 className="font-bold text-2xl">
          {course?.courseLayout?.courseTitle}
        </h2>
        <p>{course?.courseLayout?.courseSummary}</p>
        <Progress className="mt-3" />

        <h2 className="mt-3 text-lg text-primary">
          Total Chapters: {course?.courseLayout?.chapters?.length}
        </h2>
        {/* Topics display */}
        {course?.courseLayout && (
          <div>
            <h3 className="font-semibold mt-3">Topics</h3>
            <TopicPills topics={course?.courseLayout?.topics || []} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseIntroCard;

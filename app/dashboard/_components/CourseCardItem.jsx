"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import TopicPills from "@/components/ui/topicPills";

function CourseCardItem({ course, onDelete }) {
  const [showTopics, setShowTopics] = useState(false);

  const extractTopics = () => {
    const layout = course?.courseLayout || {};
    if (Array.isArray(layout.topics)) return layout.topics;
    if (Array.isArray(layout.chapters)) {
      // chapters may have topics arrays
      return layout.chapters.flatMap((c) => c.topics || []);
    }
    return [];
  };
  return (
    <div className="border rounded-lg shadow-md p-5">
      <div>
        <div className="flex  justify-between items-center">
          <Image src={"/knowledge.png"} alt="other" width={50} height={50} />
          <h2 className="text-[10px] p-1 px-2 rounded-full bg-blue-600 text-white">
            {course?.status}
          </h2>
        </div>
        <h2 className="mt-3 font-medium text-lg">
          {course?.courseLayout?.courseTitle}
        </h2>
        <p className="text-sm line-clamp-2 text-gray-500 mt-3">
          {course?.courseLayout?.courseSummary}
        </p>

        <div className="mt-4">
          <Progress value={0} />
        </div>

        <div className="mt-6 flex justify-end items-baseline">
          {course?.status == "Generating" ? (
            <Button disabled>Generating</Button>
          ) : (
            <>
              <Button onClick={() => setShowTopics((s) => !s)} className="mr-2">
                {showTopics ? "Hide Topics" : "Topics"}
              </Button>
              <Link href={"/course/" + course?.courseId}>
                <Button className="mr-2">View</Button>
              </Link>
              {onDelete && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Delete this locally saved course? This cannot be undone.")) {
                      onDelete();
                    }
                  }}
                >
                  Delete
                </Button>
              )}
            </>
          )}
        </div>
        {showTopics && (
          <div className="mt-4">
            <h3 className="font-semibold">Topics</h3>
            {extractTopics().length > 0 ? (
              <TopicPills topics={extractTopics()} />
            ) : (
              <p className="text-gray-500 mt-2">No topics available yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseCardItem;

import React from "react";
import TopicPills from "@/components/ui/topicPills";

function ChapterList({ course }) {
  const CHAPTERS = course?.courseLayout?.chapters;
  return (
    <div className="mt-5">
      <h2 className="font-medium text-xl">Chapters</h2>
      <div className="mt-3">
        {CHAPTERS?.map((chapter, index) => (
          <div
            className="flex gap-5 items-center p-4 border shadow-md mb-2 rounded-lg cursor-pointer hover:scale-[1.01] transition-transform"
            key={chapter?.chapterId || index}
          >
            <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200">
              {chapter?.emoji || "📄"}
            </div>
            <div>
              <h2 className="font-medium">{chapter?.chapterTitle}</h2>
              <p className="text-gray-400 text-sm">{chapter?.chapterSummary}</p>
              {chapter?.topics && <TopicPills topics={chapter.topics} size="sm" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterList;

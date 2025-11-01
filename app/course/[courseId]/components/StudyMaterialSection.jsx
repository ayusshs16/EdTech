// StudyMaterialSection.jsx
import React, { useEffect, useState } from "react";
import MaterialCardItem from "./MaterialCardItem"; // Make sure this path is correct

const StudyMaterialSection = ({ courseId, course }) => {
  const [studyTypeContent, setStudyTypeContent] = useState();

  const MaterialList = [
    {
      name: "Notes/Chapters",
      desc: "Read notes to prepare",
      icon: "/notes.png",
      path: "/notes",
      type: "notes",
    },
    {
      name: "Flashcard",
      desc: "Flashcards help to remember the concepts",
      icon: "/flashcard.png",
      path: "/flashcards",
      type: "Flashcard",
    },
    {
      name: "Quiz",
      desc: "Great way to test your knowledge",
      icon: "/quiz.png",
      path: "/quiz",
      type: "Quiz",
    },
    {
      name: "Question/Answer",
      desc: "Help to practice your learning",
      icon: "/qa.png",
      path: "/qa",
      type: "QA",
    },
  ];

  useEffect(() => {
    GetStudyMaterial();
  }, []);

  const GetStudyMaterial = async () => {
    // Build study material from the client-side course object so we don't
    // call server APIs in this demo mode. This avoids the 500 errors.
    try {
      const chapters = course?.courseLayout?.chapters || [];
      const topics = course?.courseLayout?.topics || [];

      // Notes: use chapter summaries as notes
      const notes = chapters.map((ch, idx) => ({
        id: ch.chapterId || idx,
        title: ch.chapterTitle,
        content: ch.chapterSummary || "",
      }));

      // Flashcards: derive simple front/back from topics
      const flashcard = topics.map((t, i) => ({ front: t, back: `Summary of ${t}` }));

      // Quiz and QA - empty placeholders (can be generated later)
      const quiz = [];
      const qa = [];

      setStudyTypeContent({ notes, flashcard, quiz, qa });
    } catch (error) {
      console.error("Error building study material:", error);
      setStudyTypeContent({ notes: [], flashcard: [], quiz: [], qa: [] });
    }
  };

  return (
    <div className="mt-5">
      <h2 className="font-medium text-2xl">Study Material</h2>
      <div className="mt-3">
        <div className="flex gap-4 overflow-x-auto py-2 px-1">
          {MaterialList.map((item, index) => (
            <div key={index} className="flex-shrink-0 w-64">
              <MaterialCardItem
                item={item}
                studyTypeContent={studyTypeContent}
                course={course}
                refreshData={GetStudyMaterial}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyMaterialSection;

export const DUMMY_COURSES = [
  {
    id: 1,
    courseId: "demo-1",
    status: "Completed",
    courseLayout: {
      courseTitle: "Intro to Programming",
      courseSummary: "A short intro course covering programming basics.",
      topics: ["Variables", "Control Flow", "Functions", "Basic I/O"],
      chapters: [
        {
          chapterId: "c1",
          chapterTitle: "Getting Started",
          chapterSummary: "Setup dev environment and write your first program.",
          emoji: "🚀",
          topics: ["Installation", "Hello World", "Running Code"],
        },
        {
          chapterId: "c2",
          chapterTitle: "Basics of JavaScript",
          chapterSummary: "Syntax, variables and simple data types.",
          emoji: "📘",
          topics: ["Variables", "Types", "Operators"],
        },
        {
          chapterId: "c3",
          chapterTitle: "Control Flow",
          chapterSummary: "Conditionals and loops to control program flow.",
          emoji: "🔁",
          topics: ["if/else", "for/while", "switch"],
        },
      ],
    },
  },
  {
    id: 2,
    courseId: "demo-2",
    status: "Generating",
    courseLayout: {
      courseTitle: "Data Structures Overview",
      courseSummary: "Key data structures every developer should know.",
      topics: ["Arrays", "Linked Lists", "Stacks & Queues", "Hash Maps"],
      chapters: [
        { chapterTitle: "Arrays", topics: ["Static arrays", "Dynamic arrays"] },
      ],
    },
  },
  {
    id: 3,
    courseId: "demo-3",
    status: "Completed",
    courseLayout: {
      courseTitle: "Algorithms 101",
      courseSummary: "Basic algorithmic thinking and examples.",
      topics: ["Big-O", "Sorting", "Searching", "Recursion"],
      chapters: [
        {
          chapterId: "a1",
          chapterTitle: "Complexity Analysis",
          chapterSummary: "Understanding time and space complexity.",
          emoji: "📈",
          topics: ["Big-O Notation", "Best/Worst/Average"],
        },
        {
          chapterId: "a2",
          chapterTitle: "Sorting Algorithms",
          chapterSummary: "Common sorting algorithms and tradeoffs.",
          emoji: "🔀",
          topics: ["Bubble Sort", "Merge Sort", "Quick Sort"],
        },
      ],
    },
  },
];

export function getCourseById(id) {
  return DUMMY_COURSES.find((c) => c.courseId === id || String(c.id) === String(id)) || null;
}

"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useContext } from "react";
import { DUMMY_COURSES } from "@/lib/dummyCourses";
import CourseCardItem from "./CourseCardItem";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { CourseCountContext } from "@/app/_context/CourseCountContext";

function CourseList() {
  const { user, isLoaded } = useUser();
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setTotalCourse } = useContext(CourseCountContext);

  useEffect(() => {
    if (isLoaded) {
      GetCourseList();
    }
  }, [isLoaded, user]);

  const GetCourseList = async () => {
    // Load client-saved courses first (localStorage), then fall back to dummy courses.
    try {
      setLoading(true);
      const saved = typeof window !== "undefined" ? localStorage.getItem("prepgen_local_courses") : null;
      const parsed = saved ? JSON.parse(saved) : [];
      // mark locally saved courses so the UI can show delete actions
      const localParsed = parsed.map((c) => ({ ...c, __local: true }));
      const combined = [...localParsed, ...DUMMY_COURSES];
      setCourseList(combined);
      setTotalCourse(combined.length);
    } finally {
      setLoading(false);
    }
  };

  const deleteLocalCourse = (course) => {
    try {
      if (!course) return;
      const saved = localStorage.getItem("prepgen_local_courses");
      const parsed = saved ? JSON.parse(saved) : [];
      // match by courseId (preferred) or id fallback
      const filtered = parsed.filter((c) => !(c.courseId === course.courseId || c.id === course.id));
      localStorage.setItem("prepgen_local_courses", JSON.stringify(filtered));
      // refresh list
      GetCourseList();
    } catch (e) {
      console.error("Failed to delete local course", e);
    }
  };
  if (!isLoaded || !user) {
    return (
      <div className="w-full h-[40vh] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="font-bold text-2xl flex justify-between items-center">
        Your Study Material
        <Button
          variant="outline"
          onClick={GetCourseList}
          className="border-primary text-primary"
          disabled={loading}
        >
          <RefreshCw className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </h2>
      <div className="grid grid-col-2 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {!loading
              ? courseList?.map((course, index) => (
              <CourseCardItem
                course={course}
                key={course.id || index}
                onDelete={course.__local ? () => deleteLocalCourse(course) : undefined}
              />
            ))
          : [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div
                key={index}
                className="h-56 w-full bg-slate-200 rounded-lg animate-pulse"
              />
            ))}
      </div>
    </div>
  );
}

export default CourseList;

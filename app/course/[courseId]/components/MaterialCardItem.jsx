import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const MaterialCardItem = ({ item, studyTypeContent, course, refreshData }) => {
  const [loading, setLoading] = useState(false);

  // Trust-focused blue/teal palette for material types
  const typeStyles = {
    notes: "from-sky-50 to-sky-100 border-sky-200",
    Flashcard: "from-red-50 to-blue-100 border-red-200",
    Quiz: "from-blue-50 to-blue-100 border-blue-200",
    QA: "from-indigo-50 to-indigo-100 border-indigo-200",
  };
  const styleFor = typeStyles[item.type] || "from-slate-50 to-slate-100 border-slate-200";
  const colorBadge = {
    notes: "bg-sky-200 text-sky-800",
    Flashcard: "bg-gradient-to-r from-red-400 to-blue-400 text-white",
    Quiz: "bg-blue-200 text-blue-800",
    QA: "bg-indigo-200 text-indigo-800",
  };
  const badgeClass = colorBadge[item.type] || "bg-slate-200 text-slate-800";

  const isContentReady = () => {
    if (!studyTypeContent) return false;

    const content = studyTypeContent[item.type.toLowerCase()];
    if (!content) return false;

    // For notes, check if array has items
    if (item.type === "notes") {
      return content.length > 0;
    }

    // For other types, check if array has items and they have content
    return content.length > 0 && content.some((item) => item.content);
  };

  const GenerateContent = async (e) => {
    // Simulate content generation locally (no server call)
    try {
      e.preventDefault(); // Prevent navigation
      setLoading(true);

      // Simulate a short delay for generation
      setTimeout(() => {
        // Notify parent to refresh study material (which is built client-side)
        if (typeof refreshData === "function") refreshData();
        toast("Content generation simulated. Refresh complete.");
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Generation error:", error);
      toast("Error generating content: " + (error?.message || "unknown"));
      setLoading(false);
    }
  };

  const contentReady = isContentReady();

  return (
    <Link href={"/course/" + course?.courseId + item.path}>

      <div
        className={`shadow-md rounded-lg p-5 flex flex-col items-center ${
          !contentReady ? "grayscale" : ""
        } border ${styleFor} bg-gradient-to-br min-w-[220px] flex-shrink-0`}
      >
        <div className="w-full flex justify-end">
          {!contentReady ? (
            <h2 className="p-1 px-2 bg-slate-700/80 text-white rounded-full text-[10px] mb-2">
              Generate
            </h2>
          ) : (
            <h2 className="p-1 px-2 bg-emerald-600 text-white rounded-full text-[10px] mb-2">
              Ready
            </h2>
          )}
        </div>

        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" aria-hidden>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${badgeClass}`}>
            <Image src={item.icon} alt={item.name} width={36} height={36} />
          </div>
        </div>
        <h2 className="font-medium mt-1">{item.name}</h2>
        <div className="mt-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
            {item.name}
          </span>
        </div>
        <p className="text-slate-700 text-sm text-center mt-3">{item.desc}</p>

        {!contentReady ? (
          <Button
            className="mt-3 w-full"
            variant="outline"
            onClick={GenerateContent}
          >
            {loading && <RefreshCcw className="animate-spin" />}
            Generate
          </Button>
        ) : (
          <Button className="mt-3 w-full" variant="outline">
            View
          </Button>
        )}
      </div>
    </Link>
  );
};

export default MaterialCardItem;

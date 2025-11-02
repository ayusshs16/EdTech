import { NextResponse } from "next/server";
import { courseOutlineAIModel } from "@/configs/AiModel";

export async function POST(req) {
  try {
    const { topic, difficultyLevel, courseType, createdBy } = await req.json();

    if (!topic || !difficultyLevel || !courseType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const PROMPT = `
      generate a study material for '${topic}' for '${courseType}'
      and level of Difficulty will be '${difficultyLevel}'
      with course title, summary of course, List of chapters along with the summary and Emoji icon for each chapter,
      Topic list in each chapter in JSON format
    `;

    // Call the AI model
    let aiResp = null;
    try {
      aiResp = await courseOutlineAIModel.sendMessage(PROMPT);
    } catch (aiErr) {
      // Log provider error
      console.error("AI generation error:", aiErr);

      // Provide a graceful fallback so the frontend can continue working
      const fallbackLayout = {
        courseTitle: topic,
        courseSummary: `Auto-generated (fallback) study material for '${topic}' (Difficulty: ${difficultyLevel}).`,
        chapters: [
          {
            chapterTitle: `${topic} - Basics`,
            chapterSummary: `An introduction to ${topic}.`,
            topics: ["Overview", "Key concepts", "Simple examples"],
          },
          {
            chapterTitle: `${topic} - Practice`,
            chapterSummary: `Practice problems and examples for ${topic}.`,
            topics: ["Practice 1", "Practice 2", "Practice 3"],
          },
        ],
        topics: [topic, `${topic} - Basics`, `${topic} - Practice`],
      };

      return NextResponse.json({ success: true, courseLayout: fallbackLayout, fallback: true, reason: String(aiErr?.message || aiErr) });
    }

    // aiResp.response.text() may be async (a Promise) depending on SDK; await if present
    let text = null;
    try {
      if (aiResp && aiResp.response && typeof aiResp.response.text === "function") {
        text = await aiResp.response.text();
      } else if (aiResp && typeof aiResp.text === "function") {
        text = await aiResp.text();
      } else if (aiResp && typeof aiResp === "string") {
        text = aiResp;
      } else {
        // Fallback: stringify the response object for debugging
        try {
          text = JSON.stringify(aiResp);
        } catch (sErr) {
          text = String(aiResp);
        }
      }
    } catch (respErr) {
      console.error("Error reading AI response text:", respErr, "aiResp:", aiResp);
      // fall through to fallback
      text = null;
    }

    // Normalize and strip common markdown/code fences
    if (typeof text === "string") {
      text = text.trim();
      text = text.replace(/^```\s*json\s*/i, "").replace(/```\s*$/i, "");
    }

    let aiResult = null;
    if (text) {
      try {
        aiResult = JSON.parse(text);
      } catch (parseErr) {
        console.error("Failed to parse AI response as JSON, will use fallback. parseErr:", parseErr, "rawTextPreview:", (text && text.slice) ? text.slice(0,2000) : text);
        aiResult = null;
      }
    }

    if (aiResult) {
      return NextResponse.json({ success: true, courseLayout: aiResult });
    }

    // If we reach here, AI result unavailable or couldn't be parsed — return a graceful fallback layout
    const fallbackLayout = {
      courseTitle: topic,
      courseSummary: `Auto-generated (fallback) study material for '${topic}' (Difficulty: ${difficultyLevel}).`,
      chapters: [
        {
          chapterTitle: `${topic} - Basics`,
          chapterSummary: `An introduction to ${topic}.`,
          topics: ["Overview", "Key concepts", "Simple examples"],
        },
        {
          chapterTitle: `${topic} - Practice`,
          chapterSummary: `Practice problems and examples for ${topic}.`,
          topics: ["Practice 1", "Practice 2", "Practice 3"],
        },
      ],
      topics: [topic, `${topic} - Basics`, `${topic} - Practice`],
    };

    return NextResponse.json({ success: true, courseLayout: fallbackLayout, fallback: true });
  } catch (error) {
    console.error("AI generation error:", error);
    // Return a graceful fallback instead of an HTTP 500 so frontend flow continues
    const fallbackLayout = {
      courseTitle: topic || "Fallback Course",
      courseSummary: `Fallback course generated due to server error: ${error?.message || "unknown"}`,
      topics: topic ? [topic] : [],
      chapters: [],
    };
    return NextResponse.json({ success: true, courseLayout: fallbackLayout, fallback: true });
  }
}

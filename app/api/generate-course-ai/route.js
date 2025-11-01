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
    const aiResp = await courseOutlineAIModel.sendMessage(PROMPT);
    const text = aiResp?.response?.text();
    let aiResult = null;
    try {
      aiResult = text ? JSON.parse(text) : null;
    } catch (parseErr) {
      // If parsing fails, return raw text as fallback
      return NextResponse.json({ error: "Failed to parse AI response", raw: text }, { status: 500 });
    }

    return NextResponse.json({ success: true, courseLayout: aiResult });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

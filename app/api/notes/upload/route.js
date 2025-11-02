import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { CHAPTER_NOTES_TABLE } from "@/configs/schema";

const OPENAI_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export async function POST(req) {
  try {
    if (!OPENAI_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured on server" }, { status: 500 });
    }

    const { courseId, title = "", content = "", save = false } = await req.json();
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }

    const prompt = `You are an assistant that summarizes notes. Given the following raw notes, produce a short concise summary (2-4 sentences) and 3-6 key bullet points. Return only a JSON object with keys: summary (string) and bullets (array of strings). The notes:\n\n${content.slice(0, 20000)}`;

    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that outputs JSON when requested." },
        { role: "user", content: prompt },
      ],
      max_tokens: 700,
      temperature: 0.3,
    };

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      let body = null;
      try {
        body = JSON.parse(txt);
      } catch (e) {
        body = { raw: txt };
      }
      const openaiError = body?.error || body;
      const errorCode = openaiError?.code || openaiError?.type || null;
      if (errorCode === "insufficient_quota") {
        return NextResponse.json({ error: "OpenAI quota exhausted", code: "insufficient_quota", details: openaiError }, { status: 402 });
      }
      return NextResponse.json({ error: "OpenAI API error", details: openaiError }, { status: resp.status || 500 });
    }

    const data = await resp.json();
    const contentText = data?.choices?.[0]?.message?.content || "";

    // Try to parse JSON from assistant
    let parsed = null;
    try {
      parsed = JSON.parse(contentText);
    } catch (e) {
      // try to extract JSON code block
      const match = contentText.match(/```json([\s\S]*?)```/i) || contentText.match(/\{[\s\S]*\}/);
      if (match) {
        const jsonText = match[1] ? match[1].trim() : match[0];
        try {
          parsed = JSON.parse(jsonText);
        } catch (e2) {
          parsed = null;
        }
      }
    }

    // Fallback: try to heuristically build summary and bullets
    let summary = null;
    if (parsed && (parsed.summary || parsed.bullets)) {
      summary = {
        summary: parsed.summary || "",
        bullets: parsed.bullets || [],
      };
    } else {
      // As fallback, place raw content into summary (trim) and empty bullets
      summary = { summary: (contentText || "").trim().slice(0, 1000), bullets: [] };
    }

    // If requested, save the notes into DB as HTML combining original content and AI summary
    let insertedId = null;
    if (save) {
      const chapterId = `${title || "manual"}-${Date.now()}`;
      const noteHtmlParts = [];
      if (title) noteHtmlParts.push(`<h3>${title}</h3>`);
      noteHtmlParts.push(`<div>${content.replace(/</g, "&lt;")}</div>`);
      noteHtmlParts.push(`<h4>Summary</h4><p>${(summary.summary || "").replace(/</g, "&lt;")}</p>`);
      if (Array.isArray(summary.bullets) && summary.bullets.length) {
        noteHtmlParts.push(`<ul>${summary.bullets.map((b) => `<li>${b.replace(/</g, "&lt;")}</li>`).join("")}</ul>`);
      }
      const notesHtml = noteHtmlParts.join("\n");

      const result = await db.insert(CHAPTER_NOTES_TABLE).values({
        chapterId: chapterId,
        courseId: courseId || "",
        notes: notesHtml,
      }).returning({ id: CHAPTER_NOTES_TABLE.id });

      if (result && result[0]) insertedId = result[0].id;
    }

    return NextResponse.json({ summary, saved: Boolean(insertedId), id: insertedId });
  } catch (error) {
    console.error("notes upload error", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

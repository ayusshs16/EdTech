import { NextResponse } from "next/server";

const OPENAI_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export async function POST(req) {
  try {
    if (!OPENAI_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured on server" }, { status: 500 });
    }

    const { subject = "", count = 8 } = await req.json();
    if (!subject || subject.trim().length === 0) {
      return NextResponse.json({ error: "Missing subject" }, { status: 400 });
    }

    const prompt = `You are a helpful assistant. Given the subject: "${subject}", generate ${count} concise, high-quality topic titles suitable for study material. Return the result strictly as a JSON array of strings, for example: ["Topic 1", "Topic 2", ...]. Do not add any other text.`;

    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that outputs JSON arrays when requested." },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
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
      console.error("OpenAI error", resp.status, body);

      // Detect insufficient_quota responses from OpenAI and return a clear 402
      const openaiError = body?.error || body;
      const errorCode = openaiError?.code || openaiError?.type || null;
      if (errorCode === "insufficient_quota" || errorCode === "insufficient_quota") {
        return NextResponse.json({ error: "OpenAI quota exhausted", code: "insufficient_quota", details: openaiError }, { status: 402 });
      }

      return NextResponse.json({ error: "OpenAI API error", details: openaiError }, { status: resp.status || 500 });
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content || "";

    // Attempt to extract JSON array from the model output
    let topics = null;
    try {
      // try direct parse
      topics = JSON.parse(content);
    } catch (e) {
      // try to find a JSON code block inside the text
      const matches = content.match(/```json([\s\S]*?)```/i) || content.match(/\[\s*"[\s\S]*\]/);
      if (matches) {
        const jsonText = matches[1] ? matches[1].trim() : matches[0];
        try {
          topics = JSON.parse(jsonText);
        } catch (e2) {
          // fallback: attempt to parse as lines
          const lines = jsonText.split(/\n+/).map((l) => l.replace(/^[-\d\.\)\s]+/, "").trim()).filter(Boolean);
          topics = lines;
        }
      }
    }

    if (!Array.isArray(topics)) {
      // as a last resort, split by newline and return
      const fallback = (content || "").split(/\n+/).map((s) => s.trim()).filter(Boolean).slice(0, count);
      return NextResponse.json({ topics: fallback });
    }

    return NextResponse.json({ topics: topics.slice(0, count) });
  } catch (error) {
    console.error("generate-topics error", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

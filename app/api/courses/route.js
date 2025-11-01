import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { desc } from "drizzle-orm";

// POST: return list of courses created by a given user (createdBy)
export async function POST(req) {
  try {
    const { createdBy } = await req.json();
    if (!createdBy) {
      return NextResponse.json({ error: "Missing createdBy" }, { status: 400 });
    }

    const rows = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.createdBy, createdBy))
      .orderBy(desc(STUDY_MATERIAL_TABLE.id));

    return NextResponse.json({ result: rows });
  } catch (error) {
    console.error("/api/courses POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET: return a single course by courseId query param
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    const rows = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));

    return NextResponse.json({ result: rows[0] || null });
  } catch (error) {
    console.error("/api/courses GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

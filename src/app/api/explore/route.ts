import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildExplorationPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  const { profile, question, history } = await req.json();

  const prompt = buildExplorationPrompt(
    JSON.stringify(profile),
    question,
    history ?? []
  );

  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are Personality OS, an emotionally intelligent personality companion. Write with depth, warmth, and psychological nuance.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.85,
    max_tokens: 1500,
  });

  const content = completion.choices[0]?.message?.content ?? "";

  return NextResponse.json({ content });
}

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildExplorationPrompt } from "@/lib/prompts";
import { PersonalityProfile } from "@/lib/types";

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
    profile as PersonalityProfile,
    question,
    history ?? []
  );

  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are Personality OS, an emotionally intelligent personality companion.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.85,
    max_tokens: 1000,
  });

  const content = completion.choices[0]?.message?.content ?? "";

  return NextResponse.json({ content });
}

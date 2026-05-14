import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { PersonalityInput, PersonalityProfile } from "@/lib/types";
import { buildSynthesisPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  const input: PersonalityInput = await req.json();
  const prompt = buildSynthesisPrompt(input);

  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a personality synthesis engine combining MBTI, Enneagram, Insights Discovery, and astrology. Return only valid JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.8,
    max_tokens: 4000,
  });

  const raw = completion.choices[0]?.message?.content ?? "";

  let profile: PersonalityProfile;
  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    profile = JSON.parse(cleaned);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse AI response", raw },
      { status: 500 }
    );
  }

  return NextResponse.json(profile);
}

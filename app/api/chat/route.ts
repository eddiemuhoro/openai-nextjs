// app/api/chat/route.ts
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { messages }: { messages: ChatCompletionMessageParam[] } = body;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages,
    });

    const reply =
      response.choices[0]?.message?.content || "No response from model.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("OpenAI API error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch response from OpenAI";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { getClientIp, checkRateLimit } from "@/lib/rateLimit";
import { checkPayloadSize, logSecurityError, fetchWithTimeout } from "@/lib/security";

export const runtime = "nodejs";

const requestSchema = z.object({
  message: z.string(),
  projectContext: z.string(),
  teamContext: z.string(),
  chatHistory: z.string(),
}).strict();

export async function POST(req: Request) {
  const contextName = "TeamChatAPI";

  try {
    if (req.method !== "POST") {
      return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
    }

    const sizeCheck = checkPayloadSize(req, 100 * 1024);
    if (!sizeCheck.ok) {
      return NextResponse.json({ error: sizeCheck.error }, { status: 413 });
    }

    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(clientIp, 20, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too Many Requests. Please cool down." },
        { status: 429 }
      );
    }

    let rawBody = {};
    try {
      const text = await req.text();
      if (text) {
        rawBody = JSON.parse(text);
      }
    } catch (parseErr) {
      return NextResponse.json({ error: "Malformed JSON payload" }, { status: 400 });
    }

    const validation = requestSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid payload parameters" }, { status: 400 });
    }

    const { message, projectContext, teamContext, chatHistory } = validation.data;

    const openaiKey = process.env.OPENAI_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!openaiKey && !openRouterKey && !geminiKey) {
      logSecurityError(contextName, "No AI keys configured on the server.");
      return NextResponse.json({ error: "AI service offline." }, { status: 400 });
    }

    const systemPrompt = `You are playing the role of a hackathon teammate in a fast-paced hackathon simulation.
Your teammates and project context are provided below.
Based on the chat history and the user's latest message, choose ONE teammate to respond.
The response should be brief (1-3 sentences), in character with their role/personality, and helpful or reactive to the user's message.

PROJECT CONTEXT:
${projectContext}

TEAMMATES:
${teamContext}

Respond in pure JSON format:
{
  "teammateId": "The ID of the teammate responding (e.g. teammate-1)",
  "text": "The response message",
  "type": "disagreement" | "suggestion" | "info" | "contribution"
}`;

    const userPrompt = `CHAT HISTORY:\n${chatHistory}\n\nUSER (Team Lead): ${message}\n\nProvide the JSON response for the teammate who should reply.`;

    let responseText = "";

    if (openaiKey) {
      const response = await fetchWithTimeout("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.8,
          max_tokens: 300
        })
      }, 10000);
      if (!response.ok) throw new Error(`OpenAI responded with status ${response.status}`);
      const data = await response.json();
      responseText = data.choices?.[0]?.message?.content || "";
    } else if (openRouterKey) {
      const response = await fetchWithTimeout("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openRouterKey}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "The Hackathon Simulator",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.8,
          max_tokens: 300
        })
      }, 10000);
      if (!response.ok) throw new Error(`OpenRouter responded with status ${response.status}`);
      const data = await response.json();
      responseText = data.choices?.[0]?.message?.content || "";
    } else if (geminiKey) {
      const response = await fetchWithTimeout("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-goog-api-key": geminiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
          }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 300 }
        })
      }, 10000);
      if (!response.ok) throw new Error(`Gemini responded with status ${response.status}`);
      const data = await response.json();
      responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    let cleanedText = responseText.trim();
    if (cleanedText.startsWith("```json")) cleanedText = cleanedText.slice(7);
    if (cleanedText.startsWith("```")) cleanedText = cleanedText.slice(3);
    if (cleanedText.endsWith("```")) cleanedText = cleanedText.slice(0, -3);
    cleanedText = cleanedText.trim();

    const result = JSON.parse(cleanedText);
    
    if (result && typeof result.teammateId === "string" && typeof result.text === "string") {
      return NextResponse.json({ 
        teammateId: result.teammateId.replace(/[<>"]/g, ""),
        text: result.text.replace(/[<>]/g, ""),
        type: ["disagreement", "suggestion", "info", "contribution"].includes(result.type) ? result.type : "info"
      });
    }
    throw new Error("Invalid structure returned from AI model");
  } catch (err: any) {
    logSecurityError(contextName, err);
    return NextResponse.json({ error: "Failed to generate chat response." }, { status: 500 });
  }
}

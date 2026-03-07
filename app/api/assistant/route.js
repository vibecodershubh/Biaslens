import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req) {
  try {
    const { messages, articleContext } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured in .env.local" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const systemInstruction = `You are the BiasLens AI Cognitive Engine. Your goal is to analyze news articles for framing bias, emotional manipulation, and political tilt.
${articleContext ? `\nContext: The user is currently reading this article: ${articleContext}` : ""}
Be precise, analytical, and objective. Use Markdown for formatting.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: { parts: [{ text: systemInstruction }] },
    });

    const filteredMessages = messages.filter(m => m.role !== 'system');
    let history = [];
    if (filteredMessages.length > 1) {
      history = filteredMessages.slice(0, -1).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      if (history.length > 0 && history[0].role === 'model') {
        history.unshift({ role: 'user', parts: [{ text: 'System Initialized.' }] });
      }
    }

    const latestMessage = filteredMessages[filteredMessages.length - 1].content;
    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(latestMessage);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(new TextEncoder().encode(chunkText));
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Gemini Error:", error);
    return new Response(JSON.stringify({ error: "Failed to connect to AI engine: " + error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}



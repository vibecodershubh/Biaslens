import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided for analysis" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured in .env.local" }, { status: 500 });
    }

    const systemInstruction = `You are an Advanced NLP Cognitive Bias Analyst AI.
Execute advanced NLP techniques on the following text including:
1. Named Entity Recognition (NER) to isolate key actors, organizations, and geopolitics.
2. Topic Modeling to dynamically classify the narrative clusters.
3. Sentiment Scoring Logic to determine the emotional valence (Positive/Neutral/Negative) and manipulation tactics.

Analyze for cognitive biases like confirmation bias, political tilt, and framing.
You must return your analysis as a strict JSON object with exactly this structure:
{
  "summary": ["String (3-5 bullet points summarizing narrative)"],
  "sentiment": "String (Positive, Neutral, or Negative based on NLP valence)",
  "bias": "String (Summary of the bias leaning)",
  "biasIntensityScore": Number (0 to 100 NLP calculated score),
  "politicalTilt": "String (e.g., Leans Left, Center, Strong Right)",
  "entities": ["String (NER Extracted: People, Organizations, Countries)"],
  "riskImpact": [
    { "category": "String (e.g. Economic, Social, Technological)", "score": Number (0 to 100), "explanation": "String (Why?)" }
  ],
  "factCheckProbability": Number (0 to 100),
  "relatedTopics": ["String (Topic Modeling Clusters)"],
  "credibilityScore": Number (0 to 100),
  "detectedBiases": [
    {
      "type": "String (e.g., Emotional Manipulation)",
      "explanation": "String (Why it was detected citing NLP text patterns)",
      "impact": "String (High/Medium/Low)"
    }
  ]
}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `${systemInstruction}\n\nHere is the article text to analyze:\n\n${text}`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const analysisResult = JSON.parse(responseText);
    return NextResponse.json(analysisResult);

  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: "Failed to perform analysis: " + error.message }, { status: 500 });
  }
}


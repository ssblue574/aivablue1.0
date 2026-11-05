import { GoogleGenAI, Type } from "@google/genai";

type ProxyAction = "chat" | "generate-image" | "edit-image" | "discover" | "compare";

interface ProxyRequestBody {
  action?: ProxyAction;
  payload?: any;
}

const readText = (value: unknown, fallback = ""): string => (typeof value === "string" ? value : fallback);

const createClient = (): GoogleGenAI => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing on server.");
  }
  return new GoogleGenAI({ apiKey });
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const extractImageDataUrl = (response: any): string | null => {
  const parts = response?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;
  for (const part of parts) {
    if (part?.inlineData?.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

const handleChat = async (ai: GoogleGenAI, payload: any) => {
  const message = readText(payload?.message);
  const lang = readText(payload?.lang, "en");
  const langDirective = lang === "zh" ? "Respond in Chinese (Simplified)." : "Respond in English.";
  const modelId = "gemini-2.5-flash";

  const response = await ai.models.generateContent({
    model: modelId,
    contents: message,
    config: {
      systemInstruction: `You are Aiva, an indie hardware scout. ${langDirective}`,
    },
  });

  return json(200, { text: response.text ?? "" });
};

const handleGenerateImage = async (ai: GoogleGenAI, payload: any) => {
  const prompt = readText(payload?.prompt);
  const aspectRatio = readText(payload?.aspectRatio, "1:1");
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio,
        imageSize: "1K",
      },
    },
  });
  return json(200, { imageDataUrl: extractImageDataUrl(response) });
};

const handleEditImage = async (ai: GoogleGenAI, payload: any) => {
  const prompt = readText(payload?.prompt);
  const base64Image = readText(payload?.base64Image);
  const rawBase64 = base64Image.split(",")[1] || base64Image;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/png",
            data: rawBase64,
          },
        },
        { text: prompt },
      ],
    },
  });

  return json(200, { imageDataUrl: extractImageDataUrl(response) });
};

const handleDiscover = async (ai: GoogleGenAI, payload: any) => {
  const query = readText(payload?.query);
  const mode = readText(payload?.mode, "trending");
  const lang = readText(payload?.lang, "en");
  const langInstruction = lang === "zh" ? "Write in Chinese (Simplified)." : "Write in English.";

  const userPrompt =
    mode === "classic"
      ? `Surface 4 cult or discontinued devices related to "${query}". ${langInstruction}`
      : `Find indie hardware devices (2024-2025) for topic "${query}". ${langInstruction}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            brand: { type: Type.STRING },
            category: { type: Type.STRING },
            priceEstimate: { type: Type.STRING },
            description: { type: Type.STRING },
            launchDate: { type: Type.STRING },
            buyingChannel: { type: Type.STRING },
            isClassic: { type: Type.BOOLEAN },
            imageUrl: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            glowColor: { type: Type.STRING },
            fundingStatus: { type: Type.STRING },
            stage: { type: Type.STRING },
          },
        },
      },
    },
  });

  const products = JSON.parse(response.text || "[]");
  return json(200, { products });
};

const handleCompare = async (ai: GoogleGenAI, payload: any) => {
  const productNames: string[] = Array.isArray(payload?.productNames) ? payload.productNames : [];
  const lang = readText(payload?.lang, "en");
  const langInstruction = lang === "zh" ? "Output in Chinese." : "Output in English.";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Compare these products: ${productNames.join(", ")}. ${langInstruction}`,
    config: { responseMimeType: "application/json" },
  });

  const comparison = JSON.parse(response.text || "null");
  return json(200, { comparison });
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    const body = (await request.json()) as ProxyRequestBody;
    const action = body.action;
    const payload = body.payload;
    const ai = createClient();

    switch (action) {
      case "chat":
        return await handleChat(ai, payload);
      case "generate-image":
        return await handleGenerateImage(ai, payload);
      case "edit-image":
        return await handleEditImage(ai, payload);
      case "discover":
        return await handleDiscover(ai, payload);
      case "compare":
        return await handleCompare(ai, payload);
      default:
        return json(400, { error: "Unsupported action" });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return json(500, { error: message });
  }
}

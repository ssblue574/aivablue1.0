
import { GoogleGenAI, Type } from "@google/genai";
import { ComparisonResult, Product, Language, AspectRatio } from "../data";

const apiKey = process.env.API_KEY;
// @ts-ignore
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Singleton to hold the chat session
let chatSession: any = null;

/**
 * Sends a message to the AI Hardware Consultant (gemini-3-pro-preview).
 */
export const sendChatMessage = async (message: string, lang: Language): Promise<string> => {
  if (!ai) return lang === 'zh' ? "请配置 API Key 以使用 AI 功能。" : "Please configure API Key.";

  const modelId = "gemini-3-pro-preview"; // Upgraded to Pro

  if (!chatSession) {
    const locale = lang === 'zh' ? 'Chinese (Simplified)' : 'English';
    const langDirective = lang === 'zh' ? 'Respond in Chinese (Simplified).' : 'Respond in English.';
    const systemInstruction = `
      You are "Aiva", the Tech Scout for AIVA Lab—part Steve Jobs, part Kickstarter hunter.
      ${langDirective}

      Mission:
      • Prioritize indie/startup hardware: AI wearables (pins, pendants, badges), spatial computing rigs, robotics/BCI, ambient home agents, niche creator tools, open-source devices.
      • Treat large companies as secondary and only mention them when they launch non-traditional categories (Vision Pro, Optimus, Neuralink, etc.).
      • EXCLUDE legacy categories entirely: smartphones, conventional laptops, mass-market smartwatches or earbuds.
      • Always mention the funding signal (Crowdfunding, Pre-seed, Series A, Limited Drop, Shipping Batch, etc.) and what pain point or community they serve.
      • Tone: curated, calm, aesthetic-first. Surfaces feel like a secret drop announcement. No listicles, no rambling.
      • Keep answers concise, scannable, and only use **bold** for emphasis when necessary.
    `;

    chatSession = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: systemInstruction,
      }
    });
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return lang === 'zh' ? "连接断开，请重试。" : "Connection lost. Please try again.";
  }
};

/**
 * Generates an image using gemini-3-pro-image-preview.
 */
export const generateAIImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string | null> => {
  if (!ai) return null;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: "1K"
        }
      },
    });

    // Extract image from response
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};

/**
 * Edits an image using gemini-2.5-flash-image.
 */
export const editAIImage = async (base64Image: string, prompt: string): Promise<string | null> => {
  if (!ai) return null;
  try {
    // Strip header if present to get raw base64
    const rawBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG or JPEG, generic handling
              data: rawBase64,
            },
          },
          { text: prompt },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Edit Error:", error);
    return null;
  }
};

/**
 * Discovers trending hardware.
 */
export const discoverHardware = async (query: string, mode: 'trending' | 'classic', lang: Language): Promise<Product[]> => {
  if (!ai) return [];
  const modelId = "gemini-2.5-flash";
  
  const langInstruction = lang === 'zh' ? "Write in Chinese (Simplified)." : "Write in English.";
  const focusStatement = "Focus: AI wearables (pins, pendants, badges), spatial computing rigs, robotics/BCI, ambient agents, niche creator instruments (Teenage Engineering spirit), open-source hardware.";
  const blacklistStatement = "Blacklist: smartphones, conventional laptops/notebooks, traditional smartwatches, budget earbuds, generic tablets.";
  
  let userPrompt = "";
  if (mode === 'classic') {
    userPrompt = `
      Surface 4 cult or discontinued devices (pre-2015) related to "${query}" that inspired today's indie hardware culture.
      Highlight why they mattered to makers and describe the niche they served. ${langInstruction}
    `;
  } else {
    userPrompt = `
      Query/topic: "${query}".
      Hunt across Kickstarter, Indiegogo, Product Hunt, YC Hardware alumni, and GitHub open hardware for devices released between 2024-2025.
      Emphasize under-the-radar founders, crowdfunding drops, or limited enterprise experiments that are not smartphones/laptops/watches. ${langInstruction}
    `;
  }

  const systemInstruction = `
    Role: Indie Hardware Tech Scout.
    ${focusStatement}
    ${blacklistStatement}
    Rules:
    1. Minimum 3 entries must be startups/crowdfunding with stage="startup" and a detailed fundingStatus (Crowdfunding, Pre-seed, Series A, Limited Batch, etc.).
    2. At most 1 entry can be enterprise, and only if it represents a new category (spatial computing, robotics, BCI). Mark it with stage="enterprise" and a fundingStatus such as "Limited Release".
    3. "description" must point out the pain point, the maker/founder story, and how early adopters might play with it.
    4. "buyingChannel" should be Kickstarter/Indiegogo storefront links, official preorder pages, or regional indie stores (JD/Tmall for CN, Amazon/BestBuy for global) depending on language.
    5. Provide realistic launchDate (YYYY-MM) and glowColor (hex) for each item.
    6. Always obey: ${langInstruction}
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
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
              stage: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const products: Product[] = JSON.parse(text);
    return products.map((p, idx) => ({
      ...p,
      imageUrl: `https://picsum.photos/600/400?random=${idx + Math.random()}`,
      glowColor: p.glowColor || '#ffffff',
      fundingStatus: p.fundingStatus || (p.stage === 'startup' ? 'Crowdfunding' : 'General Release')
    }));

  } catch (error) {
    console.error("Discovery Error:", error);
    return [];
  }
};

/**
 * Compares products.
 */
export const compareProductsAI = async (productNames: string[], lang: Language): Promise<ComparisonResult | null> => {
  if (!ai) return null;
  const modelId = "gemini-2.5-flash";
  const langInstruction = lang === 'zh' ? "Output in Chinese." : "Output in English.";

  const prompt = `
    Compare these products: ${productNames.join(", ")}.
    ${langInstruction}
    
    Requirements:
    1. Be critical like Steve Jobs.
    2. Scores 0-100.
    3. Buying guide focused on ${lang === 'zh' ? 'Chinese market' : 'Global market'}.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      winner: { type: Type.STRING },
      summary: { type: Type.STRING },
      metrics: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            metric: { type: Type.STRING },
            scores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                   product: { type: Type.STRING },
                   score: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      },
      prosCons: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      },
      verdict: { type: Type.STRING },
      buyingGuide: {
        type: Type.OBJECT,
        properties: {
          targetAudience: { type: Type.STRING },
          bestFor: { type: Type.STRING },
          localizedTip: { type: Type.STRING },
          recommendedPlatform: { type: Type.STRING }
        }
      }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // @ts-ignore
        responseSchema: schema
      }
    });

    const text = response.text;
    if (!text) return null;

    const rawData = JSON.parse(text);

    // Transform rawData.metrics to match Recharts data format
    const transformedMetrics = rawData.metrics.map((m: any) => {
      const obj: any = { metric: m.metric };
      m.scores.forEach((s: any) => {
        obj[s.product] = s.score;
      });
      return obj;
    });

    return {
      ...rawData,
      metrics: transformedMetrics
    };

  } catch (error) {
    console.error("Comparison Error:", error);
    return null;
  }
};

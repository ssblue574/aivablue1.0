import { ComparisonResult, Product, Language, AspectRatio } from "../data";

type ProxyAction = "chat" | "generate-image" | "edit-image" | "discover" | "compare";

interface ProxyRequest<T = unknown> {
  action: ProxyAction;
  payload: T;
}

const proxyBaseUrl = import.meta.env.VITE_AI_PROXY_URL || "/api/gemini";

const postToProxy = async <TResponse, TPayload = unknown>(
  action: ProxyAction,
  payload: TPayload
): Promise<TResponse> => {
  const response = await fetch(proxyBaseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, payload } as ProxyRequest<TPayload>),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `AI proxy request failed with status ${response.status}`);
  }

  return (await response.json()) as TResponse;
};

export const sendChatMessage = async (message: string, lang: Language): Promise<string> => {
  try {
    const result = await postToProxy<{ text: string }, { message: string; lang: Language }>("chat", {
      message,
      lang,
    });
    return result.text || (lang === "zh" ? "连接断开，请重试。" : "Connection lost. Please try again.");
  } catch (error) {
    console.error("Chat Error:", error);
    return lang === "zh"
      ? "AI 服务暂不可用，请检查后端代理配置。"
      : "AI service is unavailable. Please check backend proxy configuration.";
  }
};

export const generateAIImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string | null> => {
  try {
    const result = await postToProxy<{ imageDataUrl: string | null }, { prompt: string; aspectRatio: AspectRatio }>(
      "generate-image",
      { prompt, aspectRatio }
    );
    return result.imageDataUrl ?? null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};

export const editAIImage = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    const result = await postToProxy<{ imageDataUrl: string | null }, { base64Image: string; prompt: string }>(
      "edit-image",
      { base64Image, prompt }
    );
    return result.imageDataUrl ?? null;
  } catch (error) {
    console.error("Image Edit Error:", error);
    return null;
  }
};

export const discoverHardware = async (
  query: string,
  mode: "trending" | "classic",
  lang: Language
): Promise<Product[]> => {
  try {
    const result = await postToProxy<{ products: Product[] }, { query: string; mode: "trending" | "classic"; lang: Language }>(
      "discover",
      { query, mode, lang }
    );
    return result.products ?? [];
  } catch (error) {
    console.error("Discovery Error:", error);
    return [];
  }
};

export const compareProductsAI = async (
  productNames: string[],
  lang: Language
): Promise<ComparisonResult | null> => {
  try {
    const result = await postToProxy<{ comparison: ComparisonResult | null }, { productNames: string[]; lang: Language }>(
      "compare",
      { productNames, lang }
    );
    return result.comparison ?? null;
  } catch (error) {
    console.error("Comparison Error:", error);
    return null;
  }
};

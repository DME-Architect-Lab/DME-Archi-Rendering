
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  // Check for manual key in localStorage first
  const manualKey = localStorage.getItem('gemini_api_key');
  return new GoogleGenAI({ apiKey: manualKey || process.env.API_KEY });
};

/**
 * Robust retry wrapper with exponential backoff.
 * Handles 503 (Overloaded/Unavailable) and 429 (Rate Limit) errors.
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries: number = 3, initialDelay: number = 2000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const status = error?.status || error?.error?.code;
      
      if (status === 503 || status === 429 || status === 'UNAVAILABLE' || status === 'RESOURCE_EXHAUSTED') {
        const delay = initialDelay * Math.pow(2, i);
        console.warn(`Gemini API overloaded. Retrying in ${delay}ms (Attempt ${i + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export const generateArchitecturalRender = async (
  prompt: string,
  baseImageB64?: string,
  aspectRatio: string = '1:1',
  resolution: string = '1K'
) => {
  return withRetry(async () => {
    const ai = getAIClient();
    const isHighRes = resolution === '2K' || resolution === '4K' || resolution === '6K';
    const model = isHighRes ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
    const imageSize = resolution === '6K' ? '4K' : (resolution as any);

    const contents: any = {
      parts: [{ text: isHighRes ? `[ULTRA HIGH FIDELITY ARCHITECTURAL RENDER - ${resolution} OUTPUT]: ${prompt}` : prompt }]
    };

    if (baseImageB64) {
      contents.parts.unshift({
        inlineData: {
          data: baseImageB64.split(',')[1],
          mimeType: 'image/jpeg'
        }
      });
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: isHighRes ? imageSize : undefined
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  });
};

export interface AnalysisResult {
  prompt: string;
  style: string;
  lighting: string;
  environment: string;
}

export const analyzeArchitecturalImage = async (imageB64: string, context?: string): Promise<AnalysisResult> => {
  return withRetry(async () => {
    const ai = getAIClient();
    const model = 'gemini-3-pro-preview';
    let instruction = "Act as a professional architectural photographer and 3D artist. Analyze this input image (sketch, photo, or map). Write a **highly detailed, photorealistic rendering prompt** based on the visual input. Describe the materials (e.g., polished marble, oak wood, brushed steel), specific lighting conditions (e.g., soft morning sunlight, cinematic shadows), colors, and architectural style in detail. Ensure the description implies high-end photography.";
    
    if (context) {
      instruction += `\n\nSpecific Context/Task: ${context}\n\nEnsure the generated prompt strictly follows this context while maintaining photorealism.`;
    }

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              data: imageB64.split(',')[1],
              mimeType: 'image/jpeg'
            }
          },
          { text: instruction }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompt: {
              type: Type.STRING,
              description: "A detailed descriptive prompt for the target rendering task."
            },
            style: {
              type: Type.STRING,
              description: "Suggested style (e.g., Photorealistic, Cinematic, etc.)."
            },
            lighting: {
              type: Type.STRING,
              description: "Suggested lighting condition."
            },
            environment: {
              type: Type.STRING,
              description: "Suggested environment context."
            }
          },
          required: ["prompt", "style", "lighting", "environment"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  });
};

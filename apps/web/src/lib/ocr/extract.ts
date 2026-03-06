import type { OcrMode } from './settings';
import type { ExtractedWord } from './llm-vision';

export type ExtractionResult =
  | { mode: 'ocr'; words: string[] }
  | { mode: 'llm'; words: ExtractedWord[] };

const LLM_MAX_DIMENSION = 1024;
const LLM_JPEG_QUALITY = 0.65;

/** Downscale image for LLM vision — reduces payload ~4x vs full resolution. */
function compressForLlm(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let w = img.naturalWidth;
      let h = img.naturalHeight;

      if (w > LLM_MAX_DIMENSION || h > LLM_MAX_DIMENSION) {
        if (w >= h) {
          h = Math.round(h * (LLM_MAX_DIMENSION / w));
          w = LLM_MAX_DIMENSION;
        } else {
          w = Math.round(w * (LLM_MAX_DIMENSION / h));
          h = LLM_MAX_DIMENSION;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', LLM_JPEG_QUALITY));
    };
    img.onerror = () => reject(new Error('Failed to compress image for LLM'));
    img.src = dataUrl;
  });
}

export async function extractWordsFromImage(
  imageDataUrl: string,
  mode: OcrMode,
  onProgress?: (progress: number) => void,
  locale?: string,
  signal?: AbortSignal,
): Promise<ExtractionResult> {
  if (mode === 'llm') {
    const compressed = await compressForLlm(imageDataUrl);
    const { extractWithLlm } = await import('./llm-vision');
    const words = await extractWithLlm(compressed, locale, signal);
    return { mode: 'llm', words };
  }

  const { extractWithTesseract } = await import('./tesseract');
  const words = await extractWithTesseract(imageDataUrl, onProgress, signal);
  return { mode: 'ocr', words };
}

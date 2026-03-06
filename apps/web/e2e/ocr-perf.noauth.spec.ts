import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE = path.resolve(__dirname, 'fixtures/japanese-text.png');

test.describe('OCR performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/words');
    await page.evaluate(() => {
      localStorage.setItem('vocabook_storage_consent', 'true');
    });
  });

  test('extract words from japanese-text.png and measure timing', async ({ page }) => {
    // Collect console logs for timing
    const logs: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('variant_timing') || text.includes('total_ocr_timing')) {
        logs.push(text);
      }
    });

    await page.goto('/words/scan');
    await page.waitForLoadState('networkidle');

    // Upload image
    const fileInput = page.locator('input[type="file"][multiple]');
    await fileInput.setInputFiles(FIXTURE);

    const preview = page.locator('img[alt="Selected 1"]');
    await expect(preview).toBeVisible({ timeout: 10000 });

    // Click extract
    await page.getByTestId('scan-extract-button').click();

    // Wait for extraction to complete — word preview should appear
    // Allow up to 120s for Tesseract WASM
    await expect(page.getByTestId('scan-select-all')).toBeVisible({ timeout: 120000 });

    // Print timing logs
    console.log('\n=== OCR Performance ===');
    for (const log of logs) {
      console.log(log);
    }
    console.log('=======================\n');

    // Sanity: at least one word was extracted
    const confirmButton = page.getByTestId('scan-confirm-selected');
    await expect(confirmButton).toBeVisible();
  });
});

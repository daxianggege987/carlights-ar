#!/usr/bin/env node
/**
 * 自动截取 App 5 个页面的 iPad 截图（iPad Air 视口，内容更饱满）
 * 使用 iPad Air 820×1180 视口从 localhost:8081（Expo 默认）采集，再交由生成器导出 2048×2732
 * 使用前: 先运行 npx expo start --web
 * 运行: node scripts/capture-screenshots-ipad.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../screenshots-gen/public/screenshots-ipad/ar');
const BASE_URL = process.env.BASE_URL || 'http://localhost:8081';
const VIEWPORT = { width: 820, height: 1180 }; // iPad Air 10.9" 竖屏逻辑分辨率，内容更饱满

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

async function capture() {
  console.log('Launching browser (iPad Air viewport 820×1180)...');
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  try {
    console.log(`Opening ${BASE_URL}...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    console.log('Capturing hero.png...');
    await page.screenshot({ path: join(OUT_DIR, 'hero.png') });

    await page.click('[data-testid="category-engine"]');
    await page.waitForTimeout(800);
    console.log('Capturing browse.png...');
    await page.screenshot({ path: join(OUT_DIR, 'browse.png') });

    await page.click('[data-testid="light-check-engine"]');
    await page.waitForTimeout(800);
    console.log('Capturing detail.png...');
    await page.screenshot({ path: join(OUT_DIR, 'detail.png') });

    await page.click('[data-testid="back-btn"]');
    await page.waitForTimeout(500);
    await page.click('[data-testid="back-btn"]');
    await page.waitForTimeout(800);

    await page.fill('[data-testid="search-input"]', 'محرك');
    await page.waitForTimeout(1000);
    console.log('Capturing search.png...');
    await page.screenshot({ path: join(OUT_DIR, 'search.png') });

    await page.fill('[data-testid="search-input"]', '');
    await page.waitForTimeout(500);
    const dangerLight = page.locator('[data-testid="light-engine-temp"]');
    await dangerLight.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await dangerLight.click();
    await page.waitForTimeout(800);
    console.log('Capturing danger.png...');
    await page.screenshot({ path: join(OUT_DIR, 'danger.png') });

    console.log('\nDone! iPad screenshots saved to:', OUT_DIR);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

capture();

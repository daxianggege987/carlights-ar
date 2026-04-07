#!/usr/bin/env node
/**
 * 自动截取 App 5 个页面的截图
 * 使用前: 先运行 npx expo start --web (端口 8081 或 8082)
 * 运行: node scripts/capture-screenshots.mjs
 * 或: BASE_URL=http://localhost:8082 node scripts/capture-screenshots.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../screenshots-gen/public/screenshots/ar');
const BASE_URL = process.env.BASE_URL || 'http://localhost:8082';
const VIEWPORT = { width: 390, height: 932 }; // iPhone 14 Pro Max

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

async function capture() {
  console.log('Launching browser...');
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

    // 1. hero.png - 首页
    console.log('Capturing hero.png (Home)...');
    await page.screenshot({ path: join(OUT_DIR, 'hero.png') });

    // 2. 点击分类进入浏览页
    await page.click('[data-testid="category-engine"]');
    await page.waitForTimeout(800);

    console.log('Capturing browse.png (Browse)...');
    await page.screenshot({ path: join(OUT_DIR, 'browse.png') });

    // 3. 点击第一个故障灯进入详情
    await page.click('[data-testid="light-check-engine"]');
    await page.waitForTimeout(800);

    console.log('Capturing detail.png (Detail)...');
    await page.screenshot({ path: join(OUT_DIR, 'detail.png') });

    // 4. 返回首页
    await page.click('[data-testid="back-btn"]');
    await page.waitForTimeout(500);
    await page.click('[data-testid="back-btn"]');
    await page.waitForTimeout(800);

    // 5. 在搜索框输入
    await page.fill('[data-testid="search-input"]', 'محرك');
    await page.waitForTimeout(1000);

    console.log('Capturing search.png (Search)...');
    await page.screenshot({ path: join(OUT_DIR, 'search.png') });

    // 6. 清空搜索，进入危险灯详情
    await page.fill('[data-testid="search-input"]', '');
    await page.waitForTimeout(500);

    // 首页下方有危险灯快速入口，先滚动再点击 engine-temp (红色)
    const dangerLight = page.locator('[data-testid="light-engine-temp"]');
    await dangerLight.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await dangerLight.click();
    await page.waitForTimeout(800);

    console.log('Capturing danger.png (Danger light)...');
    await page.screenshot({ path: join(OUT_DIR, 'danger.png') });

    console.log('\nDone! Screenshots saved to:', OUT_DIR);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

capture();

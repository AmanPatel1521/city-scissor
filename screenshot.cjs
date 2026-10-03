const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  // Wait for prehero to finish
  await page.waitForTimeout(5000); 
  
  // Scroll down to Services Atelier
  await page.evaluate(() => {
    document.getElementById('services').scrollIntoView();
  });
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: '/Users/amanpatel/.gemini/antigravity/brain/25ae9f8c-4440-4e0d-89d0-db0b30f58ce8/.tempmediaStorage/screenshot1.png', fullPage: true });
  
  await browser.close();
})();

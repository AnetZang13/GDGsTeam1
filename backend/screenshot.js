const puppeteer =require('puppeteer');
const fs = require ('fs');
(async() => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://embark.mtholyoke.edu/ligafilipina/rsvp_boot?id=2141148");

  const screenshotPath='public/screenshot.png';
  await page.screenshot({path: screenshotPath});

  console.log('Screenshot saved:', screenshotPath);

  await browser.close();
})();
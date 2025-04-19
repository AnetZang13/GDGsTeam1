const puppeteer =require('puppeteer');
const fs = require ('fs');
(async() => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const path = require('path');

  await page.goto("https://embark.mtholyoke.edu/ligafilipina/rsvp_boot?id=2141148");

  const folderPath = "screenshots"; 
  const fileName = path.join("screenshots", "screenshot.png"); 

  if (!fs.existsSync(folderPath)){
    fs.mkdirSync(folderPath, {recursive: true});
  }

  await page.screenshot({path: fileName});

  console.log("Success"); 

  await browser.close();
})();
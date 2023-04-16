// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const fs = require("fs");
const DATA_CSV_PATH = "./data/final_data.csv"
const DATA_JSON_PATH = "./data/final_data.json";

const csv_write_stream = fs.createWriteStream(DATA_CSV_PATH, {flags:'a'});
let browser, page;

const final_data = [];
const limit = 10;
let current_round = 0;
let current_url = 'https://google.com';


async function open_website() {

  console.log(`${current_round + 1}. Link: ${current_url}`);
  await page.goto(current_url);

  await page.waitForTimeout((Math.floor(Math.random() * 3) + 2) * 1000);

  const data = await page.evaluate(() => {
    const name = document
    .querySelector('body > div.L3eUgb > div.o3j99.c93Gbe > div.KxwPGc.SSwjIe > div.KxwPGc.ssOUyb > a > span')
    .textContent
    .trim();

    return name;
  });
  

  if (data && data.length > 0) {
    final_data.push(data);
    current_round++;
    
    // Write line to CSV file
    const csv_line = `${data}`
    csv_write_stream.write(csv_line);
  }

  if (current_round >= limit) {
    return null;
  } else {
    await open_website();
  }
}

async function init() {
  browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
    userDataDir: "./tmp",
  });

  page = await browser.newPage();

  // Limit requests 
	await page.setRequestInterception(true); 
	page.on('request', async (request) => { 
		if (request.resourceType() == 'image') { 
			await request.abort(); 
		} else { 
			await request.continue(); 
		} 
	}); 

  try {
    await open_website();
  } catch (error) {
    console.log(`Problem during scraping`);
    console.log(error);
  }
  fs.writeFileSync(
    DATA_JSON_PATH,
    JSON.stringify(final_data, null, 4),
    "utf-8",
    () => {}
  );

  // csv_write_stream.end();
  await browser.close();
}

init();

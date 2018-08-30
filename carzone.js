const puppeteer = require('puppeteer');

// print process.argv
carName = process.argv[2];
modelName = process.argv[3];
console.log(`Lookup ${carName} ${modelName}`);
const url = `https://www.carzone.ie/used-cars/${carName}/${modelName}`;

async function getPic(url) {
  const browser = await puppeteer.launch({ headless: true, args: ['--enable-features=NetworkService'], ignoreHTTPSErrors: true });

  const page = await browser.newPage();
  await page.goto(url);
  // await page.hover('#navigation > div > ul:nth-child(1) > li:nth-child(2) > a');
  // await page.click('#navigation > div > ul:nth-child(1) > li:nth-child(2) > ul > li:nth-child(1) > a');
  await page.waitFor(1000);
  await page.click('#search-results > div.search-state.clearfix.bottom > div.limit > a:nth-child(3) > span');
  // await page.waitFor(500);
  // await page.click('#browse-links > div > div > div > ul:nth-child(1) > li:nth-child(3) > a');
  await page.waitFor(2000);
  const numberOfResults = await page.evaluate(() => document.querySelector('#search-results > div.search-state.clearfix.top > div.advert-counter.search-info').innerText);

  const result = await page.evaluate(() => {
    let data = []; // Create an empty array
    let title = "test";
    let price = 0;
    let count = 0;
    // Loop through each proudct
    let elements = document.querySelectorAll('.advert-inner');
    for (var element of elements) { // Loop through each proudct
      count++;
      title = element.childNodes[5].children[0].innerText.replace(/^\s+|\s+$/g, ''); // Select the title
      year = element.childNodes[5].children[1].innerText.replace(/^\s+|\s+$/g, ''); // Select the title
      extra = element.childNodes[5].children[2].innerText.replace(/^\s+|\s+$/g, ''); // Select the title
      price = element.childNodes[7].children[0].innerText.replace(/^\s+|\s+$/g, ''); // Select the title
      priceNumber = price.replace(/[^0-9.-]+/g, "");

      data.push({ count, title, price: priceNumber, year, extra }); // Push an object with the data onto our array
    }
    return data; // Return our data array
  });

  console.log(numberOfResults);
  let priceArray = result.map(car => car.price).sort();

  console.log('Prices', priceArray);

  await page.screenshot({ path: `carzone-${carName}-${modelName}.png` });

  let scrape = async () => {
    return 'test';
  };
  scrape().then((value) => {
    console.log(value); // Success!
  });

  await browser.close();
}

console.log(url);
getPic(url);

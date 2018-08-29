const puppeteer = require('puppeteer');

async function getPic() {
  const browser = await puppeteer.launch({ headless: false, args: ['--enable-features=NetworkService'], ignoreHTTPSErrors: true });

  const page = await browser.newPage();
  await page.goto('https://www.carzone.ie/');
  await page.waitFor(500);
  await page.hover('#navigation > div > ul:nth-child(1) > li:nth-child(2) > a');
  await page.click('#navigation > div > ul:nth-child(1) > li:nth-child(2) > ul > li:nth-child(1) > a');
  await page.waitFor(1000);
  await page.click('#browse-links > div > div.links.selected > div > ul:nth-child(3) > li:nth-child(3) > a');
  await page.waitFor(500);
  await page.click('#browse-links > div > div > div > ul:nth-child(1) > li:nth-child(3) > a');
  await page.waitFor(500);
  // await page.click('#filter - price > span');
  await page.waitFor(1000);
  const innerText = await page.evaluate(() => document.querySelector('#search-results > div.search-state.clearfix.top > div.advert-counter.search-info').innerText);

  const result = await page.evaluate(() => {
    let data = []; // Create an empty array
    let elements = document.querySelectorAll('.advert > div'); // Select all 
    let title = "test";
    let price = 0;
    // Loop through each proudct
    for (var element of elements) { // Loop through each proudct
      console.log(element);
      // let title = "test";
      title = document.querySelector('div.vehicle-description > div.vehicle-make-model > h3 > a').innerText; // Select the title
      price = document.querySelector('div.vehicle-call2action > div.vehicle-price > div.price').innerText; // Select the price

      data.push({ element, title, price }); // Push an object with the data onto our array
    }
    // Select the title
    // Select the price
    // data.push({ element, title, price }); // Push the data to our array
    console.log(data);
    return data; // Return our data array
  });

  console.log(innerText);
  console.log(result);

  // await page.click('#navigation > div > ul:nth-child(1) > li:nth-child(2) > a');
  await page.screenshot({ path: 'carzone.png' });

  let scrape = async () => {
    return 'test';
  };
  scrape().then((value) => {
    console.log(value); // Success!
  });

  await browser.close();
}

getPic();

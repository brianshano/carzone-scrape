const puppeteer = require('puppeteer');

carName = process.argv[2];
modelName = process.argv[3];
// console.log(`Lookup ${carName} ${modelName}`);
const url = `https://www.carzone.ie/used-cars/${carName}/${modelName}`;

async function getPic(url) {
  const browser = await puppeteer.launch({ headless: true, args: ['--enable-features=NetworkService'], ignoreHTTPSErrors: true });

  const page = await browser.newPage();
  await page.goto(url);
  // await page.hover('#navigation > div > ul:nth-child(1) > li:nth-child(2) > a');
  // await page.click('#navigation > div > ul:nth-child(1) > li:nth-child(2) > ul > li:nth-child(1) > a');
  await page.waitFor(1000);
  await page.click('#search-results > div.search-state.clearfix.bottom > div.limit > a:nth-child(3) > span');
  await page.waitFor(500);

  // Click Next in Pagination
  // await page.click('li.next-page.paginate.last-item > a > span > span');

  // Wait til there's no more pagination
  // await page.waitForFunction(() => !document.querySelector('#search-results > div.search-state.clearfix.top > div.paginate-results > ul > li.next-page.paginate.last-item > a > span'));
  // console.log('no more pagination')

  await page.waitFor(2000);

  const resultDetails = await page.evaluate(() => document.querySelector('#search-results > div.search-state.clearfix.top > div.advert-counter.search-info').innerText);
  let numberOfResults = resultDetails.split(/(\s+)/);
  numberOfResults = numberOfResults[4];
  console.log(`${numberOfResults} results`);
  let numberScraped = 0;
  let allData = [];

  if (numberOfResults > 30) {
    while (numberScraped <= (numberOfResults / 30)) {
      numberScraped++;
      console.log(numberScraped)
      let newPage = await getPageData();
      allData = [...allData, ...newPage];
    }
  } else {
    let newPage = await getPageData();
    allData = newPage;
  }
  function getPageData() {

    return page.evaluate(() => {
      let data = []; // Create an empty array
      let title = "test";
      let price = 0;
      let count = 0;
      // Loop through each proudct
      let elements = document.querySelectorAll('.advert-inner');
      for (var element of elements) { // Loop through each proudct
        count++;
        title = element.childNodes[5].children[0].innerText.replace(/^\s+|\s+$/g, '');
        year = element.childNodes[5].children[1].innerText.replace(/^\s+|\s+$/g, '');
        extra = element.childNodes[5].children[2].innerText.replace(/^\s+|\s+$/g, '');
        price = element.childNodes[7].children[0].innerText.replace(/^\s+|\s+$/g, '');
        priceNumber = price.replace(/[^0-9.-]+/g, "");

        data.push({ count, title, price: priceNumber, year, extra }); // Push an object with the data onto our array
      }
      return data; // Return our data array
    });

  }


  // let priceArray = allData.map(car => car.price).sort();
  let priceArray = allData.map((car) => {
    console.log('here', car.price);
    return car.price
  });
  priceArray = priceArray.sort();
  priceArray = priceArray.filter((x) => {
    return x > 0 && x < 99999;
  });

  console.log('Prices: ' + priceArray);
  console.log(`${priceArray.length} cars`);

  let medianPrice = getMedian(priceArray);
  let averagePrice = getAverage(priceArray);

  function getMedian(priceArray) {
    var half = Math.floor(priceArray.length / 2);

    if (parseInt(priceArray.length) % 2) {
      console.log('media value is %2', priceArray[half]);
      return priceArray[half];
    }
    else {
      console.log('media value is NOT %2', parseInt(priceArray[half]), parseInt(priceArray[half - 1]), (priceArray[half - 1] + priceArray[half]));
      return ((parseInt(priceArray[half - 1]) + parseInt(priceArray[half])) / 2.0);
    }
  }

  function getAverage(priceArray) {
    var sum = 0;
    for (var i = 0; i < priceArray.length; i++) {
      sum += parseInt(priceArray[i], 10); //don't forget to add the base
    }

    return sum / priceArray.length;
  }

  console.log(`price range: ${priceArray[0]} - ${priceArray[priceArray.length - 1]}`);
  console.log(`median price: ${medianPrice}`);
  console.log(`average price: ${averagePrice}`);

  await page.screenshot({ path: `images/carzone-${carName}-${modelName}.png` });

  // let scrape = async () => {
  //   return 'test';
  // };
  // scrape().then((value) => {
  //   console.log(value); // Success!
  // });

  await browser.close();
}

console.log(url);
getPic(url);

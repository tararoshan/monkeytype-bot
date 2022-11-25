const puppeteer = require('puppeteer');

const wpm = 30; // change this as you'd like!
const NUM_WORDS = 30; // assumes there are 30 words (the default)
// multiplier to convert from minutes to milliseconds
const MIN_MILLISECOND = 60 * 1_000;
const typingDelay = NUM_WORDS / wpm * MIN_MILLISECOND;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    // ???
    if (interceptedRequest.isInterceptResolutionHandled()) return;
    if (interceptedRequest.url() == 'https://monkeytype.com/')
      interceptedRequest.continue();
    else interceptedRequest.abort(); // only intercept the monkeytype website
  });

  console.log("checkpoint 1");
  // Error: failed to find element matching selector "#words"
  const FULL_TEXT = await page.$eval('#words', el => el.innerText);
  console.log("checkpoint 2");
  await page.type('#words', FULL_TEXT.replace('\n', ' '), {delay: typingDelay});
  await browser.close();
})();

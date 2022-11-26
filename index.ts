import puppeteer from "puppeteer";

/* Final WPM, feel free to change it to your liking. */
const WORDS_PER_MIN = 107;
/* Assuming it's 30 words by default. */
const NUM_WORDS = 30;
const SECONDS_PER_MIN = 60;
const MILLISECONDS_PER_SECONDS = 1_000;

const TOTAL_MILLISECONDS = NUM_WORDS / WORDS_PER_MIN * SECONDS_PER_MIN * MILLISECONDS_PER_SECONDS;
console.log(TOTAL_MILLISECONDS);

/* Also assuming that the app will only let you type for 30 seconds. I do this
   because the app will stop allowing input after a while of stable WPM, so
   before you wouldn't be able to see the results screen for a while until all
   of the original words are typed. */
const MAX_SECONDS = 30;

(async () => {
  const browser = await puppeteer.launch({
    /* To watch puppeteer in real-time. */
    headless: false,
    /* So that the page fits the window. */
    defaultViewport: null
  });
  const page = await browser.newPage();

  /* The options NEED the networkidle{0, 2} param to function properly. */
  await page.goto("https://monkeytype.com/", {waitUntil: "networkidle2"});
  /* Click "Reject All" cookies button. */
  await page.click('.rejectAll');
  
  const FULL_TEXT = await page.$eval('#words', el => el.innerText);

  const OUTPUT = FULL_TEXT.replaceAll('\n', ' ');
  console.log(`outputting (${OUTPUT})`);

  const MILLISECONDS_PER_LETTER = TOTAL_MILLISECONDS / OUTPUT.length;
  console.log(MILLISECONDS_PER_LETTER);
  const FINAL_LEN = MAX_SECONDS * MILLISECONDS_PER_SECONDS / MILLISECONDS_PER_LETTER;
  console.log(FINAL_LEN);

  await page.type('#words', OUTPUT, {delay: MILLISECONDS_PER_LETTER});
  console.log("done")
})();

// TODO run out of words after a certain length/count
import puppeteer from "puppeteer";

const MILLISECONDS_PER_SECOND = 1_000;
const SECONDS_PER_MIN = 60;
const NUM_MINUTES = 0.5;
const TOTAL_MILLISECONDS = MILLISECONDS_PER_SECOND * SECONDS_PER_MIN * NUM_MINUTES;
const MILLISECONDS_PER_MIN = MILLISECONDS_PER_SECOND * SECONDS_PER_MIN;
/* For the 30-second typing test (default), there are 100 words to type. */
const NUM_WORDS = 100;

/* Final WPM, feel free to change it to your liking! It'll be a little off. */
const USER_WPM = 100; // CHANGE THIS VALUE!! :)

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
  
  /* Get the first batch of 100 words to type. */
  var curText: String = await page.$eval('#words', elem => elem.innerText);
  curText = curText.replaceAll('\n', ' ');

  const WORDS_PER_CHAR = NUM_WORDS / curText.length;
  console.log('words per char: ' + WORDS_PER_CHAR);
  /* The number of characters we should aim to type to get the desired WPM. */
  const TARGET_NUM_CHAR = (TOTAL_MILLISECONDS * USER_WPM) / (MILLISECONDS_PER_MIN * WORDS_PER_CHAR); 
  console.log('target num char: ' + TARGET_NUM_CHAR);
  /* Get the delay for each character. */
  var MILLISECONDS_PER_LETTER = TOTAL_MILLISECONDS / TARGET_NUM_CHAR;
  console.log('milliseconds per letter: ' + MILLISECONDS_PER_LETTER);
  /* Reduce the delay by a bit -- I've noticed that the WPM is off, even with all of these
     calculations. Reader, please let me know if you see an issue here, but I haven't yet figured
     out why the WPM is consistently below the target WPM, even after re-doing my math. Thanks! */
  MILLISECONDS_PER_LETTER /= 1.3;
  console.log(`\noutputting the following:\n (${curText})\n length: ${curText.length}`);
  /* In case we need to type the next batch of words, figure out where we left off from (the
     starting words for each batch changes. The choice of 15 is arbitrary. */
  var futurePattern = curText.substring(curText.length - 15, curText.length);
  
  /* Wait for a second so that we don't start typing too fast for monkeytype. */
  setTimeout(async () => {
    let charIndex: number = 0;
    
    while (await page.$eval('#miniTimerAndLiveWpm', elem => elem.children[0].innerHTML != '0')) {
      await page.type('#words', curText.charAt(charIndex), {delay: MILLISECONDS_PER_LETTER});
      /* Uncomment below for debugging, otherwise spams the console. */
      // console.log(`typing ${curText.charAt(charIndex)}, which is at index ${charIndex}`);
      charIndex++;
      /* Figure out if we need the next batch of words. */
      if (charIndex == curText.length) {
        curText = await page.$eval('#words', elem => elem.innerText);
        curText = curText.replaceAll('\n', ' ');
        console.log(`\nnew text: \n (${curText})\n length: ${curText.length}`);
        console.log(`number of words: ${curText.split(' ').length}`);
        charIndex = curText.search(futurePattern) + futurePattern.length;
        // console.log(`cur word: ${curText.substring(charIndex, charIndex + 6)}`);  // debugging
        /* Setting up for next batch, if needed. */
        futurePattern = curText.substring(curText.length - 15, curText.length);
      }
    }
  }, MILLISECONDS_PER_SECOND);
})();

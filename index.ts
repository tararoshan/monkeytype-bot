import puppeteer from "puppeteer";

const MILLISECONDS_PER_SECOND = 1_000;
const SECONDS_PER_MIN = 60;
const NUM_MINUTES = 0.5;
const TOTAL_MILLISECONDS = MILLISECONDS_PER_SECOND * SECONDS_PER_MIN * NUM_MINUTES;
const MILLISECONDS_PER_MIN = MILLISECONDS_PER_SECOND * SECONDS_PER_MIN;
/* For the 30-second typing test (default), there are 100 words to type. */
const NUM_WORDS = 100;

/* Final WPM, feel free to change it to your liking! */
const USER_WPM = 230; // CHANGE THIS VALUE!!

/* TODO this calculation is still wrong LOL */
console.log('total milliseconds ' + TOTAL_MILLISECONDS);

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
  console.log('words per char ' + WORDS_PER_CHAR);
  const TARGET_NUM_CHAR = (TOTAL_MILLISECONDS * USER_WPM) / (MILLISECONDS_PER_MIN * WORDS_PER_CHAR); 
  console.log('target num char ' + TARGET_NUM_CHAR);
  var MILLISECONDS_PER_LETTER = TOTAL_MILLISECONDS / TARGET_NUM_CHAR;
  console.log('milliseconds per letter ' + MILLISECONDS_PER_LETTER);
  MILLISECONDS_PER_LETTER /= 1.5;

  console.log(`outputting\n (${curText})\n length: ${curText.length}`);
  var futurePattern = curText.substring(curText.length - 30, curText.length);
  
  
  /* Wait for a second so that we don't start typing too fast for monkeytype. */
  setTimeout(async () => {
    let charIndex: number = 0;
    
    while (await page.$eval('#miniTimerAndLiveWpm', elem => elem.children[0].innerHTML != '0')) {
      // type a character
      await page.type('#words', curText.charAt(charIndex), {delay: MILLISECONDS_PER_LETTER});
      // console.log(`typing ${curText.charAt(charIndex)}, which is at index ${charIndex}`);
      charIndex++;
      // figure out if we need the next batch of words
      if (charIndex == curText.length) {
        console.log('need to get next batch of words!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log(`old text: (${curText})\n`);
        curText = await page.$eval('#words', elem => elem.innerText);
        console.log(`number of words: ${curText.split('\n').length}`)
        curText = curText.replaceAll('\n', ' ');
        console.log(`new text: (${curText})\n with length ${curText.length}`)
        charIndex = curText.search(futurePattern) + futurePattern.length;
        futurePattern = curText.substring(curText.length - 30, curText.length);
        console.log(`cur word: ${curText.substring(charIndex, charIndex + 6)}`);
      }
      console.log(charIndex);
    }
  }, MILLISECONDS_PER_SECOND);

  console.log('base calculations done.');
})();

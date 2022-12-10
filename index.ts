import puppeteer from "puppeteer";

/* Final WPM, feel free to change it to your liking! */
const WORDS_PER_MIN = 400;
/* For the 30-second typing test (default), there are 100 words to type. */
const NUM_WORDS = 100;
const SECONDS_PER_MIN = 60;
const MILLISECONDS_PER_SECONDS = 1_000;

/* TODO this calculation is still wrong LOL */
const TOTAL_MILLISECONDS = NUM_WORDS * MILLISECONDS_PER_SECONDS * SECONDS_PER_MIN / WORDS_PER_MIN;
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
  const FULL_TEXT = await page.$eval('#words', elem => elem.innerText);

  // FOR DEBUGGING
  const OUTPUT = FULL_TEXT.replaceAll('\n', ' ');
  console.log(`outputting\n (${OUTPUT})\n length: ${OUTPUT.length}`);
  var futurePattern = OUTPUT.substring(OUTPUT.length - 30, OUTPUT.length);

  const MILLISECONDS_PER_LETTER = TOTAL_MILLISECONDS / OUTPUT.length;
  console.log('milliseconds per letter ' + MILLISECONDS_PER_LETTER);

  /* Wait for a second so that we don't start typing too fast for monkeytype. */
  setTimeout(async () => {
    await page.type('#words', OUTPUT, {delay: MILLISECONDS_PER_LETTER});
    console.log("done typing first set of words");
    /* Figure out the next set of words, if needed. The WPM may cause more words to appear after the
       initial 100. */
    var curText;
    while (curText = await page.$eval('#words', elem => elem.innerText)) {
      console.log('detected more text to type');
      curText = curText.replaceAll('\n', ' ');
      await console.log(`current text: (${curText})`);
      var startLen = curText.search(futurePattern) + futurePattern.length;
      console.log(`new input: (${curText.substring(startLen, curText.length)})`)
      await page.type('#words',
                curText.replaceAll('\n', ' ').substring(startLen, curText.length),
                {delay: MILLISECONDS_PER_LETTER}
      );
      await console.log('finished typing another set.');
      startLen = await curText.length;
      futurePattern = curText.substring(curText.length - 30, curText.length);
    }
  }, MILLISECONDS_PER_SECONDS);

  /* TODO there's still the issue of after 30 seconds, we're still typing. Is there a function that
     can stop puppetteer from typing? I could do a setTimeout() for that. */
  
  console.log('base calculations done.');
})();

import puppeteer from "puppeteer";

// const wpm : number = 70; // change this as you'd like!
// const NUM_WORDS : number = 30; // assumes there are 30 words (the default)
// // multiplier to convert from minutes to milliseconds
// const MIN_MILLISECOND = 60 * 1_000;
// const typingDelay = NUM_WORDS / wpm * MIN_MILLISECOND;
// console.log({typingDelay});

// 70 words    1 minute    1000 seconds
// minutes    60 seconds   1 millisecond

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  console.log("checkpoint 0");
  await page.goto("https://monkeytype.com/", {waitUntil: ["domcontentloaded", "load", "networkidle0", "networkidle2"]});
  console.log("checkpoint 1");
  // Error: failed to find element matching selector "#words"
  const FULL_TEXT = await page.$eval('#words', el => el.innerText);
  console.log("checkpoint 2");
  const OUTPUT = FULL_TEXT.replaceAll('\n', ' ');
  console.log(`outputting (${OUTPUT})`);
  await page.type('#words', OUTPUT, {delay: 100});
  // await browser.close();
  console.log("done")
})();


// TODO automatically reject all
// TODO extra keypresses at the end? get rid of that space
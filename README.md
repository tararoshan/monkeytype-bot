# monkeytype-bot
A bot that lets you have any wpm on [monkeytype.com](monkeytype.com)!

## To run
To run, type `npm run typetest`, the shortcut I defined in package.json for `npx ts-node index.ts`.

## To recreate
To recreate this project, use [Puppeteer](https://pptr.dev/) and inspect the webpage of the typing
test you'd like to mess with. I'd recommend starting the test and then typing `debugger` into the
console of the inspector, which pauses the page. From there, you can look at the inner text of the
elements on the page using `document.querySelector()`, etc. This is what `page.$()` does in
Puppeteer! For more information about Puppeteer's functions, check out their
[guide](https://pptr.dev/) and feel free to reference my comments & code in index.ts! Have fun!

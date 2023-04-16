# Puppeteer Cheatsheet

### Skip fetching images


Wait for random seconds
```js
const TwoToFiveSeconds = (Math.floor(Math.random() * 2) + 2) * 1000;

await page.waitForTimeout(TwoToFiveSeconds);
```


Greatly speeds up the automation especially in e-commerce sites with shit ton of images.

```js
// Limit requests 
await page.setRequestInterception(true); 
page.on('request', async (request) => { 
  if (request.resourceType() == 'image') { 
    await request.abort(); 
  } else { 
    await request.continue(); 
  } 
}); 
```

### Auto scroll part by part  to the end of the page
```js
async function autoScroll(page){
await page.evaluate(async () => {
    await new Promise((resolve) => {
        var totalHeight = 0;
        var distance = 100;
        var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if(totalHeight >= scrollHeight - window.innerHeight){
                clearInterval(timer);
                resolve();
            }
        }, 100);
    });
});
}
```
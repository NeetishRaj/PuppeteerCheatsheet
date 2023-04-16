# Puppeteer Cheatsheet



### Wait for random seconds
```js
const TwoToFiveSeconds = (Math.floor(Math.random() * 2) + 2) * 1000;

await page.waitForTimeout(TwoToFiveSeconds);
```


### Skip fetching images
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

### Chrome console scraping to copy-clipboard
```js
const list = document.querySelectorAll('a');
const final_data = [];
for(let item of list) {
    final_data.push(item.href);
}
window.final_data_text = JSON.stringify(final_data);
window.final_data_text += ',';
console.log(window.final_data_text);


// To copy automatically
window.copy_input = document.createElement('input');
window.copy_input.setAttribute('type', 'text');

let copy_button = document.createElement('button');
copy_button.textContent = "Copy the Shit";
copy_button.style.width = '500px';
copy_button.style.height = '200px';
copy_button.style.backgroundColor = "black";
copy_button.style.color = "white";
document.body.prepend(copy_button);

copy_button.onclick = copy_text

function copy_text() {
	window.copy_input.value = window.final_data_text;

	window.copy_input.select();
	window.copy_input.setSelectionRange(0, window.copy_input.value.length)
	navigator.clipboard.writeText(window.copy_input.value);
}
```
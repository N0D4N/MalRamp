# MalRamp
MyAnimeList random anime/manga picker.

This userscript helps you to pick random anime or manga from user's list by simply pressing button.
# Features
- [x] Supports both animelist and mangalist;
- [x] Supports classic and modern design;
- [x] Supports querying by status, title etc;
- [x] Supports custom list design (custom CSS);
- [x] Hotkey/shortcut support;

# Installation

1. Make sure that your [browser supports async functions](https://caniuse.com/#feat=async-functions) (almost all modern browsers do it) as this script relies on using them;

2. Install browser extension for managing userscripts, the recommended one is [Tampermonkey](https://www.tampermonkey.net/), however, the other ones should work too.

3. Copy the userscript from [userscript.js](/UserScript.js) and add it to your userscripts in extension.

# Usage
If list has modern design, button will appear at the bottom of the floating menu on the left side and will look like **'R'** letter.

If list has classic design, button will appear at the top of the page and will look like sign **'Random'**.

Notice, if list have modern design and have 300+ titles, even after querying by status and so on, there will be a bit of delay between clicking button and actually opening random anime/manga from list, that depends on size of the list, as script need to get other titles, not displayed on page, by getting them from `https://myanimelist.net/{listtype}list/{username}/load.json?{query}`.

## Custom list design/Custom CSS
You can change the look of the buttons by defining custom CSS for your list, or editing the script directly, so changes will appear for all lists of whatever user you will visit.
If you want to make changes only in your list you should use [custom CSS](https://myanimelist.net/forum/?topicid=1499059). 
For modern list design:
- "Box" for button and the text is available with id `MalRampButton`;
- "Icon" is available with id `MalRampButtonIcon`;
- "Text" is available with id `MalRampButtonText`;

For classic design: 
- "Button" is available with id `MalRampButton`;
### Remove button from page
If button doesn't display correctly in your list, because of your custom CSS or some other reason, you can simply put 
```css
#MalRampButton{
  display: none;
}
```
in your custom CSS, as this will remove button from screen, however you still will be able to use script via hotkey.

## Hotkey
You can use MalRamp even without using a mouse! If button is nowhere to be found due to user's custom CSS or if you just like using key shortcuts instead of mouth - you can use **`Ctrl`**+**`Alt`**+**`R`** hotkey for opening random anime/manga.
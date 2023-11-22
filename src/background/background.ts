// eslint-disable-next-line @typescript-eslint/no-unused-vars
chrome.browserAction.onClicked.addListener(function(_tab) {
    chrome.tabs.executeScript({
        file: "dist/content/content.js"
    });
});

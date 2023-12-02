chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "id": "dbAnyliseText",
        "title": "Debate Master: anylise",
        "contexts": ["selection"]
    });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "dbAnyliseText") {
        if (tab && tab.id) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id, allFrames: true },
                files: ['dist/content/content.js'],
            });
        }
    }
});


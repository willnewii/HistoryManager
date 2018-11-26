//跳转至目标页面
chrome.tabs.create({
    selected: true,
    url: chrome.extension.getURL('index.html')
});
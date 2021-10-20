browser.browserAction.onClicked.addListener((tab) => {
  browser.tabs.executeScript(
    tab.id,{
    file: "/popup/content-script.js"
  });
});
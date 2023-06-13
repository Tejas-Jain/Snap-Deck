chrome.action.onClicked.addListener((tab)=>{
  chrome.tabs.sendMessage(tab.id,"toggle");
});
chrome.runtime.onInstalled.addListener(()=>{window.open("snap-desk.github.io", "_blank");});
chrome.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLSeUxkwnYOtWYucPvbgkQ2BwV2R9o1BaDPKJZnRVv47g2UdpTA/viewform")

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    showReadme();
  }
});

function showReadme() {
  chrome.tabs.create({ url: 'https://snap-desk.github.io' });
}
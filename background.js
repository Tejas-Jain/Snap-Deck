chrome.action.onClicked.addListener(async ()=>{
  try{
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, "toggle");
    console.log(response);
  }
  catch(err){
    // console.error(err);
  }
});

chrome.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLSeUxkwnYOtWYucPvbgkQ2BwV2R9o1BaDPKJZnRVv47g2UdpTA/viewform")

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    showReadme();
  }
});

function showReadme() {
  chrome.tabs.create({ url: 'https://snapdesk.softo.tech' });
}
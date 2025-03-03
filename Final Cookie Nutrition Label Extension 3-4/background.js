chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCookies") {
    // Use chrome.cookies.getAll to retrieve cookies for the specified URL
    chrome.cookies.getAll({ url: request.url }, (cookies) => {
      sendResponse({ cookies });
    });
    return true; // Indicates that the response is asynchronous
  }
});


// This opens the extension as a full HTML new tab everytime you open a website that is not already open in another tab
// This feature was meant to open the extension automatically when you open a new, previously unvisited website 
// but Chrome does not allow extensions to open up programmatically

// let openedWebsites = new Set();
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === "complete" && tab.url) {
//     let url = new URL(tab.url);
//     let hostname = url.hostname; // Extract website domain (e.g., tinder.com)

//     if (!openedWebsites.has(hostname)) {
//       openedWebsites.add(hostname); // Mark website as opened

//       chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });

//       // Remove website from the set when all tabs of it are closed
//       chrome.tabs.onRemoved.addListener(() => {
//         chrome.tabs.query({}, (tabs) => {
//           let activeHosts = new Set(tabs.map(t => new URL(t.url).hostname));
//           openedWebsites = new Set([...openedWebsites].filter(site => activeHosts.has(site)));
//         });
//       });
//     }
//   }
// });

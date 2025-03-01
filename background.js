chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCookies") {
    chrome.cookies.getAll({ url: request.url }, (cookies) => {
      const categorizedCookies = categorizeCookies(cookies, request.url);
      sendResponse(categorizedCookies);
    });
    return true; // Keep the message channel open for asynchronous response
  }
});

function categorizeCookies(cookies, tabUrl) {
  const categories = {
    Analytics: [],
    Functional: [],
    Preferences: [],
    Marketing: []
  };
  
  let firstPartyCount = 0;
  let thirdPartyCount = 0;

  cookies.forEach(cookie => {
    const category = getCookieCategory(cookie);
    categories[category].push(cookie);

    if (isThirdPartyCookie(cookie, tabUrl)) {
      thirdPartyCount++;
    } else {
      firstPartyCount++;
    }
  });

  return { categories, firstPartyCount, thirdPartyCount };
}

function getCookieCategory(cookie) {
  if (cookie.name.toLowerCase().includes('analytics') || cookie.name.toLowerCase().includes('ga_')) {
    return 'Analytics';
  } else if (cookie.httpOnly || cookie.secure || cookie.name.toLowerCase().includes('session')) {
    return 'Functional';
  } else if (cookie.name.toLowerCase().includes('pref') || cookie.name.toLowerCase().includes('lang')) {
    return 'Preferences';
  } else if (cookie.name.toLowerCase().includes('ad') || cookie.name.toLowerCase().includes('track')) {
    return 'Marketing';
  } else {
    return 'Functional'; // Default to Functional if unknown
  }
}

function isThirdPartyCookie(cookie, tabUrl) {
  const tabDomain = new URL(tabUrl).hostname;
  return !cookie.domain.includes(tabDomain);
}


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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCookies") {
    chrome.cookies.getAll({ url: request.url }, (cookies) => {
      sendResponse({ cookies });
    });
    return true;
  }
});

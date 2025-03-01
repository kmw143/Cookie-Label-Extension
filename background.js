chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCookies") {
    chrome.cookies.getAll({ url: request.url }, (cookies) => {
      sendResponse({ cookies: cookies || [] });
    });
    return true; // Keeps the message channel open for asynchronous response
  }
});

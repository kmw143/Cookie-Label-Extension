chrome.runtime.sendMessage({ action: "getCookies", url: window.location.href }, (response) => {
  Object.entries(response).forEach(([category, cookies]) => {
    console.log(`${category} Cookies: ${cookies.length}`);
    cookies.forEach(cookie => {
      console.log(`Cookie: ${cookie.name}, Expires: ${new Date(cookie.expirationDate * 1000).toLocaleString()}`);
    });
  });
});

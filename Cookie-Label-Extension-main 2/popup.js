document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let url = tabs[0].url;
    chrome.runtime.sendMessage({ action: "getCookies", url: url }, (response) => {
      displayCookies(response.cookies);
    });
  });
});

function displayCookies(cookies) {
  const container = document.getElementById("cookie-list");
  container.innerHTML = "";
  
  if (!cookies.length) {
    container.innerHTML = "<p>No cookies found.</p>";
    return;
  }
  
  cookies.forEach((cookie) => {
    let category = categorizeCookie(cookie);
    let div = document.createElement("div");
    div.classList.add("cookie-item", category);
    div.innerHTML = `
      <h3>${cookie.name}</h3>
      <p>Category: ${category}</p>
      <p>Domain: ${cookie.domain}</p>
      <p>Expires: ${new Date(cookie.expirationDate * 1000).toLocaleString()}</p>
    `;
    container.appendChild(div);
  });
}

function categorizeCookie(cookie) {
  // Same categorization function as in content.js
}


document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let url = tabs[0].url;
    chrome.runtime.sendMessage({ action: "getCookies", url: url }, (response) => {
      if (response && response.cookies && Array.isArray(response.cookies)) {
        displayCookies(response.cookies);
      } else {
        console.error("No cookies found or response is invalid.");
        document.getElementById("cookie-list").innerHTML = "<p>No cookies found.</p>";
      }
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
      <p>Expires: ${new Date(cookie.expirationDate * 1000).toLocaleString()}</p>
      <p>Category: ${category}</p>
    `;
    container.appendChild(div);
  });
}

function categorizeCookie(cookie) {
  if (cookie.name.toLowerCase().includes("analytics") || cookie.name.toLowerCase().includes("ga_")) return "Analytics";
  if (cookie.httpOnly || cookie.secure || cookie.name.toLowerCase().includes("session")) return "Functional";
  if (cookie.name.toLowerCase().includes("pref") || cookie.name.toLowerCase().includes("lang")) return "Preferences";
  if (cookie.name.toLowerCase().includes("ad") || cookie.name.toLowerCase().includes("track")) return "Marketing";
  return "Unknown";
}



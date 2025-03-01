document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let url = tabs[0].url;
    chrome.runtime.sendMessage({ action: "getCookies", url: url }, (response) => {
      if (response && response.cookies) {
        displayCookies(response.cookies);
      } else {
        console.error("No cookies found or response is undefined");
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
  if (cookie.httpOnly || cookie.secure) return "functional";
  if (cookie.name.toLowerCase().includes("analytics") || cookie.name.toLowerCase().includes("ga_")) return "analytics";
  if (cookie.name.toLowerCase().includes("pref") || cookie.name.toLowerCase().includes("lang")) return "preferences";
  if (cookie.name.toLowerCase().includes("ad") || cookie.name.toLowerCase().includes("track")) return "marketing";
  return "unknown";
}



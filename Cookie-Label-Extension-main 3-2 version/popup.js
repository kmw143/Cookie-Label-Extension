document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;

    // Request cookies from the background script
    chrome.runtime.sendMessage({ action: "getCookies", url: url }, (response) => {
      displayCookies(response.cookies);
    });
  });
});

function displayCookies(cookies) {
  const container = document.getElementById("cookie-list");
  container.innerHTML = "";

  if (!cookies || !cookies.length) {
    container.innerHTML = "<p>No cookies found.</p>";
    return;
  }

  const categories = {
    functional: { firstParty: 0, thirdParty: 0, cookies: [] },
    analytics: { firstParty: 0, thirdParty: 0, cookies: [] },
    preferences: { firstParty: 0, thirdParty: 0, cookies: [] },
    marketing: { firstParty: 0, thirdParty: 0, cookies: [] },
    unknown: { firstParty: 0, thirdParty: 0, cookies: [] },
  };

  cookies.forEach((cookie) => {
    const category = categorizeCookie(cookie);
    const isFirstParty = isFirstPartyCookie(cookie);
    categories[category].cookies.push(cookie);

    if (isFirstParty) {
      categories[category].firstParty++;
    } else {
      categories[category].thirdParty++;
    }
  });

  for (const [category, data] of Object.entries(categories)) {
    if (data.cookies.length > 0) {
      const categoryDiv = document.createElement("div");
      categoryDiv.innerHTML = `
        <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
        <p>First-party: ${data.firstParty}, Third-party: ${data.thirdParty}</p>
      `;
      data.cookies.forEach((cookie) => {
        const cookieDiv = document.createElement("div");
        cookieDiv.classList.add("cookie-item", category);
        cookieDiv.innerHTML = `
          <strong>Expires:</strong> ${
            cookie.expirationDate
              ? new Date(cookie.expirationDate * 1000).toLocaleString()
              : "Session"
          }
        `;
        categoryDiv.appendChild(cookieDiv);
      });
      container.appendChild(categoryDiv);
    }
  }
}

function isFirstPartyCookie(cookie) {
  // Check if the cookie domain matches the current tab's domain
  const currentDomain = new URL(window.location.href).hostname;
  return cookie.domain.includes(currentDomain);
}

function categorizeCookie(cookie) {
  const name = cookie.name.toLowerCase();
  const domain = cookie.domain.toLowerCase();

  if (
    name.includes("session") ||
    name.includes("auth") ||
    name.includes("token") ||
    name.includes("csrf")
  ) {
    return "functional";
  }

  if (
    name.includes("ga") ||
    name.includes("analytics") ||
    name.includes("stat") ||
    domain.includes("analytics")
  ) {
    return "analytics";
  }

  if (
    name.includes("pref") ||
    name.includes("setting") ||
    name.includes("theme")
  ) {
    return "preferences";
  }

  if (
    name.includes("ad") ||
    name.includes("track") ||
    name.includes("pixel") ||
    domain.includes("ad")
  ) {
    return "marketing";
  }

  return "unknown";
}

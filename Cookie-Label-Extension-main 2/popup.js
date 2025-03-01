// popup.js
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
  
  const categories = {
    functional: [],
    analytics: [],
    preferences: [],
    marketing: [],
    unknown: []
  };
  
  let firstPartyCookies = 0;
  let thirdPartyCookies = 0;
  
  cookies.forEach((cookie) => {
    let category = categorizeCookie(cookie);
    categories[category].push(cookie);
    
    // Count first-party and third-party cookies
    if (isFirstPartyCookie(cookie)) {
      firstPartyCookies++;
    } else {
      thirdPartyCookies++;
    }
  });
  
  // Display cookie count
  const countDiv = document.createElement("div");
  countDiv.innerHTML = `
    <h3>Cookie Count</h3>
    <p>First-party cookies: ${firstPartyCookies}</p>
    <p>Third-party cookies: ${thirdPartyCookies}</p>
  `;
  container.appendChild(countDiv);
  
  // Display cookies by category (existing code)
  for (const [category, cookieList] of Object.entries(categories)) {
    if (cookieList.length > 0) {
      const categoryDiv = document.createElement("div");
      categoryDiv.innerHTML = `<h3>${category.charAt(0).toUpperCase() + category.slice(1)} Cookies (${cookieList.length})</h3>`;
      cookieList.forEach((cookie) => {
        const cookieDiv = document.createElement("div");
        cookieDiv.classList.add("cookie-item", category);
        cookieDiv.innerHTML = `
          <p><strong>Name:</strong> ${cookie.name}</p>
          <p><strong>Domain:</strong> ${cookie.domain}</p>
          <p><strong>Expires:</strong> ${new Date(cookie.expirationDate * 1000).toLocaleString()}</p>
        `;
        categoryDiv.appendChild(cookieDiv);
      });
      container.appendChild(categoryDiv);
    }
  }
}

function isFirstPartyCookie(cookie) {
  // Compare the cookie domain with the current tab's domain
  // This is a simplified check and might need to be adjusted based on your specific requirements
  return cookie.domain === window.location.hostname;
}


function categorizeCookie(cookie) {
  const name = cookie.name.toLowerCase();
  const domain = cookie.domain.toLowerCase();

  if (name.includes('session') || name.includes('auth') || name.includes('token') || name.includes('csrf')) {
    return "functional";
  }
  if (name.includes('ga') || name.includes('analytics') || name.includes('stat') || domain.includes('analytics')) {
    return "analytics";
  }
  if (name.includes('pref') || name.includes('setting') || name.includes('theme')) {
    return "preferences";
  }
  if (name.includes('ad') || name.includes('track') || name.includes('pixel') || domain.includes('ad')) {
    return "marketing";
  }
  return "unknown";
}


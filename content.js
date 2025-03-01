chrome.runtime.sendMessage({ action: "getCookies", url: window.location.href }, (response) => {
  if (response && response.cookies && Array.isArray(response.cookies)) {
    response.cookies.forEach((cookie) => {
      console.log(`Cookie: ${cookie.name}, Category: ${categorizeCookie(cookie)}`);
    });
  } else {
    console.error("No cookies found or response is invalid.");
  }
});

function categorizeCookie(cookie) {
  // Categorize cookies into Analytics, Functional, Preferences, and Marketing
  if (cookie.name.toLowerCase().includes("analytics") || cookie.name.toLowerCase().includes("ga_")) {
    return "Analytics"; // Cookies used for tracking website performance and user behavior
  }
  if (cookie.httpOnly || cookie.secure || cookie.name.toLowerCase().includes("session")) {
    return "Functional"; // Cookies critical to maintaining the website's core functions
  }
  if (cookie.name.toLowerCase().includes("pref") || cookie.name.toLowerCase().includes("lang")) {
    return "Preferences"; // Cookies that remember user preferences
  }
  if (cookie.name.toLowerCase().includes("ad") || cookie.name.toLowerCase().includes("track")) {
    return "Marketing"; // Cookies used for tracking and targeting ads
  }
  return "Unknown"; // Default category if no match is found
}

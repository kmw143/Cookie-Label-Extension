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
  if (cookie.name.toLowerCase().includes("analytics") || cookie.name.toLowerCase().includes("ga_")) return "Analytics";
  if (cookie.httpOnly || cookie.secure || cookie.name.toLowerCase().includes("session")) return "Functional";
  if (cookie.name.toLowerCase().includes("pref") || cookie.name.toLowerCase().includes("lang")) return "Preferences";
  if (cookie.name.toLowerCase().includes("ad") || cookie.name.toLowerCase().includes("track")) return "Marketing";
  return "Unknown";
}

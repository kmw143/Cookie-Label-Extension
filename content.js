chrome.runtime.sendMessage({ action: "getCookies", url: window.location.href }, (response) => {
  response.cookies.forEach((cookie) => {
    console.log(`Cookie: ${cookie.name}, Category: ${categorizeCookie(cookie)}`);
  });
});

function categorizeCookie(cookie) {
  if (cookie.name.includes("session") || cookie.name.includes("auth") || cookie.name.includes("token")) {
    return "Functional";
  }
  if (cookie.name.includes("ga_") || cookie.name.includes("analytics") || cookie.name.includes("_utm")) {
    return "Analytics";
  }
  if (cookie.name.includes("pref") || cookie.name.includes("theme") || cookie.name.includes("lang")) {
    return "Preferences";
  }
  if (cookie.name.includes("ad") || cookie.name.includes("track") || cookie.name.includes("market")) {
    return "Marketing";
  }
  return "Other";
}

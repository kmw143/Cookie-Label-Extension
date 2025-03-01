chrome.runtime.sendMessage({ action: "getCookies", url: window.location.href }, (response) => {
  response.cookies.forEach((cookie) => {
    console.log(`Cookie: ${cookie.name}, Category: ${categorizeCookie(cookie)}`);
  });
});

function categorizeCookie(cookie) {
  if (cookie.httpOnly || cookie.secure) return "essential";
  if (cookie.domain.includes("analytics") || cookie.name.includes("ga_")) return "statistics";
  if (cookie.name.includes("session") || cookie.name.includes("lang")) return "functional";
  if (cookie.name.includes("ad") || cookie.name.includes("track")) return "marketing";
  return "unknown";
}

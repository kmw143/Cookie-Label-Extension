chrome.runtime.sendMessage({ action: "getCookies", url: window.location.href }, (response) => {
  response.cookies.forEach((cookie) => {
    console.log(`Cookie: ${cookie.name}, Category: ${categorizeCookie(cookie)}`);
  });
});

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

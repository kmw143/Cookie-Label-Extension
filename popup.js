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

  let stats = getCookieStats(cookies);

  Object.entries(stats).forEach(([category, data]) => {
    if (data.total > 0) {
      let div = document.createElement("div");
      div.classList.add("cookie-category");
      div.innerHTML = `
        <h3>${category} Cookies</h3>
        <p>Total: ${data.total}</p>
        <p>First-party: ${data.firstParty}</p>
        <p>Third-party: ${data.thirdParty}</p>
      `;
      container.appendChild(div);
    }
  });

  cookies.forEach(cookie => {
    let category = categorizeCookie(cookie);
    let div = document.createElement("div");
    div.classList.add("cookie-item", category.toLowerCase());
    div.innerHTML = `
      <h4>${cookie.name}</h4>
      <p>Category: ${category}</p>
      <p>Domain: ${cookie.domain}</p>
      <p>Expires: ${getExpirationInfo(cookie)}</p>
    `;
    container.appendChild(div);
  });
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

function getCookieStats(cookies) {
  let stats = {
    Functional: { total: 0, firstParty: 0, thirdParty: 0 },
    Analytics: { total: 0, firstParty: 0, thirdParty: 0 },
    Preferences: { total: 0, firstParty: 0, thirdParty: 0 },
    Marketing: { total: 0, firstParty: 0, thirdParty: 0 },
    Other: { total: 0, firstParty: 0, thirdParty: 0 }
  };

  cookies.forEach(cookie => {
    let category = categorizeCookie(cookie);
    stats[category].total++;
    if (cookie.domain.startsWith(".")) {
      stats[category].thirdParty++;
    } else {
      stats[category].firstParty++;
    }
  });

  return stats;
}

function getExpirationInfo(cookie) {
  if (!cookie.expirationDate) return "Session";
  let expirationDate = new Date(cookie.expirationDate * 1000);
  let now = new Date();
  let diff = expirationDate - now;
  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days > 365 ? "Over a year" : `${days} days`;
}

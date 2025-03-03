document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;

    // Request cookies from the background script
    chrome.runtime.sendMessage({ action: "getCookies", url: url }, (response) => {
      processCookies(response.cookies);
      
      // Update HTML with cookie info
      

    });
  });

  // Existing link click handlers...
  document.querySelectorAll(".link").forEach(link => {
    link.addEventListener("click", function (event) {
        console.log("clicked!");
        event.stopPropagation(); // Prevent card flip
        const targetId = this.getAttribute("data-target"); // Get target ID
        const hiddenDiv = document.getElementById(targetId);
        
        // Toggle visibility of the hidden div
        hiddenDiv.style.display = hiddenDiv.style.display === "block" ? "none" : "block";
    });
});

  // Add close button functionality
  document.querySelectorAll(".close-button").forEach(button => {
      button.addEventListener("click", function (event) {
          event.stopPropagation(); // Prevent card flip
          this.closest('.hidden-div').style.display = "none"; // Hide the div
      });
  });

  // Existing card click handlers...
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", function () {
        this.classList.toggle("flipped");
        console.log("flipped!");
        });
    });
});

function processCookies(cookies) {
  // Create object categories to keep track of # of first/third party, domains, and cookies
  const categories = {
    functional: { firstParty: 0, thirdParty: 0, cookies: [], firstPartyDomains: [], thirdPartyDomains: [] },
    analytics: { firstParty: 0, thirdParty: 0, cookies: [], firstPartyDomains: [], thirdPartyDomains: [] },
    preferences: { firstParty: 0, thirdParty: 0, cookies: [], firstPartyDomains: [], thirdPartyDomains: [] },
    marketing: { firstParty: 0, thirdParty: 0, cookies: [], firstPartyDomains: [], thirdPartyDomains: [] },
    unknown: { firstParty: 0, thirdParty: 0, cookies: [], firstPartyDomains: [], thirdPartyDomains: [] },
  };

  // If there are no cookies, run displayCookies (and show "No cookies found")
  if (!cookies || !cookies.length) {
    displayCookies(categories); // Call displayCookies even if no cookies are found
    return categories;
  }

  // For each cookie, get category + first/third party status and store this info in categories object
  cookies.forEach((cookie) => {
    const category = categorizeCookie(cookie);
    const isFirstParty = isFirstPartyCookie(cookie);
    categories[category].cookies.push(cookie);

    // Track first-party and third-party domains
    if (isFirstParty) {
      categories[category].firstParty++;
      if (!categories[category].firstPartyDomains.includes(cookie.domain)) {
        categories[category].firstPartyDomains.push(cookie.domain);
      }
    } else {
      categories[category].thirdParty++;
      if (!categories[category].thirdPartyDomains.includes(cookie.domain)) {
        categories[category].thirdPartyDomains.push(cookie.domain);
      }
    }
  });

  // Call displayCookies to display the categorized cookies
  displayCookies(categories);
  return categories; // Return the categories in case you need them later
}

function displayCookies(categories) {
  Object.keys(categories).forEach((category) => {
    const categoryData = categories[category];

    const totalCookies = categoryData.cookies.length;
    // Calculate the number of first-party and third-party cookies
    const firstPartyCount = categoryData.firstParty || 0;
    const thirdPartyCount = categoryData.thirdParty || 0;
    const partyStatus = totalCookies === 0 ? "N/A" : getPartyStatus(firstPartyCount, thirdPartyCount);
    const expirationStatus = totalCookies === 0 ? "N/A" : getExpirationStatus(categoryData.cookies);

    // Get the domains
    const firstPartyDomains = categoryData.firstPartyDomains;
    const thirdPartyDomains = categoryData.thirdPartyDomains;

    // Capitalize the first letter of the category to match the ID in HTML
    const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);

    // Get the corresponding card element by ID
    const card = document.getElementById(capitalizedCategory);
    if (!card) return; // Skip if no matching card is found

    // Update the card's data attributes dynamically
    card.setAttribute("data-active-cookies", totalCookies === 0 ? "N/A" : totalCookies);
    card.setAttribute("data-duration", expirationStatus);
    card.setAttribute("data-party", partyStatus);

    // Update the displayed text using the existing function
    updateCardInfo(capitalizedCategory);

    // Display the results
    console.log(`
      Category: ${category}
      # of cookies: ${totalCookies}
      Party: ${partyStatus}
      First-party domains: ${firstPartyDomains.join(", ") || "N/A"}
      Third-party domains: ${thirdPartyDomains.join(", ") || "N/A"}
      Duration: ${expirationStatus}
    `);
  });
}

// Function to update text content inside a card
function updateCardInfo(cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;

  const activeCookies = card.getAttribute("data-active-cookies") || "N/A";
  const duration = card.getAttribute("data-duration") || "N/A";
  const party = card.getAttribute("data-party") || "N/A";

  const activeCookiesSpan = card.querySelector(".active-cookies-text");
  const durationSpan = card.querySelector(".duration-text");
  const partySpan = card.querySelector(".party-text");

    // Update the text content, checking for N/A
    if (activeCookiesSpan) {
      activeCookiesSpan.textContent = activeCookies === "N/A" ? "Active cookies: 0" : `Active cookies: ${activeCookies}`;
    }

    if (durationSpan) {
        durationSpan.textContent = duration === "N/A" ? "Duration: N/A" : `Duration: ${duration}`;
    }

    if (partySpan) {
        partySpan.textContent = party === "N/A" ? "Includes: N/A" : `Includes: ${party} cookies`;
    }
}

// Get the party status (first, third, or both)
function getPartyStatus(firstPartyCount, thirdPartyCount) {
  if (firstPartyCount > 0 && thirdPartyCount > 0) {
    return "First & Third-party";
  }
  if (firstPartyCount > 0) {
    return "First-party";
  }
  if (thirdPartyCount > 0) {
    return "Third-party";
  }
  return "None";
}

// Get the list of first-party domains
function getFirstPartyDomains(cookies) {
  return cookies
    .filter(cookie => isFirstPartyCookie(cookie)) // Only first-party cookies
    .map(cookie => cookie.domain)
    .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
}

// Get the list of third-party domains
function getThirdPartyDomains(cookies) {
  return cookies
    .filter(cookie => !isFirstPartyCookie(cookie)) // Only third-party cookies
    .map(cookie => cookie.domain)
    .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
}

// Determine the expiration status of cookies
function getExpirationStatus(cookies) {
  if (!cookies.length) return "N/A"; // No cookies in the category

  let hasSessionCookies = false;
  let expirationDates = [];

  cookies.forEach((cookie) => {
    if (!cookie.expirationDate) {
      hasSessionCookies = true;
    } else {
      expirationDates.push(new Date(cookie.expirationDate * 1000));
    }
  });

  if (expirationDates.length === 0) {
    return "Session"; // All cookies are session-based
  }

  const latestExpiration = new Date(Math.max(...expirationDates.map(date => date.getTime())));

  if (hasSessionCookies) {
    return `Session & Persistent (Expiration: ${latestExpiration.toLocaleString()})`;
  }

  return `Persistent (Expiration: ${latestExpiration.toLocaleString()})`;
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

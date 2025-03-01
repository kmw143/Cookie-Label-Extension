document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let url = tabs[0].url;
    chrome.runtime.sendMessage({ action: "getCookies", url: url }, (response) => {
      if (response) {
        displayCookies(response);
      } else {
        console.error("No response received from background script.");
        document.getElementById("cookie-list").innerHTML = "<p>No cookies found.</p>";
      }
    });
  });
});

function displayCookies(response) {
  const container = document.getElementById("cookie-list");
  
  const { categories, firstPartyCount, thirdPartyCount } = response;

  // Display first-party and third-party counts
  container.innerHTML += `
    <h3>Cookie Overview</h3>
    <p>First-party cookies: ${firstPartyCount}</p>
    <p>Third-party cookies: ${thirdPartyCount}</p>
  `;

  // Display categorized cookies
  Object.entries(categories).forEach(([category, cookies]) => {
    let categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category");
    categoryDiv.innerHTML = `
      <h4>${category} Cookies (${cookies.length})</h4>
      <ul>
        ${cookies.map(cookie => `
          <li>
            <strong>${cookie.name}</strong>
            <p>Expires: ${new Date(cookie.expirationDate * 1000).toLocaleString()}</p>
          </li>
        `).join("")}
      </ul>
    `;
    container.appendChild(categoryDiv);
  });
}



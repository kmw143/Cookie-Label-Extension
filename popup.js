document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let url = tabs[0].url;
    chrome.runtime.sendMessage({ action: "getCookies", url: url }, (response) => {
      displayCookies(response);
    });
  });
});

function displayCookies(response) {
  const container = document.getElementById("cookie-list");
  container.innerHTML = "";
  
  const { categories, firstPartyCount, thirdPartyCount } = response;
  
  // Display first-party and third-party cookie counts
  const cookieCountDiv = document.createElement("div");
  cookieCountDiv.innerHTML = `
    <h2>Cookie Overview</h2>
    <p>First-party cookies: ${firstPartyCount}</p>
    <p>Third-party cookies: ${thirdPartyCount}</p>
  `;
  container.appendChild(cookieCountDiv);
  
  if (Object.values(categories).every(arr => arr.length === 0)) {
    container.innerHTML += "<p>No cookies found.</p>";
    return;
  }
  
  Object.entries(categories).forEach(([category, cookies]) => {
    let categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category");
    categoryDiv.innerHTML = `
      <h2>${category} Cookies (${cookies.length})</h2>
      <ul>
        ${cookies.map(cookie => `
          <li>
            <strong>${cookie.name}</strong>
            <p>Expires: ${new Date(cookie.expirationDate * 1000).toLocaleString()}</p>
          </li>
        `).join('')}
      </ul>
    `;
    container.appendChild(categoryDiv);
  });
}

  
  if (Object.values(categorizedCookies).every(arr => arr.length === 0)) {
    container.innerHTML = "<p>No cookies found.</p>";
    return;
  }
  
  Object.entries(categorizedCookies).forEach(([category, cookies]) => {
    let categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category");
    categoryDiv.innerHTML = `
      <h2>${category} Cookies (${cookies.length})</h2>
      <ul>
        ${cookies.map(cookie => `
          <li>
            <strong>${cookie.name}</strong>
            <p>Expires: ${new Date(cookie.expirationDate * 1000).toLocaleString()}</p>
          </li>
        `).join('')}
      </ul>
    `;
    container.appendChild(categoryDiv);
  });
}


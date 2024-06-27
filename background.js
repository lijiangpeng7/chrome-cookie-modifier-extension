// Function to modify cookies
function modifyCookies(details) {
  const url = new URL(details.url);

  details.cookies.forEach(cookie => {
    if (!cookie.secure || cookie.sameSite !== "no_restriction") {
      chrome.cookies.set({
        url: url.origin,
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        secure: true,
        sameSite: "no_restriction",
        expirationDate: cookie.expirationDate,
        storeId: cookie.storeId
      }, (modifiedCookie) => {
        if (chrome.runtime.lastError) {
          console.error(`Failed to set cookie: ${chrome.runtime.lastError}`);
        } else {
          console.log("Cookie modified successfully:", modifiedCookie);
        }
      });
    }
  });
}

// Listen for cookie changes
chrome.cookies.onChanged.addListener((changeInfo) => {
  if (!changeInfo.removed) {
    const cookie = changeInfo.cookie;
    if (!cookie.secure || cookie.sameSite !== "no_restriction") {
      const url = `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`;
      chrome.cookies.set({
        url: url,
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        secure: true,
        sameSite: "no_restriction",
        expirationDate: cookie.expirationDate,
        storeId: cookie.storeId
      }, (modifiedCookie) => {
        if (chrome.runtime.lastError) {
          console.error(`Failed to set cookie: ${chrome.runtime.lastError}`);
        } else {
          console.log("Cookie modified successfully:", modifiedCookie);
        }
      });
    }
  }
});

// Modify cookies when a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.cookies.getAll({ url: tab.url }, (cookies) => {
      modifyCookies({ url: tab.url, cookies });
    });
  }
});

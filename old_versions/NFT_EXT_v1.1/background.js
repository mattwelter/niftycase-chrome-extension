
try {
  importScripts('address.store.js', 'address.data.js');
} catch(err) {
  console.error(err);
}

(function() {
  "use strict";

  chrome.runtime.onInstalled.addListener(async (details) => {
    const currentVersion = chrome.runtime.getManifest().version;
    const previousVersion = details.previousVersion;
    const reason = details.reason;

    console.log(`Previous Version: ${previousVersion }`);
    console.log(`Current Version: ${currentVersion }`);
    console.log(reason);

    switch(reason) {
      // chrome_update", "shared_module_update
      case 'install':
      case 'update':
        await AddressStore.clearAddresses();
        for (const name in NAME_URL) {
          // console.log('insert:', NAME_URL[name], '<-', name);
          await AddressStore.setAddress(name, NAME_URL[name]);
        }
        break;
      default:
        break;
    }
  });

  chrome.webNavigation.onCommitted.addListener(details => {
    if (details.url
      && /^[^:/]+:\/\/[^/]*twitter\.[^/.]+\//.test(details.url)
      && ['reload', 'link', /* 'typed', 'generated' */].includes(details.transitionType))
    {
      chrome.webNavigation.onCompleted.addListener(function onComplete() {
        // console.log('nav comitted', details);
        chrome.webNavigation.onCompleted.removeListener(onComplete);
        chrome.tabs.sendMessage(details.tabId, {
          command: 'load',
          url: details.url
        });
      });
    }
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      // console.log('tab updated', changeInfo);
      chrome.tabs.sendMessage(tabId, {
        command: 'load',
        url: changeInfo.url
      });
    }
  });


  /*
   * "permissions": ["storage", "tabs", "webNavigation", "webRequest"],
   * "host_permissions": [
   *   "*://*.twitter.com/*"
   * ],
   */

  // chrome.webRequest.onCompleted.addListener((details) => {
  //     console.log(details);
  //     // chrome.tabs.sendMessage(details.tabId, {
  //     //   command: 'changed-theme'
  //     // });
  //   },
  //   {
  //     // urls: ['<all_urls>']
  //     urls: ['*://api.twitter.com/1.1/jot/client_event.json']
  //   },
  //   []
  // );


  console.log('- browser extension started');
  (async function() {
    const addresses = await AddressStore.getAddresses();
    for (const addr of addresses) {
      // delete older database entries to save space
      if (!addr.addr || addr.created_at < (Date.now() - 1000 * 60 * 60 * 24 * 7)) {
        // console.log('- delete:', addr.name);
        // await AddressStore.delAddress(addr.name);
      }
    }
  })();
})();

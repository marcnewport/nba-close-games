var enabled = false;
//listen for extension button click
chrome.browserAction.onClicked.addListener(function(tab) {
  //only run on watch.nba.com
  chrome.tabs.query({ 'active':true }, function (tabs) {
    var url = tabs[0].url;

    if (url.search('watch.nba') > -1) {
      chrome.tabs.insertCSS(null, { file:"css/manipulate.css" });

      //load options handler then our manipulation code
      chrome.tabs.executeScript(null, { file:"js/options.js" }, function() {
          chrome.tabs.executeScript(null, { file:"js/manipulate.js" });
      });

      // This should be an option
      if (enabled) {
        chrome.browserAction.setIcon({ path:"icons/icon-disabled.png" });
        enabled = false;
      }
      else {
        chrome.browserAction.setIcon({ path:"icons/icon.png" });
        enabled = true;
      }
    }
  });
});

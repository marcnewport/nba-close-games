//listen for extension button click
chrome.browserAction.onClicked.addListener(function(tab) {
  //load jquery, then load custom script
  chrome.tabs.executeScript(null, { file:"js/jquery.min.js" }, function() {
    chrome.tabs.executeScript(null, { file:"js/manipulate.js" });
  });
});

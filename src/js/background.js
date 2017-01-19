// var enabled = false;

//listen for extension button click
chrome.browserAction.onClicked.addListener(function(tab) {
  //only run on watch.nba.com
  chrome.tabs.query({ 'active':true }, function (tabs) {

    var url = tabs[0].url;

    if (url.search('watch.nba') > -1) {
      chrome.tabs.insertCSS(null, { file:"css/manipulate.css" });
      chrome.tabs.executeScript(null, { file:"js/manipulate.js" });

      // TODO : enable icon toggling
    //   if (enabled) {
    //     chrome.browserAction.setIcon({ path:"icons/icon-disabled.png" });
    //     enabled = false;
    //   }
    //   else {
        chrome.browserAction.setIcon({ path:"icons/icon.png" });
    //     enabled = true;
    //   }
    }
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    // Make a synchronous request
    // sendResponse callback does not work inside closures
    // var url = 'http://stats.nba.com/stats/boxscoresummaryv2/?GameID='+ request.gameId;
    var url = 'http://stats.nba.com/stats/playbyplayv2/?GameID='+ request.gameId +'&StartPeriod=0&EndPeriod=0';
    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, false);
    xhr.send();

    if (xhr.status === 200) {
        sendResponse(xhr.responseText);
    }
})

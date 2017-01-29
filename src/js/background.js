//listen for extension button click
chrome.browserAction.onClicked.addListener(function(tab) {
    //only run on watch.nba.com
    chrome.tabs.query({ 'active':true }, function (tabs) {

        var url = tabs[0].url;

        if (url.search('watch.nba') > -1) {

            // chrome.tabs.insertCSS(null, { file:"css/manipulate.css" });

            chrome.tabs.executeScript(null, { file:"js/utils.js" }, function() {
                chrome.tabs.executeScript(null, { file:"js/options.js" }, function() {
                    chrome.tabs.executeScript(null, { file:"js/manipulate.js" });
                });
            });
        }
    });
});



chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.enableIcon) {
        chrome.browserAction.setIcon({ path:"icons/icon.png" });
        return;
    }
    if (request.disableIcon) {
        chrome.browserAction.setIcon({ path:"icons/icon-disabled.png" });
        return;
    }

    // Make a synchronous request
    // var url = 'http://stats.nba.com/stats/boxscoresummaryv2/?GameID='+ request.gameId;
    var url = 'http://stats.nba.com/stats/playbyplayv2/?GameID='+ request.gameId +'&StartPeriod=0&EndPeriod=0';
    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, false);
    xhr.send();

    if (xhr.status === 200) {
        sendResponse(xhr.responseText);
    }
});

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

    var gameData = {};
    var gameId = request.gameId;
    var gameDate = request.gameDate;
    var gamePath = [
        request.gamePath.substring(0, 4),
        request.gamePath.substring(4, 6),
        request.gamePath.substring(6, 12),
        request.gamePath.substring(12)
    ].join('-');

    // // Make a synchronous request
    var pbp = 'http://stats.nba.com/stats/playbyplayv2/?GameID='+ gameId +'&StartPeriod=0&EndPeriod=0';
    // var boxscore = 'http://data.nba.net/data/10s/prod/v1/'+ gameDate +'/'+ gameId +'_boxscore.json';
    //https://wikihoops.com/games/2017-12-25/
    var wiki = 'https://wikihoops.com/games/'+ gamePath;

    ajax(pbp, function(res) {
        gameData.playbyplay = JSON.parse(res);

        // sendResponse(gameData);

    //     ajax(boxscore, function(res2) {
    //         gameData.boxscore = JSON.parse(res2);
    //
    //         sendResponse(gameData);
    //
            ajax(wiki, function(res3) {
                // return the first instance of data-count
                var count = res3.match(/(?<=data-count=")([\-0-9]+)(?=")/);
                gameData.wikiVotes = count[0];

                sendResponse(gameData);
            });
    //     });
    });
});

function ajax(url, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, false);
    xhr.send();

    if (xhr.status === 200 && callback) {
        callback(xhr.responseText);
    }
}

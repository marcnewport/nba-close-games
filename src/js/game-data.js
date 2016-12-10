/**
 * Options handler
 *
 * Available everywhere
 */
var gameData = {

    boxScore: null,

    getBoxScore: function(gameId, callback) {

        var url = 'http://stats.nba.com/stats/boxscoresummaryv2/?GameID='+ gameId;

        if (gameData.boxScore) {
            callback(gameData.boxScore);
        }
        else {

            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    console.log(xhr.responseText);
                }
            }
            xhr.send();

            // fetch(url, {
            //     method: 'get',
            //     mode: 'no-cors'
            // })
            // .then(function (response) {
            //     return response.json();
            // })
            // .then(function(data) {
            //     // Cache the response
            //     gameData.boxScore = data;
            //
            //     if (callback) callback(data);
            // });
        }

    },

    // Returns an array of all the options
    isOverTime: function(gameId) {

        var data = gameData.getBoxScore(gameId, function(data) {
            console.log(data);
        });
    }
};

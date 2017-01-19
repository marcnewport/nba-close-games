(function() {

    var DIFF = 3;
    var CUTOFF = 300;

    Number.prototype.between = function (min, max) {
        return this > min && this < max;
    };

    // Loop through all the games on the page
    document.querySelectorAll('.schedule-item').forEach(function(itemEl) {

        var gameId = itemEl.dataset.gid;

        // First check if it went into OT
        var gameEl = itemEl.querySelector('.game-situation');
        var overtime = gameEl.innerHTML.indexOf('Final OT') >= 0;

        if (overtime) {
            updateDOM(itemEl);
        }
        else {
            chrome.runtime.sendMessage({ gameId: gameId }, function(response) {

                var data = JSON.parse(response);

                // Get indices of data we care about
                // var PERIOD = data.resultSets[0].headers.indexOf('PERIOD');
                var PCTIMESTRING = data.resultSets[0].headers.indexOf('PCTIMESTRING');
                var SCOREMARGIN = data.resultSets[0].headers.indexOf('SCOREMARGIN');

                var rows = data.resultSets[0].rowSet;
                var length = rows.length;
                var half = length / 2;

                // Look through rows backwards
                for (var i = length; i-- > half; ) {

                    var margin = parseInt(rows[i][SCOREMARGIN], 10);

                    if (rows[i][SCOREMARGIN] === 'TIE' || margin.between(-DIFF, DIFF)) {
                        console.log(rows[i][PCTIMESTRING], rows[i][SCOREMARGIN]);
                        updateDOM(itemEl);
                        break;
                    }
                    else if (toSeconds(rows[i][PCTIMESTRING]) > CUTOFF) {
                        break;
                    }
                }
            });
        }
    });



    /**
     * Converts a time string "MM:SS" into numeric seconds
     */
    function toSeconds(mins) {
        var split = mins.split(':');
        return (parseInt(split[0], 10) * 60) + parseInt(split[1], 10);
    }



    /**
     * Inserts the DOM element
     */
    function updateDOM(itemEl) {
        // Get the elements we want to manipulate
        var gameInfoEl = itemEl.querySelector('.game-info');
        var closeGameEl = gameInfoEl.querySelectorAll('.ncge-insert');

        // TODO : this decision needs to be made earlier
        // Remove our inserted element if it's already there
        if (closeGameEl.length) {
            gameInfoEl.removeChild(closeGameEl.item(0));
        }
        else {
            // Create and insert our new element
            closeGameEl = document.createElement('div');
            closeGameEl.className = 'ncge-insert';
            closeGameEl.innerHTML = 'Close game';
            gameInfoEl.appendChild(closeGameEl);
        }
    }
})();

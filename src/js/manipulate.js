
var DIFF = 3;
var CUTOFF = 300;

// console.log(options.get('enabled'));

if (options.get('enabled')) {
    destroy();
}
else {
    init();
}



/**
 * Modify the page
 */
function init() {
    console.log('init');
    // Toggle enabled
    options.set('enabled', true);
    chrome.runtime.sendMessage({ enableIcon: true });

    // Listen for date change
    var $gameDate = document.querySelector('.game-date');
    $gameDate.addEventListener('DOMSubtreeModified', dateChangedHandler);

    // Loop through all the games on the page
    document.querySelectorAll('.schedule-item').forEach(function($item) {

        var gameId = $item.dataset.gid;

        // First check if it went into OT
        var $game = $item.querySelector('.game-situation');
        var overtime = $game.innerHTML.indexOf('Final OT') >= 0;

        if (overtime) {
            updateDOM($item);
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
                        insertElement($item);
                        break;
                    }
                    else if (toSeconds(rows[i][PCTIMESTRING]) > CUTOFF) {
                        break;
                    }
                }
            });
        }
    });
}



/**
 * Inserts the DOM elements for a game
 */
function insertElement($item) {
    // Toggle enabled
    options.set('enabled', false);
    chrome.runtime.sendMessage({ disableIcon: true });

    var $gameInfo = $item.querySelector('.game-info');
    var $insert = document.createElement('div');

    $insert.className = 'ncge-insert';
    $insert.innerHTML = 'Close game';
    $gameInfo.appendChild($insert);
}



/**
 * Handle a date change event
 */
function dateChangedHandler() {
    // Wait half asecond for the DOM to finish updating
    setTimeout(function() {
        if (options.get('enabled')) {
            init();
        }
    }, 500);

    // Remove the handler immediately
    var $gameDate = document.querySelector('.game-date');
    $gameDate.removeEventListener('DOMSubtreeModified', dateChangedHandler);
}



/**
 * Remove our modifications
 */
function destroy() {
    // console.log('destroy');
    var $gameDate = document.querySelector('.game-date');
    $gameDate.removeEventListener('DOMSubtreeModified', dateChangedHandler);

    // Remove all inserted elements
    document.querySelectorAll('.schedule-item').forEach(function($item) {

        var $gameInfo = $item.querySelector('.game-info');
        var $insert = $gameInfo.querySelector('.ncge-insert');

        if ($insert) {
            $gameInfo.removeChild($insert);
        }
    });
}

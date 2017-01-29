
// Decide which function to run,
// but delay it slightly so icon doesnt have to load asychronously
if (options.get('enabled')) {
    chrome.runtime.sendMessage({ disableIcon: true });
    setTimeout(destroy, 200);
}
else {
    chrome.runtime.sendMessage({ enableIcon: true });
    setTimeout(init, 200);
}



/**
 * Gets game data and analyses for close games
 */
function init() {

    console.log('init');

    var overtime = options.get('over-time');
    var range = options.get('range');
    var rangeAmount = options.get('range-amount');
    var timeAmount = options.get('time-amount');

    // Loop through all the games on the page
    document.querySelectorAll('.schedule-item').forEach(function($item) {

        var gameId = $item.dataset.gid;

        // First check if it went into OT as its more efficient
        if (overtime) {

            var $game = $item.querySelector('.game-situation');
            var isOvertime = $game.innerHTML.indexOf('Final OT') >= 0;

            if (isOvertime) {
                console.log(gameId, 'OVERTIME');
                updateGameElement($item);
                return;
            }
        }

        if (range) {
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

                    if (rows[i][SCOREMARGIN] === 'TIE' || margin.between(-rangeAmount, rangeAmount)) {
                        console.log(gameId, rows[i][PCTIMESTRING], rows[i][SCOREMARGIN]);
                        updateGameElement($item);
                        break;
                    }
                    else if (toSeconds(rows[i][PCTIMESTRING]) > timeAmount) {
                        console.log(gameId, 'BLOWOUT');
                        break;
                    }
                }
            });
        }
    });

    // Listen for date change
    var $gameDate = document.querySelector('.game-date');
    $gameDate.addEventListener('DOMSubtreeModified', dateChangedHandler);

    options.set('enabled', true);
}



function dateChangedHandler() {

    if (options.get('enabled')) {
        // Wait a half asecond for the DOM to finish updating
        setTimeout(init, 500);
    }

    // Remove the handler immediately
    this.removeEventListener('DOMSubtreeModified', dateChangedHandler);
}



/**
 * Inserts the DOM elements for a game
 */
function updateGameElement($item) {

    var $gameInfo = $item.querySelector('.game-info');
    var $insert = document.createElement('div');

    $insert.className = 'ncge-insert';
    $insert.innerHTML = 'Close game';
    $gameInfo.appendChild($insert);
}



/**
 * Remove our modifications
 */
function destroy() {
    
    console.log('destroy');

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

    options.set('enabled', false);
}

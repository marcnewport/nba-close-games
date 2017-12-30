options.load(init);

function init() {
    // Decide which function to run,
    // but delay it slightly so icon doesnt have to load asychronously
    if (options.get('enabled')) {
        chrome.runtime.sendMessage({ disableIcon: true });
        setTimeout(destroy, 200);
    }
    else {
        chrome.runtime.sendMessage({ enableIcon: true });
        setTimeout(create, 200);
    }

    window.onbeforeunload = function() {
        chrome.runtime.sendMessage({ disableIcon: true });
        options.set('enabled', false);
    }
}



/**
 * Gets game data and analyses
 */

function create() {

    console.log('create');

    // TODO show loading animation on game elements

    var overtime = options.get('over-time');
    var range = options.get('range');
    var rangeAmount = options.get('range-amount');
    var timeAmount = options.get('time-amount');
    var wiki = options.get('wiki');
    var clutch = options.get('clutch');
    var clutchOvertime = options.get('clutch-over-time');

    // Loop through all the games on the page
    document.querySelectorAll('.schedule-item').forEach(function($item) {

        var gameId = $item.dataset.gid;
        var gameDate = $item.getAttribute('onclick').substring(18, 26);
        var gamePath = $item.getAttribute('onclick').substring(18, 33);

        var sendData = {
            gameId: gameId,
            gameDate: gameDate,
            gamePath: gamePath
        };

        var clutchCalculated = false;
        var closeCalculated = false;

        var teamIds = Array.from($item.querySelectorAll('[data-id]'));
        var teams = teamIds.map(el => el.dataset.id).join(' ');

        // First check if it went into OT as its more efficient
        if (overtime || clutchOvertime) {
            var $game = $item.querySelector('.game-situation');
            if ($game) {
                var isOvertime = $game.innerHTML.indexOf('Final OT') >= 0;

                if (isOvertime) {
                    console.log(gameId, teams, 'OVERTIME');
                    if (clutchOvertime) {
                        insertBadge($item, 'clutch', 'Clutch');
                        clutchCalculated = true;
                    }
                    if (overtime) {
                        insertBadge($item, 'close', 'Close');
                        closeCalculated = true;
                    }
                }
            }
        }

        chrome.runtime.sendMessage(sendData, function(res) {

            var playbyplay = res.playbyplay;
            // var boxscore = data.boxscore;

            // Get indices of playbyplay we care about
            // var PERIOD = playbyplay.resultSets[0].headers.indexOf('PERIOD');
            var PCTIMESTRING = playbyplay.resultSets[0].headers.indexOf('PCTIMESTRING');
            var SCOREMARGIN = playbyplay.resultSets[0].headers.indexOf('SCOREMARGIN');
            var SCORE = playbyplay.resultSets[0].headers.indexOf('SCORE');

            var rows = playbyplay.resultSets[0].rowSet;
            var length = rows.length;
            var half = length / 2;

            var timeLeft = 0;
            var margin = Math.abs(parseInt(rows[length - 1][SCOREMARGIN], 10), 0);

            if (! clutchCalculated && clutch && margin <= 3) {
                console.log(gameId, teams, timeLeft, 's,' , margin);
                insertBadge($item, 'clutch', 'Clutch');
            }

            if (! closeCalculated && range) {
                // Look through rows backwards
                for (var i = length; i-- > half; ) {
                    timeLeft = toSeconds(rows[i][PCTIMESTRING]);
                    if (rows[i][SCOREMARGIN] === 'TIE') {
                        margin = 0;
                    }
                    else if (rows[i][SCOREMARGIN]) {
                        margin = Math.abs(parseInt(rows[i][SCOREMARGIN], 10), 0);
                    }

                    // TODO Calculate clutch moments

                    if (margin <= rangeAmount) {
                        console.log(gameId, teams, timeLeft, 's,' , margin);
                        insertBadge($item, 'close', 'Close');
                        break;
                    }
                    else if (timeLeft > timeAmount) {
                        console.log(gameId, teams, timeLeft, 's,' , margin);
                        break;
                    }
                }
            }

            if (wiki) {
                console.log(gameId, teams, 'votes', res.wikiVotes);
                insertBadge($item, 'wiki', res.wikiVotes);
            }
        });
    });

    // Listen for date change
    var $gameDate = document.querySelector('.game-date');
    $gameDate.addEventListener('DOMSubtreeModified', dateChangedHandler);

    options.set('enabled', true);
}



function dateChangedHandler() {
    console.log('change');

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
function insertBadge(el, type, content) {

    var info = el.querySelector('.game-info');
    var badges = info.querySelector('.ncge-badges');

    if (! badges) {
        badges = document.createElement('div');
        badges.className = 'ncge-badges';
        info.appendChild(badges);
    }

    var badge = document.createElement('div');

    badge.className = 'ncge-badge ncge-badge--'+ type;
    badge.innerHTML = content;

    if (type === 'wiki') {
        var link = document.createElement('a');
        link.setAttribute('href', 'https://wikihoops.com');
        link.setAttribute('target', '_blank');
        link.setAttribute('title', 'Wikihoops votes');

        link.appendChild(badge);
        badges.appendChild(link);
    }
    else {
        badges.appendChild(badge);
    }
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
        var $insert = $gameInfo.querySelector('.ncge-badges');

        if ($insert) {
            $gameInfo.removeChild($insert);
        }
    });

    options.set('enabled', false);
}

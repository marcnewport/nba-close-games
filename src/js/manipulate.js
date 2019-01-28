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

    const overtime = options.get('over-time');
    const range = options.get('range');
    const rangeAmount = options.get('range-amount');
    const timeAmount = options.get('time-amount');
    const wiki = options.get('wiki');
    const clutch = options.get('clutch');
    const clutchOvertime = options.get('clutch-over-time');

    // Loop through all the games on the page
    document.querySelectorAll('.schedule-item').forEach(async function($item) {

        const badges = document.createElement('div');
        badges.className = 'ncge-badges ncge-badges--loading';

        const info = $item.querySelector('.game-info');
        info.appendChild(badges);

        const gameId = $item.dataset.gid;
        const gameDate = $item.getAttribute('onclick').substring(18, 26);
        const gameYear = gameDate.slice(0, 4);
        const gameMonth = gameDate.slice(4, 6);
        const gameDay = gameDate.slice(6, 8);
        const gameTeams = $item.getAttribute('onclick').substring(27, 33);
        const gameTeamAway = gameTeams.slice(0, 3);
        const gameTeamHome = gameTeams.slice(3, 6);

        const pbpUrl = 'https://stats.nba.com/stats/playbyplayv2/?GameID='+ gameId +'&StartPeriod=0&EndPeriod=0';

        const playbyplay = await fetch(pbpUrl)
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error));

        var PERIOD = playbyplay.resultSets[0].headers.indexOf('PERIOD');
        var PCTIMESTRING = playbyplay.resultSets[0].headers.indexOf('PCTIMESTRING');
        var SCOREMARGIN = playbyplay.resultSets[0].headers.indexOf('SCOREMARGIN');
        var SCORE = playbyplay.resultSets[0].headers.indexOf('SCORE');

        var rows = playbyplay.resultSets[0].rowSet;
        var length = rows.length;
        var half = length / 2;

        var timeLeft = 0;
        var margin = Math.abs(parseInt(rows[length - 1][SCOREMARGIN], 10), 0);

        var clutchCalculated = false;
        var closeCalculated = false;

        var teamIds = Array.from($item.querySelectorAll('[data-id]'));
        var teams = teamIds.map(el => el.dataset.id).join(' ');

        // Look through rows backwards
        for (var i = length - 1; i > half; i--) {
          timeLeft = toSeconds(rows[i][PCTIMESTRING]);

          if (rows[i][SCOREMARGIN] === 'TIE') {
            margin = 0;
          } else if (rows[i][SCOREMARGIN]) {
            margin = Math.abs(parseInt(rows[i][SCOREMARGIN], 10), 0);
          }

          // TODO Calculate clutch moments
          
          if (overtime && rows[i][PERIOD] > 4) {
            // console.log(gameId, teams, 'PERIOD', rows[i][PERIOD]);
            insertBadge(badges, 'close', 'Close');
            break;
          } else if (margin <= rangeAmount) {
            // console.log(gameId, teams, timeLeft, 's,' , margin);
            insertBadge(badges, 'close', 'Close');
            break;
          } else if (timeLeft > timeAmount) {
            // console.log(gameId, teams, timeLeft, 's,' , margin);
            break;
          }
        }

        if (wiki) {
          const gamePathDate = [
            gameYear,
            gameMonth,
            gameDay
          ].join('-');
          const gamePathTeams = [
            gameTeamAway,
            gameTeamHome
          ].join('-');
          const wikiUrl = 'https://wikihoops.com/games/' + gamePathDate + '/' + gamePathTeams;

          const wikiData = await fetch(wikiUrl)
            .then(response => response.text())
            .then(data => data)
            .catch(error => console.error(error));

          const wikiHTML = document.createElement('div');
          wikiHTML.innerHTML = wikiData;
          const wikiVotes = wikiHTML.querySelector('.votes .ratingValue').innerText;

          insertBadge(badges, 'wiki', wikiVotes);
        }
    });

    // Listen for date change
    // var $gameDate = document.querySelector('.game-date');
    // $gameDate.addEventListener('DOMSubtreeModified', dateChangedHandler);

    options.set('enabled', true);
}



// function dateChangedHandler() {
//     console.log('change');
//
//     if (options.get('enabled')) {
//         // Wait a half asecond for the DOM to finish updating
//         setTimeout(init, 500);
//     }
//
//     // Remove the handler immediately
//     this.removeEventListener('DOMSubtreeModified', dateChangedHandler);
// }



/**
 * Inserts the DOM elements for a game
 */
function insertBadge(badges, type, content) {

    badges.classList.remove('ncge-badges--loading');
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

    // var $gameDate = document.querySelector('.game-date');
    // $gameDate.removeEventListener('DOMSubtreeModified', dateChangedHandler);

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

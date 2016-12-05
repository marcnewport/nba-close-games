document.querySelectorAll('.schedule-item').forEach(function(itemEl) {

    // Check if the game went into overtime
    var gameEl = itemEl.querySelector('.game-situation');
    var overtime = gameEl.innerHTML.indexOf('Final OT') >= 0;

    // Retrieve the scores from the DOM
    var scores = itemEl.querySelectorAll('.team-score:not(.hide-score)');

    // Check they exist as games can be POSTPONED
    if (scores.length) {

        var awayScore = Number(scores[0].innerHTML);
        var homeScore = Number(scores[1].innerHTML);

        // Calculate the difference
        var pointsDiff = Math.abs(awayScore - homeScore);


        // TODO get game data and highlight other interesting points about the game
        // var gameId = '';
        // var gameData = 'http://stats.nba.com/stats/boxscoresummaryv2/?GameID=0021600133';


        // Get the elements we want to manipulate
        var gameInfoEl = itemEl.querySelector('.game-info');
        var closeGameEl = gameInfoEl.querySelectorAll('.ncge-insert');

        // Remove our inserted element if it's already there
        if (closeGameEl.length) {
            gameInfoEl.removeChild(closeGameEl.item(0));
        }
        else if (overtime || pointsDiff < 3) {
            // Create and insert our new element
            closeGameEl = document.createElement('div');
            closeGameEl.className = 'ncge-insert';
            closeGameEl.innerHTML = 'Close game';

            gameInfoEl.appendChild(closeGameEl);
        }
    }
});

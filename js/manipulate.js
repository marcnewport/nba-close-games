$('.gameItem').each(function() {
  //should prolly do this with vanilla js...
  var $this = $(this),
      $insert = $this.find('.ncge-insert'),
      awayScore = Number($this.find('.awayscore').text()),
      homeScore = Number($this.find('.homescore').text()),
      pointsDiff = 0,
      closeDiff = 3,
      closeGame = false;

  //toggle inserted text
  if ($insert.length) {
    //remove any previously inserted text
    $insert.remove();
  }
  //are there points on the board?
  else if (awayScore || homeScore) {
    //figure out points difference
    if (awayScore === homeScore) {
      closeGame = true;
    }
    else if (awayScore > homeScore) {
      pointsDiff = awayScore - homeScore;
    }
    else {
      pointsDiff = homeScore - awayScore;
    }

    if (pointsDiff <= closeDiff) {
      closeGame = true;
    }

    if (closeGame) {
      $this.find('.normal').append(
        $('<span>').addClass('ncge-insert').html('CLOSE GAME')
      );
    }
  }
});

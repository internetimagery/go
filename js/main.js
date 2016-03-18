(function() {
  var main;

  main = function() {
    var game_data;
    game_data = get_game_data();
    if (game_data.board_size === 0) {
      console.log("!! NEW GAME !!");
    } else {
      console.log("!! LOADING GAME !!");
    }
    return console.log(game_data);
  };

  main();

}).call(this);

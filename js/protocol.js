(function() {
  var Get_Game_Data;

  Get_Game_Data = function() {
    var cell_num, chunk, data, game_data, i, turn_data, url, _i, _ref;
    game_data = {
      board_size: 0,
      moves: []
    };
    url = document.createElement("a");
    url.href = window.location.href;
    data = url.hash;
    if (1 < data.length) {
      console.log("Game Data found. Validating...");
      if (data.length < 3) {
        throw "Invalid Game Data";
      }
      game_data.board_size = parseInt(data.substring(1, 3));
      if (isNaN(game_data.board_size) || game_data.board_size < 2 || game_data.board_size > 31) {
        throw "Invalid Board Size. Sizes must be between 2 and 31.";
      }
      turn_data = data.substring(3);
      if (turn_data.length % 3 !== 0) {
        throw "Invalid Turn Data";
      }
      cell_num = Math.pow(game_data.board_size, 2);
      for (i = _i = 0, _ref = turn_data.length / 3; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        i *= 3;
        chunk = turn_data.substring(i, i + 3);
        if (chunk === "---") {
          game_data.moves.push(chunk);
        } else {
          chunk = parseInt(chunk);
          if (isNaN(chunk) || chunk > cell_num) {
            throw "Invalid Turn " + (i / 3 + 1) + ".";
          }
          game_data.moves.push(chunk);
        }
      }
      if (game_data.moves.length > 650) {
        throw "Turns exceeded turn limit of 650.";
      }
      console.log("Valid!");
    } else {
      console.log("No Game Data found.");
    }
    return game_data;
  };

  this.get_game_data = Get_Game_Data;

}).call(this);

(function() {
  var Get_Game_Data;

  Get_Game_Data = function() {
    var cell_num, chunk, chunk_data, data, game_data, tmp_url, url, _i, _ref;
    game_data = {
      mode: 0,
      board_size: 9,
      moves: []
    };
    url = document.createElement("a");
    url.href = window.location.href;
    data = url.hash;
    if (1 < data.length) {
      console.log("Game Data found. Validating...");
      data = data.substring(1);
      if (data.length % 3 !== 0) {
        throw "Possible corrupt game data...";
      }
      if (data.length / 3 > 649) {
        console.warn("Turn limit of 649 exceeded. Urls may not work on some browsers.");
      }
      game_data.mode = parseInt(data[0]);
      if (isNaN(game_data.mode)) {
        throw "Invalid Game Mode";
      }
      game_data.board_size = parseInt(data.slice(1, 3));
      if (isNaN(game_data.board_size) || game_data.board_size < 2 || game_data.board_size > 31) {
        throw "Invalid Board Size. Sizes must be between 2 and 31.";
      }
      cell_num = Math.pow(game_data.board_size, 2);
      for (chunk = _i = 1, _ref = data.length / 3; 1 <= _ref ? _i < _ref : _i > _ref; chunk = 1 <= _ref ? ++_i : --_i) {
        chunk *= 3;
        chunk_data = data.slice(chunk, chunk + 3);
        if (chunk_data === "---") {
          game_data.moves.push(chunk_data);
        } else {
          chunk_data = parseInt(chunk_data);
          if (isNaN(chunk_data) || chunk_data > cell_num) {
            throw "Invalid Turn @ " + (chunk / 3) + ".";
          } else {
            game_data.moves.push(chunk_data);
          }
        }
      }
      console.log("Valid!");
    } else {
      console.log("No game data found. Using defaults. Game mode 0. Board size 9.");
      tmp_url = window.location.href.split("#");
      window.location.href = "" + tmp_url[0] + "#009";
    }
    return game_data;
  };

  this.get_game_data = Get_Game_Data;

}).call(this);

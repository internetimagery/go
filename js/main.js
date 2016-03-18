(function() {
  var coords_to_position, get_surrounding, main, positon_to_coords;

  positon_to_coords = function(pos, size) {
    var coords;
    return coords = {
      x: pos % size,
      y: Math.floor(pos / size)
    };
  };

  coords_to_position = function(x, y, size) {
    var pos;
    console.log("debug", x, y, size);
    return pos = size * y + x;
  };

  get_surrounding = function(pos, size) {
    var dir, dir_check, surroundings;
    surroundings = {};
    dir = pos - 1;
    dir_check = dir % size;
    if (dir_check === size - 1 || dir_check < 0) {
      surroundings.left = null;
    } else {
      surroundings.left = dir;
    }
    dir = pos + 1;
    dir_check = dir % size;
    if (dir_check === 0 || dir_check > size) {
      surroundings.right = null;
    } else {
      surroundings.right = dir;
    }
    dir = pos - size;
    if (dir < 0) {
      surroundings.up = null;
    } else {
      surroundings.up = dir;
    }
    dir = pos + size;
    if (dir > Math.pow(size, 2)) {
      surroundings.down = null;
    } else {
      surroundings.down = dir;
    }
    return surroundings;
  };

  main = function() {
    var board, board_element, current_turn, game_data;
    game_data = get_game_data();
    board_element = document.getElementById("board");
    current_turn = 0;
    if (game_data.board_size === 0) {
      console.log("!! NEW GAME !!");
    } else {
      console.log("!! LOADING GAME !!");
      board = new Board(board_element, game_data.board_size, game_data.board_size);
      console.log("pos", game_data.moves[0]);
      console.log("coords", positon_to_coords(game_data.moves[0], game_data.board_size));
      console.log("pos again", coords_to_position(2, 1, game_data.board_size));
    }
    return console.log(game_data);
  };

  main();

}).call(this);

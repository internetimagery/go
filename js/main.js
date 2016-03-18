(function() {
  var coords_to_position, main, play_stone, positon_to_coords;

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

  play_stone = function(player, pos, size, board) {
    var surroundings;
    return surroundings = get_surroundings(pos, size);
  };

  main = function() {
    var board, board_element, current_turn, game_data, player;
    game_data = get_game_data();
    board_element = document.getElementById("board");
    current_turn = 0;
    if (game_data.board_size === 0) {
      console.log("!! NEW GAME !!");
    } else {
      console.log("!! LOADING GAME !!");
      board = new Board(board_element, game_data.board_size, game_data.board_size);
      player = "white";
    }
    return console.log(game_data);
  };

  main();

}).call(this);

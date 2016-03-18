(function() {
  var capture, main, play_stone;

  capture = function(stone, board) {
    var group, _i, _len;
    if (board.get_player(stone) !== 0) {
      group = board.get_connected_stones(stone);
      for (_i = 0, _len = group.length; _i < _len; _i++) {
        stone = group[_i];
        board.place(stone, 0);
      }
      return console.log("Capturing group");
    }
  };

  play_stone = function(player, pos, board) {
    var dir, stone, _ref;
    if (board.get_player(pos) !== 0) {
      throw "Placement Failed: Stone is already there.";
    }
    board.place(pos, player);
    _ref = board.get_surroundings(pos);
    for (dir in _ref) {
      stone = _ref[dir];
      if (board.is_surrounded(stone)) {
        capture(stone, board);
      }
    }
    if (board.is_surrounded(pos)) {
      board.place(pos, 0);
      throw "Placement Failed: Position is Suicide.";
    }
    console.log("Placed stone at position " + pos + ".", board.get_surroundings(pos));
    return board.dump_state();
  };

  main = function() {
    var board, current_turn, game_data, game_states, move, state, _i, _len, _ref;
    game_data = get_game_data();
    game_states = [];
    current_turn = 0;
    board = new Board(document.getElementById("board"), game_data.board_size);
    if (game_data.board_size === 0) {
      console.log("!! NEW GAME !!");
    } else {
      console.log("!! LOADING GAME !!");
      _ref = game_data.moves;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        move = _ref[_i];
        console.log("HERE", move);
        if (move === "---") {
          if (game_states.length === 0) {
            game_states.push(board.dump_state());
          } else {
            game_states.push(game_states[-1]);
          }
        } else {
          state = play_stone(game_states.length % 2 + 1, move, board);
          game_states.push(state);
        }
      }
      current_turn = game_states.length;
    }
    return board.register(function(pos) {
      return play_stone(current_turn % 2 + 1, pos, board);
    });
  };

  main();

}).call(this);

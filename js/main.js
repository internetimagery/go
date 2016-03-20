(function() {
  var capture, main, play_stone;

  capture = function(stone, board) {
    var group, _i, _len, _results;
    if (board.get_player(stone) !== 0) {
      group = board.get_connected_stones(stone);
      _results = [];
      for (_i = 0, _len = group.length; _i < _len; _i++) {
        stone = group[_i];
        _results.push(board.place(stone, 0));
      }
      return _results;
    }
  };

  play_stone = function(player, pos, board, ko_check_move) {
    var check_ko, dir, i, ko, new_state, state_backup, stone, _i, _ref, _ref1;
    if (board.get_player(pos) !== 0) {
      throw "Illegal Move: Space occupied.";
    }
    state_backup = board.dump_state();
    board.place(pos, player);
    check_ko = false;
    _ref = board.get_surroundings(pos);
    for (dir in _ref) {
      stone = _ref[dir];
      if (board.is_surrounded(stone)) {
        capture(stone, board);
        check_ko = true;
      }
    }
    new_state = board.dump_state();
    if (check_ko && ko_check_move) {
      ko = true;
      for (i = _i = 0, _ref1 = new_state.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
        if (new_state[i] !== ko_check_move[i]) {
          ko = false;
          break;
        }
      }
      if (ko) {
        board.load_state(state_backup);
        throw "Illegal Move: Ko.";
      }
    }
    if (board.is_surrounded(pos)) {
      board.load_state(state_backup);
      throw "Illegal Move: Suicide.";
    }
    board.update();
    return new_state;
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
        if (move === "---") {
          game_states.push(game_states[game_states.length - 2]);
        } else {
          state = play_stone(game_states.length % 2 + 1, move, board, game_states[game_states.length - 1]);
          game_states.push(state);
        }
      }
      current_turn = game_states.length;
    }
    return board.register(function(pos) {
      return play_stone(current_turn % 2 + 1, pos, board, game_states[game_states.length - 2]);
    });
  };

  main();

}).call(this);

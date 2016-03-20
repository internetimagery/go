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
    var check_ko, dir, i, ko, new_state, stone, _i, _ref, _ref1;
    if (board.get_player(pos) !== 0) {
      throw "Illegal Move: Space occupied.";
    }
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
        throw "Illegal Move: Ko.";
      }
    }
    if (board.is_surrounded(pos)) {
      throw "Illegal Move: Suicide.";
    }
    return new_state;
  };

  main = function() {
    var board, game_data, game_states, move, state, url, _i, _len, _ref;
    game_data = new Game_Data();
    game_states = [];
    url = window.location.href.split("#");
    if (url.length === 2 && url[1]) {
      console.log("!! LOADING GAME !!");
      game_data.read_id(url[1]);
    } else {
      console.log("!! NEW GAME !!");
      window.location.href = "" + url[0] + "#" + (game_data.write_id());
    }
    board = new Board(document.getElementById("board"), game_data.board_size);
    _ref = game_data.moves;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      move = _ref[_i];
      if (move === "---") {
        if (game_states.length === 0) {
          game_states.push(board.dump_state());
        } else {
          game_states.push(game_states[game_states.length - 2]);
        }
      } else {
        state = play_stone(game_states.length % 2 + 1, move, board, game_states[game_states.length - 1]);
        game_states.push(state);
      }
    }
    game_data.current = game_states.length;
    board.update();
    return board.register(function(pos) {
      var clean_state;
      clean_state = board.dump_state();
      try {
        clean_state = play_stone(game_data.current % 2 + 1, pos, board, game_states[game_states.length - 2]);
        game_data.current += 1;
        game_data.add_move(pos);
        return window.location.href = "" + url[0] + "#" + (game_data.write_id());
      } finally {
        board.load_state(clean_state);
        board.update();
      }
    });
  };

  main();

}).call(this);

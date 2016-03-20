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
      if (board.get_player(stone) !== player && board.is_surrounded(stone)) {
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
    board.update(game_states.length % 2 + 1);
    board.register(function(pos) {
      var current_state, error;
      if (game_data.current === game_states.length) {
        current_state = game_states.length === 0 ? board.dump_state() : game_states[game_states.length - 1];
        try {
          current_state = play_stone(game_data.current % 2 + 1, pos, board, game_states[game_states.length - 2]);
          game_states.push(current_state);
          game_data.current = game_states.length;
          game_data.add_move(pos);
          return window.location.href = "" + url[0] + "#" + (game_data.write_id());
        } catch (_error) {
          error = _error;
          return alert(error);
        } finally {
          board.load_state(current_state);
        }
      } else {
        return alert("Cannot add move. The game has progressed past this point.");
      }
    });
    return window.onhashchange = function() {
      var new_hash, view_state;
      new_hash = window.location.href.split("#");
      if (new_hash.length === 2 && new_hash[1].length > 3 && new_hash[1].length % 3 === 0) {
        game_data.current = Math.floor(new_hash[1].length / 3) - 1;
        view_state = game_states[game_data.current - 1];
        board.load_state(view_state);
        return board.update(game_data.current % 2 + 1);
      }
    };
  };

  main();

}).call(this);

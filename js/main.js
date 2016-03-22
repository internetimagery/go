(function() {
  var capture, indicate, main, play_stone, update_tinyurl;

  update_tinyurl = function() {
    var elem;
    elem = document.getElementById("short-link");
    return elem.href = "https://tinyurl.com/api-create.php?url=" + (encodeURIComponent(window.location.href));
  };

  indicate = function(player) {
    var e, element, _i, _len;
    element = [document.getElementById("player-black"), document.getElementById("player-white")];
    for (_i = 0, _len = element.length; _i < _len; _i++) {
      e = element[_i];
      e.setAttribute("style", "");
    }
    return element[player].setAttribute("style", "box-shadow: 0px 0px 3px 3px yellow;");
  };

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
    if (pos === null) {
      return board.dump_state();
    }
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
    var board, dropzone, game_data, game_states, move, pass_btn, state, state_url, url, _i, _len, _ref;
    game_data = new Game_Data();
    game_states = [];
    url = window.location.href.split("#");
    if (url.length === 2 && url[1]) {
      console.log("!! LOADING GAME !!");
      game_data.read_id(decodeURIComponent(url[1]));
    } else {
      console.log("!! NEW GAME !!");
      history.replaceState(0, "start", "" + url[0] + "#" + (game_data.write_id()));
      update_tinyurl();
    }
    board = new Board(document.getElementById("board"), game_data.board_size);
    pass_btn = document.getElementById("pass");
    _ref = game_data.moves;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      move = _ref[_i];
      if (move === null) {
        if (game_states.length === 0) {
          state = board.dump_state();
        } else {
          state = game_states[game_states.length - 2];
        }
      } else {
        state = play_stone(game_states.length % 2 + 1, move, board, game_states[game_states.length - 1]);
      }
      game_states.push(state);
      window.document.title = "Move " + game_states.length;
      game_data.current = game_states.length;
      state_url = "" + url[0] + "#" + (game_data.write_id());
      update_tinyurl();
      if (game_data.current === 0) {
        history.replaceState(game_states.length, "Start", state_url);
      } else {
        history.pushState(game_states.length, "Move " + game_data.current, state_url);
      }
    }
    board.update(game_states.length % 2 + 1);
    indicate(game_states.length % 2);
    board.register(function(pos) {
      var current_state, error, player;
      if (game_data.current === game_states.length) {
        current_state = game_states.length === 0 ? board.dump_state() : game_states[game_states.length - 1];
        try {
          current_state = play_stone(game_data.current % 2 + 1, pos, board, game_states[game_states.length - 2]);
          game_states.push(current_state);
          game_data.current = game_states.length;
          game_data.add_move(pos);
          history.pushState(game_states.length, "Move " + game_states.length, "" + url[0] + "#" + (game_data.write_id()));
          board.load_state(current_state);
          player = game_data.current % 2;
          board.update(player + 1);
          window.document.title = "Move " + game_states.length;
          return indicate(player);
        } catch (_error) {
          error = _error;
          board.load_state(current_state);
          return alert(error);
        }
      } else {
        return alert("Cannot add move. The game has progressed past this point.");
      }
    });
    pass_btn.onclick = function(e) {
      return board.placement_event(null);
    };
    window.addEventListener("popstate", function(event) {
      move = parseInt(event.state);
      if (isNaN(move)) {
        throw "Invalid game state!";
      }
      console.log("Loaded game state " + move + ".");
      game_data.current = move;
      board.load_state(game_states[move - 1]);
      board.update(move % 2 + 1);
      window.document.title = "Move " + move;
      indicate(move % 2);
      return update_tinyurl();
    });
    dropzone = document.getElementById("dropzone");
    dropzone.addEventListener('dragover', function(e) {
      e.stopPropagation();
      e.preventDefault();
      return e.dataTransfer.dropEffect = "copy";
    });
    return dropzone.addEventListener("drop", function(e) {
      var files, reader;
      e.stopPropagation();
      e.preventDefault();
      files = e.dataTransfer.files;
      if (files[0]) {
        reader = new FileReader();
        reader.onload = function(e2) {
          var data, error;
          data = e2.target.result;
          try {
            game_data.load_sgf(data);
            window.location.assign("" + url[0] + "#" + (game_data.write_id()));
            return location.reload(true);
          } catch (_error) {
            error = _error;
            alert("There was a problem loading the SGF.");
            return console.error(error);
          }
        };
        return reader.readAsText(files[0]);
      }
    });
  };

  this.main = main;

}).call(this);

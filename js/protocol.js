(function() {
  var Game_Data, decode_move, encode_move, move_chars;

  move_chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

  decode_move = function(move, size) {
    var col, row;
    if (move === "[]") {
      return null;
    } else {
      row = move_chars.indexOf(move[0]) * size;
      col = move_chars.indexOf(move[1]);
      if (row === -1 || col === -1) {
        throw "Bad Move " + move + ".";
      }
      return row + col;
    }
  };

  encode_move = function(move, size) {
    var col, row;
    if (move === null) {
      return "[]";
    } else {
      row = move_chars[Math.floor(move / size)];
      col = move_chars[move % size];
      return row.concat(col);
    }
  };

  Game_Data = (function() {
    function Game_Data() {
      this.mode = 0;
      this.board_size = 9;
      this.moves = [];
      this.current = 0;
    }

    Game_Data.prototype.add_move = function(move) {
      if (move === null) {
        this.moves.push(move);
      } else if (move > Math.pow(this.board_size, 2)) {
        throw "Move is too large to fit on the board";
      }
      return this.moves.push(move);
    };

    Game_Data.prototype.write_id = function() {
      var move, moves, size;
      size = ("00" + this.board_size).slice(-2);
      moves = ((function() {
        var _i, _len, _ref, _results;
        _ref = this.moves;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          move = _ref[_i];
          _results.push(encode_move(move, this.board_size));
        }
        return _results;
      }).call(this)).slice(0, this.current).join("");
      return this.mode + size + moves;
    };

    Game_Data.prototype.read_id = function(id) {
      var board_size, cell_num, chunk, chunk_data, mode, moves, turns, _i, _ref;
      if (id.length >= 3) {
        console.log("Validating game data...");
        mode = parseInt(id[0]);
        if (isNaN(mode)) {
          throw "Invalid Game Mode";
        }
        board_size = parseInt(id.slice(1, 3));
        if (isNaN(board_size) || board_size < 3 || board_size > 52) {
          throw "Invalid Board Size. Sizes must be between 3 and 52.";
        }
        turns = id.slice(3);
        if (turns.length % 2 !== 0) {
          throw "Possible corrupt game data...";
        }
        if (turns.length / 2 > 973) {
          console.warn("Turn limit of 973 exceeded. Urls may not work on some browsers.");
        }
        cell_num = Math.pow(board_size, 2);
        moves = [];
        for (chunk = _i = 0, _ref = turns.length / 2; 0 <= _ref ? _i < _ref : _i > _ref; chunk = 0 <= _ref ? ++_i : --_i) {
          chunk *= 2;
          chunk_data = decode_move(turns.slice(chunk, chunk + 2), board_size);
          if (isNaN(chunk_data) || (chunk_data !== null && chunk_data > cell_num)) {
            throw "Invalid Turn @ " + (chunk / 3) + ".";
          } else {
            moves.push(chunk_data);
          }
        }
        this.mode = mode;
        this.board_size = board_size;
        this.moves = moves;
        this.current = moves.length;
        return console.log("Valid!");
      }
    };

    Game_Data.prototype.load_sgf = function(file) {
      var board_size, colour, game, i, info, mode, move, moves, _i, _ref;
      game = smartgamer(sgf_parse(file));
      info = game.getGameInfo();
      colour = ["B", "W"];
      if (info.GM !== "1") {
        throw "Game file is not a game of GO.";
      }
      mode = "0";
      board_size = parseInt(info.SZ);
      moves = [];
      for (i = _i = 0, _ref = game.totalMoves(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        game.next();
        move = game.node()[colour[i % 2]];
        if (move === "[tt]" || !move) {
          move = "[]";
        }
        moves.push(decode_move(move, board_size));
      }
      this.mode = mode;
      this.board_size = board_size;
      this.moves = moves;
      return this.current = moves.length;
    };

    return Game_Data;

  })();

  this.Game_Data = Game_Data;

}).call(this);

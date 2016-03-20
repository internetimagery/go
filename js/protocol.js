(function() {
  var Game_Data;

  Game_Data = (function() {
    function Game_Data() {
      this.mode = 0;
      this.board_size = 9;
      this.moves = [];
      this.current = 0;
    }

    Game_Data.prototype.add_move = function(move) {
      if (move > Math.pow(this.board_size, 2)) {
        throw "Move is too large to fit on the board";
      }
      return this.moves.push(("000" + move).slice(-3));
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
          _results.push(("000" + move).slice(-3));
        }
        return _results;
      }).call(this)).join("");
      return this.mode + size + moves;
    };

    Game_Data.prototype.read_id = function(id) {
      var board_size, cell_num, chunk, chunk_data, mode, moves, _i, _ref;
      if (id.length > 0) {
        console.log("Validating game data...");
        if (id.length % 3 !== 0) {
          throw "Possible corrupt game data...";
        }
        if (id.length / 3 > 649) {
          console.warn("Turn limit of 649 exceeded. Urls may not work on some browsers.");
        }
        mode = parseInt(id[0]);
        if (isNaN(mode)) {
          throw "Invalid Game Mode";
        }
        board_size = parseInt(id.slice(1, 3));
        if (isNaN(board_size) || board_size < 2 || board_size > 31) {
          throw "Invalid Board Size. Sizes must be between 2 and 31.";
        }
        cell_num = Math.pow(board_size, 2);
        moves = [];
        for (chunk = _i = 1, _ref = id.length / 3; 1 <= _ref ? _i < _ref : _i > _ref; chunk = 1 <= _ref ? ++_i : --_i) {
          chunk *= 3;
          chunk_data = id.slice(chunk, chunk + 3);
          if (chunk_data === "---") {
            moves.push(chunk_data);
          } else {
            chunk_data = parseInt(chunk_data);
            if (isNaN(chunk_data) || chunk_data > cell_num) {
              throw "Invalid Turn @ " + (chunk / 3) + ".";
            } else {
              moves.push(chunk_data);
            }
          }
        }
        this.mode = mode;
        this.board_size = board_size;
        this.moves = moves;
        this.current = moves.length;
        return console.log("Valid!");
      }
    };

    return Game_Data;

  })();

  this.Game_Data = Game_Data;

}).call(this);

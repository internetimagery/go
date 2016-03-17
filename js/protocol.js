(function() {
  var Counter, URL, binary_to_board, get_game_state, pad, put_game_state, state;

  pad = function(str, val, len) {
    while (str.length < len) {
      str += val;
    }
    return str;
  };

  Counter = (function() {
    function Counter(base) {
      this.base = base;
      this.value = 0;
      this.next = null;
    }

    Counter.prototype.add = function() {
      this.value += 1;
      if (this.value >= this.base) {
        this.value = 0;
        if (this.next === null) {
          this.next = new Counter(this.base);
          return this.next.add();
        } else {
          return this.next.add();
        }
      }
    };

    Counter.prototype.concat = function() {
      var num;
      num = this.value.toString();
      if (this.next !== null) {
        num = this.next.concat() + num;
      }
      return num;
    };

    return Counter;

  })();

  URL = document.createElement("a");

  URL.href = window.location.href;

  binary_to_board = function(binary, size) {
    var board, chunk, row, _i, _len;
    board = Array();
    row = Array();
    for (_i = 0, _len = binary.length; _i < _len; _i++) {
      chunk = binary[_i];
      chunk = parseInt(chunk);
      switch (chunk) {
        case 1:
          row.push(1);
          break;
        case 10:
          row.push(2);
          break;
        default:
          row.push(0);
      }
      if (row.length === size) {
        board.push(row);
        row = Array();
      }
    }
    return board;
  };

  get_game_state = function() {
    var a, b, cell_num, chunk, current, last, parts, size, state, state_id, state_pos, turn, _i, _ref;
    parts = URL.hash.substring(1).split("-");
    if (parts.length === 3) {
      size = parseInt(parts[0]);
      turn = parseInt(parts[1]);
      state_id = parseInt(parts[2]);
      if (!isNaN(size) && !isNaN(turn) && !isNaN(state_id)) {
        cell_num = Math.pow(size, 2);
        state_pos = pad(state_id.toString(2), "0", cell_num * 4);
        current = Array();
        last = Array();
        for (a = _i = 0, _ref = cell_num * 2; 0 <= _ref ? _i < _ref : _i > _ref; a = 0 <= _ref ? ++_i : --_i) {
          b = a * 2;
          chunk = state_pos.substring(b, b + 2);
          if (a < cell_num) {
            current.push(chunk);
          } else {
            last.push(chunk);
          }
        }
        state = {
          size: size,
          turn_number: turn,
          player: turn % 2,
          current: binary_to_board(current, size),
          last: binary_to_board(last, size)
        };
        return state;
      }
    }
    throw "Invalid URL and Game State";
  };

  put_game_state = function(state) {
    var binary_stream, col, i, row, size, state_id, stream, test, turn, _i, _j, _k, _l, _len, _len1, _len2, _ref, _ref1;
    size = parseInt(state.size);
    turn = parseInt(state.turn_number);
    if (isNaN(size) || isNaN(turn) || state.current.length !== state.last.length) {
      throw "Invalid Game State";
    }
    binary_stream = "";
    _ref = Array(state.current, state.last);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      stream = _ref[_i];
      for (_j = 0, _len1 = stream.length; _j < _len1; _j++) {
        row = stream[_j];
        for (_k = 0, _len2 = row.length; _k < _len2; _k++) {
          col = row[_k];
          switch (col) {
            case 1:
              binary_stream += "01";
              break;
            case 2:
              binary_stream += "10";
              break;
            default:
              binary_stream += "00";
          }
        }
      }
    }
    test = "";
    for (i = _l = 0, _ref1 = Math.pow(19, 2) * 4; 0 <= _ref1 ? _l < _ref1 : _l > _ref1; i = 0 <= _ref1 ? ++_l : --_l) {
      test += "1";
    }
    console.log(parseInt(test, 2));
    state_id = parseInt("000001001001100010100010011001001001001010100100100000000000000000000000", 2);
    return console.log(state_id);
  };

  state = get_game_state();

  console.log(state);

  put_game_state(state);

}).call(this);

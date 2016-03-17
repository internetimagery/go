(function() {
  var URL, binary_to_board, get_game_state, pad, set_game_state, state;

  pad = function(str, val, len) {
    while (str.length < len) {
      str += val;
    }
    return str;
  };

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
    parts = URL.hash.substring(1, URL.hash.length).split("-");
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

  set_game_state = function(state) {
    return console.log(URL);
  };

  state = get_game_state();

  console.log(state);

  set_game_state(state);

}).call(this);

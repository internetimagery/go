(function() {
  var binary_to_board, get_game_state, get_url_parts, pad;

  pad = function(str, val, len) {
    while (str.length < len) {
      str += val;
    }
    return str;
  };

  get_url_parts = function() {
    var elem, url;
    url = window.location.href;
    elem = document.createElement("a");
    elem.href = url;
    return elem.hash.substring(1, elem.hash.length).split("-");
  };

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
    parts = get_url_parts();
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
        binary_to_board(current, size);
        state = {
          size: size,
          turn_number: turn,
          player: turn % 2,
          current: Array(),
          last: Array()
        };
        return state;
      }
    }
    throw "Invalid URL and Game State";
  };

  console.log(get_game_state());

}).call(this);

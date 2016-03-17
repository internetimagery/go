(function() {
  var get_game_state, get_url_parts, pad;

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

  get_game_state = function() {
    var a, b, chunk, parts, size, state, state_id, state_pos, turn, _i, _ref;
    parts = get_url_parts();
    if (parts.length === 3) {
      size = parseInt(parts[0]);
      turn = parseInt(parts[1]);
      state_id = parseInt(parts[2]);
      if (!isNaN(size) && !isNaN(turn) && !isNaN(state_id)) {
        state_pos = pad(state_id.toString(2), "0", size * 4);
        state = {
          size: size,
          turn_number: turn,
          player: turn % 2,
          current: Array(),
          last: Array()
        };
        for (a = _i = 0, _ref = size * 2; 0 <= _ref ? _i < _ref : _i > _ref; a = 0 <= _ref ? ++_i : --_i) {
          b = a * 2;
          chunk = state_pos.substring(b, b + 2);
          if (a < size) {
            state.current.push(chunk);
          } else {
            state.last.push(chunk);
          }
        }
        return state;
      }
    }
    throw "Invalid URL and Game State";
  };

  console.log(get_game_state());

}).call(this);

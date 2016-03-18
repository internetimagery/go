(function() {
  var b, get_connected_stones, get_player_at_pos, get_surroundings;

  get_surroundings = function(pos, size) {
    var dir, dir_check, surroundings;
    surroundings = {};
    dir = pos - 1;
    dir_check = dir % size;
    if (dir_check === size - 1 || dir_check < 0) {
      surroundings.left = null;
    } else {
      surroundings.left = dir;
    }
    dir = pos + 1;
    dir_check = dir % size;
    if (dir_check === 0 || dir_check > size) {
      surroundings.right = null;
    } else {
      surroundings.right = dir;
    }
    dir = pos - size;
    if (dir < 0) {
      surroundings.up = null;
    } else {
      surroundings.up = dir;
    }
    dir = pos + size;
    if (dir > Math.pow(size, 2)) {
      surroundings.down = null;
    } else {
      surroundings.down = dir;
    }
    return surroundings;
  };

  get_player_at_pos = function(pos, board) {
    console.log("TODO: MAKE THIS WORK");
    return 1;
  };

  get_connected_stones = function(pos, board, size) {
    var group, surroundings;
    group = Array(pos);
    surroundings = get_surroundings(pos, size);
    return console.log(surroundings.left === null);
  };

  b = new Board(document.getElementById("board"), 6);

}).call(this);

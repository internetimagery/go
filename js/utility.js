(function() {
  var b, get_connected_stones, get_surroundings;

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

  get_connected_stones = function(pos, board, size) {
    var group, player, stack, surroundings;
    group = [];
    player = board.get_player(pos);
    stack = [pos];
    pos = stack.pop();
    return surroundings = get_surroundings(pos, size);
  };

  b = new Board(document.getElementById("board"), 6);

  b.register(function(pos) {
    return console.log("Clicked! ->", pos);
  });

  b.place(9, 1);

  b.place(15, 1);

  b.place(21, 1);

  b.place(20, 1);

  console.log(get_connected_stones(9, b, 6));

}).call(this);

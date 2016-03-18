(function() {
  var b, get_connected_stones, get_surroundings,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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
    var dir, dir_pos, group, player, stack, surroundings;
    group = [pos];
    player = board.get_player(pos);
    stack = [pos];
    while (stack.length > 0) {
      pos = stack.pop();
      surroundings = get_surroundings(pos, size);
      for (dir in surroundings) {
        dir_pos = surroundings[dir];
        if (dir_pos !== null && board.get_player(dir_pos) === player && __indexOf.call(group, dir_pos) < 0) {
          group.push(dir_pos);
          stack.push(dir_pos);
        }
      }
    }
    return group;
  };

  b = new Board(document.getElementById("board"), 6);

  b.register(function(pos) {
    return console.log("Clicked! ->", pos);
  });

  b.place(9, 1);

  b.place(15, 1);

  b.place(18, 1);

  b.place(19, 1);

  b.place(20, 1);

  b.place(21, 1);

  console.log(get_connected_stones(9, b, 6));

}).call(this);

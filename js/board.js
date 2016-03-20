(function() {
  var Board, Create, Resize,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Resize = function(x, y, w, h, style) {
    return this.setAttribute("style", ("left:" + x + "%;top:" + y + "%;width:" + w + "%;height:" + h + "%;") + style);
  };

  Create = function(name, parent) {
    var elem;
    elem = document.createElement("div");
    elem.setAttribute("class", name);
    elem.resize = Resize;
    parent.appendChild(elem);
    return elem;
  };

  Board = (function() {
    function Board(element, size) {
      var col, grid_chunk, inner, inner_frame_pos, inner_frame_span, row, socket, stone_size, _fn, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3;
      this.size = size;
      this.callbacks = [];
      this.stone_class = ["empty", "stone set white", "stone set black", "empty-white", "empty-black"];
      this.board_state = [];
      if (this.size < 2) {
        throw "Board size not big enough.";
      }
      grid_chunk = 100 / (this.size - 1);
      stone_size = grid_chunk * 0.9;
      inner = Create("grid", element);
      inner_frame_pos = stone_size * 0.6;
      inner_frame_span = 100 - inner_frame_pos * 2;
      inner.resize(inner_frame_pos, inner_frame_pos, inner_frame_span, inner_frame_span, "position:relative;");
      element.appendChild(inner);
      for (row = _i = 0, _ref = this.size; 0 <= _ref ? _i < _ref : _i > _ref; row = 0 <= _ref ? ++_i : --_i) {
        Create("line-horiz", inner).setAttribute("style", "top:" + (row * grid_chunk) + "%;");
      }
      for (col = _j = 0, _ref1 = this.size; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; col = 0 <= _ref1 ? ++_j : --_j) {
        Create("line-vert", inner).setAttribute("style", "left:" + (col * grid_chunk) + "%;");
      }
      this.sockets = [];
      for (col = _k = 0, _ref2 = this.size; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; col = 0 <= _ref2 ? ++_k : --_k) {
        _fn = (function(_this) {
          return function() {
            var pos;
            pos = _this.sockets.length;
            return socket.onclick = function(event) {
              return _this.placement_event(pos);
            };
          };
        })(this);
        for (row = _l = 0, _ref3 = this.size; 0 <= _ref3 ? _l < _ref3 : _l > _ref3; row = 0 <= _ref3 ? ++_l : --_l) {
          socket = Create("empty", inner);
          socket.player = 0;
          socket.resize(row * grid_chunk - stone_size * 0.5, col * grid_chunk - stone_size * 0.5, stone_size, stone_size, "position:absolute;");
          _fn();
          this.sockets.push(socket);
          this.board_state.push(0);
        }
      }
    }

    Board.prototype.register = function(func) {
      return this.callbacks.push(func);
    };

    Board.prototype.placement_event = function(pos) {
      var func, _i, _len, _ref, _results;
      _ref = this.callbacks;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        func = _ref[_i];
        _results.push(func(pos));
      }
      return _results;
    };

    Board.prototype.place = function(pos, stone) {
      if (pos > Math.pow(this.size, 2)) {
        throw "Requested position not within board size.";
      }
      return this.board_state[pos] = stone;
    };

    Board.prototype.dump_state = function() {
      return this.board_state.slice(0);
    };

    Board.prototype.load_state = function(state) {
      if (state.length !== Math.pow(this.size, 2)) {
        throw "Invalid State Size";
      }
      return this.board_state = state.slice(0);
    };

    Board.prototype.update = function(player) {
      var pos, _i, _ref, _results;
      _results = [];
      for (pos = _i = 0, _ref = this.sockets.length; 0 <= _ref ? _i < _ref : _i > _ref; pos = 0 <= _ref ? ++_i : --_i) {
        if (this.board_state[pos] !== this.sockets[pos].player) {
          this.sockets[pos].setAttribute("class", this.stone_class[this.board_state[pos]]);
          this.sockets[pos].player = this.board_state[pos];
        }
        if (this.sockets[pos].player === 0) {
          _results.push(this.sockets[pos].setAttribute("class", this.stone_class[player + 2]));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Board.prototype.get_player = function(pos) {
      if (pos > Math.pow(this.size, 2)) {
        throw "Requested position not within board size.";
      }
      return this.board_state[pos];
    };

    Board.prototype.get_surroundings = function(pos) {
      var dir, dir_check, surroundings;
      surroundings = {};
      dir = pos - 1;
      dir_check = dir % this.size;
      if (dir_check !== this.size - 1 && dir_check >= 0) {
        surroundings.left = dir;
      }
      dir = pos + 1;
      dir_check = dir % this.size;
      if (dir_check !== 0 && dir_check <= this.size) {
        surroundings.right = dir;
      }
      dir = pos - this.size;
      if (dir >= 0) {
        surroundings.up = dir;
      }
      dir = pos + this.size;
      if (dir < Math.pow(this.size, 2)) {
        surroundings.down = dir;
      }
      return surroundings;
    };

    Board.prototype.get_connected_stones = function(pos) {
      var dir, dir_pos, group, player, stack, _ref;
      group = [pos];
      player = this.get_player(pos);
      stack = [pos];
      while (stack.length > 0) {
        pos = stack.pop();
        _ref = this.get_surroundings(pos);
        for (dir in _ref) {
          dir_pos = _ref[dir];
          if (this.get_player(dir_pos) === player && __indexOf.call(group, dir_pos) < 0) {
            group.push(dir_pos);
            stack.push(dir_pos);
          }
        }
      }
      return group;
    };

    Board.prototype.get_liberties = function(group) {
      var dir, dir_pos, liberties, pos, _i, _len, _ref;
      liberties = [];
      for (_i = 0, _len = group.length; _i < _len; _i++) {
        pos = group[_i];
        _ref = this.get_surroundings(pos);
        for (dir in _ref) {
          dir_pos = _ref[dir];
          if (this.get_player(dir_pos) === 0 && __indexOf.call(liberties, dir_pos) < 0) {
            liberties.push(dir_pos);
          }
        }
      }
      return liberties;
    };

    Board.prototype.is_surrounded = function(pos) {
      var group, liberties, player;
      player = this.get_player(pos);
      if (player !== 0) {
        group = this.get_connected_stones(pos);
        liberties = this.get_liberties(group);
        if (liberties.length > 0) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    };

    return Board;

  })();

  this.Board = Board;

}).call(this);

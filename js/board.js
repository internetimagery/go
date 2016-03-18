(function() {
  var Board, Create, Resize;

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
      this.callbacks = Array();
      this.stone_class = Array("empty", "stone set white", "stone set black");
      if (this.size < 2) {
        throw "Board size not big enough.";
      }
      grid_chunk = 100 / (this.size - 1);
      stone_size = grid_chunk * 1;
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
      this.sockets = Array();
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
        }
      }
    }

    Board.prototype.place = function(pos, stone) {
      if (pos > Math.pow(this.size, 2)) {
        throw "Requested position not within board size.";
      }
      this.sockets[pos].setAttribute("class", this.stone_class[stone]);
      return this.sockets[pos].player = stone;
    };

    Board.prototype.get_player = function(pos) {
      if (pos > Math.pow(this.size, 2)) {
        throw "Requested position not within board size.";
      }
      return this.sockets[pos].player;
    };

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

    return Board;

  })();

  this.Board = Board;

}).call(this);

(function() {
  var Board, Create, Resize, b;

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
    function Board(element, rows, cols) {
      var col, col_chunk, inner, inner_frame_pos, inner_frame_span, row, row_chunk, socket, socket_row, stone_size, _fn, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3;
      this.rows = rows;
      this.cols = cols;
      if (this.rows < 2 || this.cols < 2) {
        throw "Board size not big enough.";
      }
      stone_size = 200 / (this.rows + this.cols);
      inner = Create("grid", element);
      inner_frame_pos = stone_size * 0.6;
      inner_frame_span = 100 - inner_frame_pos * 2;
      inner.resize(inner_frame_pos, inner_frame_pos, inner_frame_span, inner_frame_span, "position:relative;");
      element.appendChild(inner);
      row_chunk = 100 / (this.rows - 1);
      col_chunk = 100 / (this.cols - 1);
      for (row = _i = 0, _ref = this.rows; 0 <= _ref ? _i < _ref : _i > _ref; row = 0 <= _ref ? ++_i : --_i) {
        Create("line horiz", inner).setAttribute("style", "top:" + (row * row_chunk) + "%;");
      }
      for (col = _j = 0, _ref1 = this.cols; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; col = 0 <= _ref1 ? ++_j : --_j) {
        Create("line vert", inner).setAttribute("style", "left:" + (col * col_chunk) + "%;");
      }
      this.sockets = Array();
      for (row = _k = 0, _ref2 = this.rows; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; row = 0 <= _ref2 ? ++_k : --_k) {
        socket_row = Array();
        _fn = (function(_this) {
          return function(row, col) {
            return socket.onclick = function(event) {
              return _this.placement_event(row, col, event);
            };
          };
        })(this);
        for (col = _l = 0, _ref3 = this.cols; 0 <= _ref3 ? _l < _ref3 : _l > _ref3; col = 0 <= _ref3 ? ++_l : --_l) {
          socket = Create("empty", inner);
          socket.resize(row * row_chunk - stone_size * 0.5, col * col_chunk - stone_size * 0.5, stone_size, stone_size, "position:absolute;");
          _fn(row, col);
          socket_row.push(socket);
        }
        this.sockets.push(socket_row);
      }
    }

    Board.prototype.place = function(row, col, stone) {
      if (this.rows <= row || this.cols <= col) {
        throw "Requested position not within board size.";
      }
      return this.sockets[row][col].setAttribute("class", stone);
    };

    Board.prototype.placement_event = function(row, col, event) {
      return console.log("Clicked: ", row, col, event);
    };

    return Board;

  })();

  b = new Board(document.getElementById("board"), 8, 8);

  b.place(2, 2, "stone set white");

  b.place(5, 4, "stone set black");

  b.place(7, 1, "stone set black");

  b.place(5, 3, "stone set white");

}).call(this);

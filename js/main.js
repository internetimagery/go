(function() {
  var b, formBoard, genPositions, getPositions, parseBoard, parseURL, player;

  parseURL = function() {
    var elem, parse, query, url;
    url = window.location.href;
    elem = document.createElement("a");
    elem.href = url;
    query = decodeURI(elem.hash || elem.search);
    parse = {};
    query.replace(/([^?#=&]+)(=([^&]*))?/g, function($0, $1, $2, $3) {
      return parse[$1] = $3;
    });
    return parse;
  };

  getPositions = function(num) {
    return num.toString(2);
  };

  genPositions = function(pos) {
    return parseInt(pos, 2);
  };

  formBoard = function(size, white, black) {
    var black_pos, board, full_size, i, row, tmp, white_pos, _i, _ref;
    full_size = Math.pow(size, 2);
    board = Array();
    row = Array();
    tmp = Array();
    for (i = _i = 1, _ref = full_size + 1; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
      white_pos = parseInt(white.charAt(white.length - i));
      black_pos = parseInt(black.charAt(black.length - i));
      if (white_pos && black_pos) {
        throw "Invalid Board Configuration";
      } else if (white_pos) {
        row.push("white");
      } else if (black_pos) {
        row.push("black");
      } else {
        row.push("");
      }
      if (row.length === size) {
        board.push(row);
        row = Array();
      }
    }
    return board;
  };

  parseBoard = function(board) {
    var black, black_pos, cell, result, row, white, white_pos, _i, _j, _len, _len1;
    white = "";
    black = "";
    for (_i = 0, _len = board.length; _i < _len; _i++) {
      row = board[_i];
      for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
        cell = row[_j];
        white_pos = "0";
        black_pos = "0";
        if (cell === "white") {
          white_pos = "1";
        } else if (cell === "black") {
          black_pos = "1";
        }
        white = white_pos + white;
        black = black_pos + black;
      }
    }
    return result = {
      white: white,
      black: black
    };
  };

  b = new Board(document.getElementById("board"), 8, 8);

  player = "black";

  b.register(function(row, col, event) {
    console.log("Clicked! ->", row, col, event);
    if (player === "white") {
      player = "black";
    } else {
      player = "white";
    }
    return b.place(row, col, "stone set " + player);
  });

  b.place(2, 2, "stone set white");

  b.place(5, 4, "stone set black");

  b.place(7, 1, "stone set black");

  b.place(5, 3, "stone set white");

}).call(this);

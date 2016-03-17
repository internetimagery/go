(function() {
  var board, board_dimensions, border_margin, create, drawBoard, formBoard, game, genPositions, getPositions, inner_board, line, lines, parseBoard, parseURL, preload, render, update;

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

  drawBoard = function(board) {
    var board_elem;
    board_elem = document.getElementById("board");
    return console.log(board_elem);
  };

  board_dimensions = Array(400, 400);

  border_margin = 0.05;

  board = formBoard(4, "10100", "000000001");

  inner_board = null;

  lines = Array();

  line = null;

  preload = function() {
    return game.load.image("wood", "img/purty_wood.png");
  };

  create = function() {
    var margin_nset;
    game.add.image(0, 0, "wood");
    margin_nset = 1 - border_margin * 2;
    inner_board = new Phaser.Rectangle(border_margin * board_dimensions[0], border_margin * board_dimensions[1], margin_nset * board_dimensions[0], margin_nset * board_dimensions[1]);
    console.log(inner_board);
    return line = new Phaser.Line(2, 4, 300, 200);
  };

  update = function() {};

  render = function() {
    game.debug.geom(inner_board, "#000000");
    return game.debug.geom(line, "#000000");
  };

  game = new Phaser.Game(board_dimensions[0], board_dimensions[1], Phaser.AUTO, document.getElementById("board"), {
    preload: preload,
    create: create,
    update: update,
    render: render
  });

}).call(this);

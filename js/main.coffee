# Game Code

# Parse out url parameters
parseURL = ()->
  url = window.location.href # Get current URL
  elem = document.createElement("a") # Create temporary element
  elem.href = url # Apply url for built in parsing
  query = decodeURI(elem.hash || elem.search) # Pull out query
  parse = {}
  query.replace /([^?#=&]+)(=([^&]*))?/g, ($0, $1, $2, $3)->
    parse[$1] = $3
  return parse

# Get bit positions from a number
getPositions = (num)->
  num.toString(2)

# Generate number given positions
genPositions = (pos)->
  parseInt(pos, 2)

# Build out a board given positions of stones
formBoard = (size, white, black)->
  full_size = size ** 2
  board = Array() # Initialize board
  row = Array() # First row
  tmp = Array()
  for i in [1 ... full_size + 1] # fill in the board backwards, reading right to left on the binary positions
    white_pos = parseInt(white.charAt(white.length - i)) # Get stone positions
    black_pos = parseInt(black.charAt(black.length - i))
    if white_pos and black_pos # White and Black cannot occupy the same space
      throw "Invalid Board Configuration"
    else if white_pos # add board position
      row.push("white")
    else if black_pos
      row.push("black")
    else
      row.push("")
    if row.length == size
      board.push(row)
      row = Array()
  return board

# Parse a board into its positions
parseBoard = (board)->
  white = ""
  black = ""
  for row in board
    for cell in row
      white_pos = "0"
      black_pos = "0"
      if cell == "white"
        white_pos = "1"
      else if cell == "black"
        black_pos = "1"
      white = white_pos + white
      black = black_pos + black
  result =
    white: white
    black: black







b = new Board(document.getElementById("board"), 8, 8)
player = "black"
b.register (row, col, event)->
  console.log "Clicked! ->", row, col, event
  if player == "white"
    player = "black"
  else
    player = "white"
  b.place(row, col, "stone set #{player}")

b.place(2, 2, "stone set white")
b.place(5, 4, "stone set black")
b.place(7, 1, "stone set black")
b.place(5, 3, "stone set white")



# Protocal
# Grab chunks of two? ie 00 = empty, 10 = white, 01 = black
# board binary = board position in binary working left to right top to bottom. So a number 5 (101) would be a stone in the first position and third
# white = board-binary (white positions)
# black = board-binary (black positions)
# turn = white/black
# last = board-binday previous board position for last player?
# size = boardsize

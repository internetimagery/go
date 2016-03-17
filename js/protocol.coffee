# Game state protocol

# THE PROTOCOL
  # Example "4-45-32123"
  # - Board size
  # - Turn number
  # - board state

# BOARD STATE
  # - Read as binary (ie: "00110110111")
  # - Chunk into 2's (ie: "00", "11", "01")
  # - Run through binary in reverse, run through board left to right, top to bottom
  # - 00 = empty, 01 = white, 10 = black, 11 = unused

# Pad out string
pad = (str, val, len)->
  while str.length < len
    str += val
  return str

# Count an arbitrary number
class Counter
  constructor: (@base) ->
    @value = 0
    @next = null
  add: ()->
    @value += 1
    if @value >= @base
      @value = 0
      if @next == null
        @next = new Counter(@base)
        @next.add()
      else
        @next.add()

  concat: ()->
    num = @value.toString()
    if @next != null
      num = @next.concat() + num
    return num

# Get our query to parse
URL = document.createElement("a") # Create temporary element
URL.href = window.location.href # Apply url for built in parsing

# Convert binary to nested board
binary_to_board = (binary, size)->
  board = Array()
  row = Array()
  for chunk in binary
    chunk = parseInt(chunk)
    switch chunk
      when 1
        row.push(1) # White
      when 10
        row.push(2) # Black
      else
        row.push(0) # Empty
    if row.length is size
      board.push(row) # Add row, and start a new one
      row = Array()
  return board

# Get the current game state
get_game_state = ()->
  parts = URL.hash.substring(1).split("-")
  if parts.length == 3 # Check we have all the parts we need
    size = parseInt(parts[0]) # Row count (or column count. Square!)
    turn = parseInt(parts[1]) # Number of turns
    state_id = parseInt(parts[2]) # ID of game state

    if not isNaN(size) and not isNaN(turn) and not isNaN(state_id) # Quick validation
      cell_num = size ** 2 # Number of cells in square board
      state_pos = pad(state_id.toString(2), "0", cell_num * 4) # Get our binaries. 4 = two bytes per chunk, two states
      current = Array() # Current game state
      last = Array() # Previous game state
      for a in [0 ... cell_num * 2] # Loop our states
        b = a * 2
        chunk = state_pos.substring(b, b+2) # Split the sequence into chunks
        if a < cell_num
          current.push(chunk)
        else
          last.push(chunk)

      state =
        size: size # Size of board
        turn_number: turn # How many turns have passed
        player: turn % 2 # Current player : 0 = white, 1 = black
        current: binary_to_board(current, size) # Current board state
        last: binary_to_board(last, size) # Last board state
      return state

  throw "Invalid URL and Game State"

# Convert current game state to URL
put_game_state = (state)->
  size = parseInt(state.size)
  turn = parseInt(state.turn_number)

  if isNaN(size) or isNaN(turn) or state.current.length isnt state.last.length # Quick check
    throw "Invalid Game State"

  binary_stream = "" # Rebuild Binary
  for stream in Array(state.current, state.last)
    for row in stream
      for col in row
        switch col
          when 1 # White
            binary_stream += "01"
          when 2 # Black
            binary_stream += "10"
          else
            binary_stream += "00"

  test = ""
  for i in [0 ... 19 ** 2 * 4]
    test += "1"
  console.log parseInt(test, 2)
  state_id = parseInt("000001001001100010100010011001001001001010100100100000000000000000000000", 2)


  console.log state_id



state = get_game_state()
console.log state
put_game_state(state)
#
#
#
#   query = decodeURI(elem.hash || elem.search) # Pull out query
#   parse = {}
#   query.replace /([^?#=&]+)(=([^&]*))?/g, ($0, $1, $2, $3)->
#     parse[$1] = $3
#   return parse
#
# # Get bit positions from a number
# getPositions = (num)->
#   num.toString(2)
#
# # Generate number given positions
# genPositions = (pos)->
#   parseInt(pos, 2)
#
# # Build out a board given positions of stones
# formBoard = (size, white, black)->
#   full_size = size ** 2
#   board = Array() # Initialize board
#   row = Array() # First row
#   tmp = Array()
#   for i in [1 ... full_size + 1] # fill in the board backwards, reading right to left on the binary positions
#     white_pos = parseInt(white.charAt(white.length - i)) # Get stone positions
#     black_pos = parseInt(black.charAt(black.length - i))
#     if white_pos and black_pos # White and Black cannot occupy the same space
#       throw "Invalid Board Configuration"
#     else if white_pos # add board position
#       row.push("white")
#     else if black_pos
#       row.push("black")
#     else
#       row.push("")
#     if row.length == size
#       board.push(row)
#       row = Array()
#   return board
#
# # Parse a board into its positions
# parseBoard = (board)->
#   white = ""
#   black = ""
#   for row in board
#     for cell in row
#       white_pos = "0"
#       black_pos = "0"
#       if cell == "white"
#         white_pos = "1"
#       else if cell == "black"
#         black_pos = "1"
#       white = white_pos + white
#       black = black_pos + black
#   result =
#     white: white
#     black: black

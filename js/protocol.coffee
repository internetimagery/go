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

# Get our query to parse
get_url_parts = ()->
  url = window.location.href # Get current URL
  elem = document.createElement("a") # Create temporary element
  elem.href = url # Apply url for built in parsing
  elem.hash.substring(1, elem.hash.length).split("-")

# Get the current game state
get_game_state = ()->
  parts = get_url_parts()
  if parts.length == 3 # Check we have all the parts we need
    size = parseInt(parts[0])
    turn = parseInt(parts[1])
    state_id = parseInt(parts[2])

    if not isNaN(size) and not isNaN(turn) and not isNaN(state_id) # Quick validation
      state_pos = pad(state_id.toString(2), "0", size * 4) # Get our binaries
      state =
        size: size # Size of board
        turn_number: turn # How many turns have passed
        player: turn % 2 # Current player : 0 = white, 1 = black
        current: Array() # Current board state
        last: Array() # Last board state
      for a in [0 ... size * 2] # Loop our current state
        b = a * 2
        chunk = state_pos.substring(b, b+2) # Split the sequence into chunks
        if a < size
          state.current.push(chunk)
        else
          state.last.push(chunk)
      return state

  throw "Invalid URL and Game State"

console.log get_game_state()
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

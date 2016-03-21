# Dead simple URL protocol

# Example - http://host.com/page.html#19001033022002

# RULES
  # - Enforce a limit of 2000 characters to the URL.
  # - Assume 50 characters for use in domain / host / page / etc.
  # - First digit referse to game type. 10 potential options.
  # - Next two digits refer to board size.
  # - Board size limit is 2 - 62.
  # - Split the following digits into chunks of 2. Chunks represent a turn each.
  # - Turns in chronilogical order
  # - Chunks are board positions or two dashes is a pass
  # - Turn limit of 973
  # - Number of turns and current game state can be determined by looking at the history
  # - Current player can be determined by turn number

move_chars = ["0","1","2","3","4","5","6","7","8","9",
"a","b","c","d","e","f","g","h","i","j","k","l","m",
"n","o","p","q","r","s","t","u","v","w","x","y","z",
"A","B","C","D","E","F","G","H","I","J","K","L","M",
"N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

# Decode a move
decode_move = (move, size)->
  row = move_chars.indexOf(move[0]) * size
  col = move_chars.indexOf(move[1])
  if row == -1 or col == -1
    throw "Bad Move #{move}."
  return row + col

# Turn move into text
encode_move = (move, size)->
  row = move_chars[move // size]
  col = move_chars[move % size]
  return row.concat(col)

# Games data represented
class Game_Data
  constructor: ()->
    @mode = 0 # Game mode
    @board_size = 9 # Size of one edge of a square board. DEFAULT 9
    @moves = [] # Moves played
    @current = 0 # Current viewing position of game
# Add a new move
  add_move: (move)->
    if move > @board_size ** 2
      throw "Move is too large to fit on the board"
    @moves.push(move)
 # Get ID that represents game viewable.
  write_id: ()->
    size = "00#{@board_size}"[-2 ..]
    moves = (encode_move(move, @board_size) for move in @moves)[... @current].join("")
    return @mode + size + moves
# Load a game ID into the object
  read_id: (id)->
    if id.length >= 3 # Check we have something.
      console.log "Validating game data..."

      mode = parseInt(id[0]) # Get game mode
      if isNaN(mode)
        throw "Invalid Game Mode"

      board_size = parseInt(id[1 .. 2]) # Get board size
      if isNaN(board_size) or board_size < 2 or board_size > 31 # Validate its size
        throw "Invalid Board Size. Sizes must be between 2 and 31."

      turns = id[3 ...] # Trim off just the turns data

      if turns.length % 2 != 0 # Check our data fits into even chunks
        throw "Possible corrupt game data..."

      if turns.length / 2 > 973 # Check for turn limit
        console.warn "Turn limit of 973 exceeded. Urls may not work on some browsers."

      cell_num = board_size ** 2 # Number of cells in board (square)
      moves = []
      for chunk in [0 ... turns.length / 2]
        chunk *= 2
        chunk_data = turns[chunk ... chunk + 2]
        console.log "data", chunk_data
        if chunk_data == "--" # Special case. We have a "PASS"
          moves.push(chunk_data)
        else
          chunk_data = decode_move(chunk_data, board_size)
          if isNaN(chunk_data) or chunk_data > cell_num
            throw "Invalid Turn @ #{chunk / 3}."
          else
            moves.push(chunk_data)
      @mode = mode
      @board_size = board_size
      @moves = moves
      @current = moves.length
      console.log "Valid!"

  # Export Function
this.Game_Data = Game_Data

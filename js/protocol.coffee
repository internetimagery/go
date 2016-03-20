# Dead simple URL protocol

# Example - http://host.com/page.html#19001033022002

# RULES
  # - Enforce a limit of 2000 characters to the URL.
  # - Assume 50 characters for use in domain / host / page / etc.
  # - All digits and dashes, following a hash.
  # - First digit referse to game type. 10 potential options.
  # - Next two digits refer to board size.
  # - Board size limit is 2 - 31.
  # - Split the following digits into chunks of 3. Chunks represent a turn each.
  # - Turns in chronilogical order
  # - Chunks are board positions or three dashes is a pass
  # - Turn limit of 649
  # - Number of turns and current game state can be determined by looking at the history
  # - Current player can be determined by turn number

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
    @moves.push("000#{move}"[-3 ..])
 # Get ID that represents game virewable.
  write_id: ()->
    size = "00#{@board_size}"[-2 ..]
    moves = ("000#{move}"[-3 ..] for move in @moves).join("")
    return @mode + size + moves
# Load a game ID into the object
  read_id: (id)->
    if id.length > 0 # Check we have something.
      console.log "Validating game data..."

      if id.length % 3 != 0 # Check our data fits into even chunks
        throw "Possible corrupt game data..."

      if id.length / 3 > 649 # Check for turn limit
        console.warn "Turn limit of 649 exceeded. Urls may not work on some browsers."

      mode = parseInt(id[0]) # Get game mode
      if isNaN(mode)
        throw "Invalid Game Mode"

      board_size = parseInt(id[1 .. 2]) # Get board size
      if isNaN(board_size) or board_size < 2 or board_size > 31 # Validate its size
        throw "Invalid Board Size. Sizes must be between 2 and 31."

      cell_num = board_size ** 2 # Number of cells in board (square)
      moves = []
      for chunk in [1 ... id.length / 3]
        chunk *= 3
        chunk_data = id[chunk ... chunk + 3]
        if chunk_data == "---" # Special case. We have a "PASS"
          moves.push(chunk_data)
        else
          chunk_data = parseInt(chunk_data)
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

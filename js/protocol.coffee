# Dead simple URL protocol

# Example - http://host.com/page.html#19001033022002

# RULES
  # - Enforce a limit of 2000 characters to the URL for older browsers.
  # - Assume 50 characters for use in domain / host / page / etc. Leaving us 1950 chars.
  # - First digit referse to game type. 10 potential options. Currently unused... perhaps komi
  # - Next two digits refer to board size. Limit 3 - 52 size.
  # - Split the following digits into chunks of 2. Chunks represent a turn each.
  # - Turns in chronilogical order
  # - Special cases: "[]" is a pass. Moves in "()" are setups. Game rules don't apply to these moves and they replace whatever already exists on the board.
  # - "()" Sections are divided through passes "[]". Black, White, Removal
  # - Decoded. Moves are an int each. Null for a pass. Negative moves are forced subtraction. Moves larger than boardsize ** 2 are forced addition.
  # - Turn limit of 973
  # - Number of turns and current game state can be determined by looking at the history
  # - Current player is determined by turn number

move_chars = ["a","b","c","d","e","f","g","h","i","j","k","l","m",
"n","o","p","q","r","s","t","u","v","w","x","y","z",
"A","B","C","D","E","F","G","H","I","J","K","L","M",
"N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

# Decode a move
decode_move = (move, size)->
  if move == "[]" # A Pass
    return null
  else
    row = move_chars.indexOf(move[0]) * size
    col = move_chars.indexOf(move[1])
    if row == -1 or col == -1
      throw "Bad Move #{move}."
    return row + col

# Turn move into text
encode_move = (move, size)->
  if move == null # A Pass
    return "[]"
  else
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
    if move != null and move > @board_size ** 2
      throw "Move is too large to fit on the board"
    @moves.push(move)
 # Get ID that represents game viewable.
  write_id: ()->
    size = "00#{@board_size}"[-2 ..]
    moves = []
    for i in [0 ... @current]
      move = @moves[i]
      if Array.isArray(move) # We have a forced placement
        placement = ((encode_move(b, @board_size) for b in a).join("") for a in move)
        moves.push("(#{placement.join(encode_move(null, @board_size))})")
      else
        moves.push(encode_move(move, @board_size))
    return @mode + size + moves.join("")
# Load a game ID into the object
  read_id: (id)->
    if id.length >= 3 # Check we have something.
      console.log "Validating game data..."

      mode = parseInt(id[0]) # Get game mode
      if isNaN(mode)
        throw "Invalid Game Mode"

      board_size = parseInt(id[1 .. 2]) # Get board size
      if isNaN(board_size) or board_size < 3 or board_size > move_chars.length # Validate its size
        throw "Invalid Board Size. Sizes must be between 3 and #{move_chars.length}."

      turns = id[3 ...] # Trim off just the turns data

      if turns.length % 2 != 0 # Check our data fits into even chunks
        throw "Possible corrupt game data..."

      if turns.length / 2 > 973 # Check for turn limit
        console.warn "Turn limit of 973 exceeded. Urls may not work on some browsers."

      cell_num = board_size ** 2 # Number of cells in board (square)
      moves = []
      buffer = []
      placement_bucket = [] # All our placement requests. Black / White / Removal
      placement_buffer = []
      placement_zone = false
      for char in [0 ... turns.length]
        if turns[char] == "("
          placement_zone = true # We are in the special zone
          placement_bucket = [] # Init our buckets
          placement_section = [] # Section we're working with
        else if turns[char] == ")"
          placement_zone = false # We have left the zone
          placement_bucket.push(placment_buffer)
          for i in [0 ... 3 - placement_bucket.length] # Ensure we have a grouping of three
            placement_bucket.push([])
          moves.push(placement_bucket) # Add final move list
        else if buffer.length != 2
          buffer.push(turns[char])
        else
          chunk_data = decode_move(buffer.join(""), board_size)
          buffer = []
          if isNaN(chunk_data) or (chunk_data != null and chunk_data > cell_num)
            throw "Invalid Turn @ #{moves.length}."
          else
            if placement_zone # We are performing a placement setup
              if chunk_data == null # moving to next placement section
                placement_bucket.push(placement_section)
                placement_section = [] # Reset
              else
                placement_section.push(chunk_data) # Add to section
            else
              moves.push(chunk_data)
      @mode = mode
      @board_size = board_size
      @moves = moves
      @current = moves.length
      console.log "Valid!"

  # Load SGF file
  load_sgf: (file)->
    game = smartgamer sgf_parse file
    info = game.getGameInfo()
    colour = ["B", "W"]
    if info.GM != "1"
      throw "Game file is not a game of GO."

    mode = "0"
    board_size = parseInt(info.SZ)
    moves = []
    game.first() # Move to start
    for i in [0 ... game.totalMoves()]
      node = game.node() # Get the current node

      # Check for forced placement nodes. Booo!
      if node.AB or node.AW or node.AE
        forced = [
          (decode_move(m, board_size) for m in node.AB or [])
          (decode_move(m, board_size) for m in node.AW or [])
          (decode_move(m, board_size) for m in node.AE or [])
        ]
        moves.push(forced)

      # Check for actual plays! Yay!
      if node.W or node.B
        move = node[colour[i % 2]]
        if not move # We're at the wrong move. Insert a pass to put us back on track
          moves.push(null)
          move = node[colour[(i + 1) % 2]]
        move = "[]" if move == "[tt]" # Support FF[3] passing.
        moves.push(decode_move(move, board_size))

    @mode = mode
    @board_size = board_size
    @moves = moves
    @current = moves.length

  # Export Function
this.Game_Data = Game_Data

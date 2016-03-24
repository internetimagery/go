# Dead simple URL protocol

# Example - http://host.com/page.html#19001033022002

# RULES
  # - Enforce a limit of 2000 characters to the URL for older browsers.
  # - Assume 50 characters for use in domain / host / page / etc. Leaving us 1950 chars.
  # - First digit referse to game type. 10 potential options. Currently unused... perhaps komi
  # - Next two digits refer to board size. Limit 3 - 52 size.
  # - Split the following digits into chunks of 2. Chunks represent a turn each.
  # - Turns in chronilogical order
  # - Special cases: "[]" is a pass. "--" the following stone is to be removed
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
  else if move == "--" # Marking next stone for forced removal
    return -1
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
  else if move < 0 # Stone marked for forced removal
    return "--"
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
      if isNaN(board_size) or board_size < 3 or board_size > move_chars.length # Validate its size
        throw "Invalid Board Size. Sizes must be between 3 and #{move_chars.length}."

      turns = id[3 ...] # Trim off just the turns data

      if turns.length % 2 != 0 # Check our data fits into even chunks
        throw "Possible corrupt game data..."

      if turns.length / 2 > 973 # Check for turn limit
        console.warn "Turn limit of 973 exceeded. Urls may not work on some browsers."

      cell_num = board_size ** 2 # Number of cells in board (square)
      moves = []
      for chunk in [0 ... turns.length / 2]
        chunk *= 2
        chunk_data = decode_move(turns[chunk ... chunk + 2], board_size)
        if isNaN(chunk_data) or (chunk_data != null and chunk_data > cell_num)
          throw "Invalid Turn @ #{chunk / 3}."
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
      play = i % 2

      # Check for forced placement nodes. Booo!
      if node.AB or node.AW
        AB = node.AB or []
        AW = node.AW or []
        for i in [0 .. Math.max(AB.length, AW.length)] # Play out the sequence
          place = [AB[i], AW[i]]
          p1 = place[play]
          p2 = place[(i + 1) % 2]
          moves.push(if p1 then decode_move(p1, board_size) else null)
          moves.push(if p2 then decode_move(p2, board_size) else null)
      if node.AE # We have some stones that need removing forcefully
        for stone in node.AE or []
          moves.push(-1) # Mark the next stone for removal
          moves.push(decode_move(stone))

      # Check for actual plays! Yay!
      move = node[colour[play]]
      move = "[]" if move == "[tt]" or not move # Support FF[3] passing.
      moves.push(decode_move(move, board_size))

    @mode = mode
    @board_size = board_size
    @moves = moves
    @current = moves.length

  # Export Function
this.Game_Data = Game_Data

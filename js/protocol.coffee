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

# DEFAULTS
  # - Game mode 0
  # - Board size 9

class Game_Data
  constructor: ()->
    @mode = 0 # Game mode
    @board_size = 9 # Size of one edge of a square board
    @moves = [] # Moves played
    @current = 0 # Current viewing position of game
  get_id: ()-> # Get ID that represents game so far.
    size = "00#{@board_size}"[-2 ..]
    moves = ("000#{move}"[-3 ..] for move in @moves).join("")
    return @mode + size + moves

# Game Data Representation
Get_Game_Data = ()->
  game_data = new Game_Data()

  # Gather current information to generate state data
  url = document.createElement("a") # Temp link to leverage DOM parsing
  url.href = window.location.href # Pass in current URL
  data = url.hash # URL data

  # Validate possible technical issues in data
  if 1 < data.length # Check we have something. Discarding the hash
    console.log "Game Data found. Validating..."
    data = data.substring(1) # Chop off the hash

    if data.length % 3 != 0 # Check our data fits into even chunks
      throw "Possible corrupt game data..."

    if data.length / 3 > 649 # Check for turn limit
      console.warn "Turn limit of 649 exceeded. Urls may not work on some browsers."

    game_data.mode = parseInt(data[0]) # Get game mode
    if isNaN(game_data.mode)
      throw "Invalid Game Mode"

    game_data.board_size = parseInt(data[1 .. 2]) # Get board size
    if isNaN(game_data.board_size) or game_data.board_size < 2 or game_data.board_size > 31 # Validate its size
      throw "Invalid Board Size. Sizes must be between 2 and 31."

    cell_num = game_data.board_size ** 2 # Number of cells in board (square)
    for chunk in [1 ... data.length / 3]
      chunk *= 3
      chunk_data = data[chunk ... chunk + 3]
      if chunk_data == "---" # Special case. We have a "PASS"
        game_data.moves.push(chunk_data)
      else
        chunk_data = parseInt(chunk_data)
        if isNaN(chunk_data) or chunk_data > cell_num
          throw "Invalid Turn @ #{chunk / 3}."
        else
          game_data.moves.push(chunk_data)
    game_data.current = game_data.moves.length # Current position
    console.log "Valid!"
  else
    console.log "No game data found. Using defaults. Game mode 0. Board size 9."
    # Update URL to match defaults
    tmp_url = window.location.href.split("#")
    window.location.href = "#{tmp_url[0]}#009"

  console.log game_data.get_id()
  return game_data

# Export Function
this.get_game_data = Get_Game_Data

# Dead simple URL protocol

# Example - http://host.com/page.html#19001033022002

# RULES
  # - Enforce a limit of 2000 characters to the URL.
  # - Subtract 50 characters for use in domain / host / page / etc.
  # - All digits, following a hash.
  # - First two digits refer to board size.
  # - Board size limit is 2 - 31.
  # - Split the following digits into chunks of 3. Chunks represent a turn each.
  # - Turns in chronilogical order
  # - Turn limit of 650
  # - Number of turns and current game state can be determined by looking at the history
  # - Current player can be determined by turn number

# Game Data Representation
Get_Game_Data = ()->
  game_data =
    board_size: 0
    moves: Array()

  # Gather current information to generate state data
  url = document.createElement("a") # Temp link to leverage DOM parsing
  url.href = window.location.href # Pass in current URL
  data = url.hash # URL data

  # Validate technical issues in data
  if 1 < data.length # Check we have something. Discarding the hash
    console.log "Game Data found. Validating..."

    if data.length < 5 # Check we have a board size and at least one move
      throw "Invalid Game Data"

    game_data.board_size = parseInt(data.substring(1, 3)) # Pull out our board size
    if isNaN(game_data.board_size) or game_data.board_size < 2 or game_data.board_size > 31 # Validate its size
      throw "Invalid Board Size. Sizes must be between 2 and 31."

    turn_data = data.substring(3) # Take the remaining data
    if turn_data.length % 3 != 0 # Check we have turns in threes
      throw "Invalid Turn Data"

    cell_num = game_data.board_size ** 2 # Number of cells in the board.
    for i in [0 ... turn_data.length / 3] # Chunk the data
      i *= 3
      chunk = parseInt(turn_data.substring(i, i + 3))
      if isNaN(chunk) or chunk > cell_num # Check the move can fit on the board
        throw "Invalid Turn #{i / 3 + 1}."
      game_data.moves.push(chunk) # Add turn to our list

    if game_data.moves.length > 650 # Turn limit.
      throw "Turns exceeded turn limit of 650."

    console.log "Valid!"
  else
    console.log "No Game Data found."
  return game_data

# Export Function
this.get_game_data = Get_Game_Data

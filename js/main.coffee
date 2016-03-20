# Game Code

# TEST LAYOUT
#05001002005008007012011
#05---001002005008007012011---004006

# TODO: look into adding some animations
# TODO: add gnugpg signing option to url for authenticity "https://openpgpjs.org/"
# TODO: google style diagonal lined background to board
# TODO: make board size work nicely on desktop and mobile

# Capture a group
capture = (stone, board)->
  if board.get_player(stone) != 0 # Check in case another loop already captured this group
    group = board.get_connected_stones(stone)
    for stone in group
      board.place(stone, 0)

# Play a stone! Validate game rules!
play_stone = (player, pos, board, ko_check_move)->
  # Validate Placement
  if board.get_player(pos) != 0 # There is a stone already there
    throw "Illegal Move: Space occupied."

  # Place the stone on board
  board.place(pos, player)

  # Check if we can capture anything
  check_ko = false
  for dir, stone of board.get_surroundings(pos)
    if board.get_player(stone) != player and board.is_surrounded(stone) # Found one!
      capture(stone, board) # Take it!
      check_ko = true

  # Record board state
  new_state = board.dump_state()

  # Check for an illegal ko
  if check_ko and ko_check_move
    ko = true # Asume Ko unless we can prove otherwise
    for i in [0 ... new_state.length]
      if new_state[i] != ko_check_move[i] # Only one cell needs to not match to break out of Ko
        ko = false
        break
    if ko
      throw "Illegal Move: Ko."

  # Check if a suicide placement
  if board.is_surrounded(pos)
    throw "Illegal Move: Suicide."
  return new_state

# Lets go!
main = ()->

  # Start by getting some game data
  game_data = new Game_Data()
  game_states = [] # Record the state of the game as we progress

  # Parse ID from url
  url = window.location.href.split("#")
  if url.length == 2 and url[1] # If there is a hash we might have an ID
    console.log "!! LOADING GAME !!"
    game_data.read_id(url[1]) # Load game data
  else # No data to load? Set us up at default
    console.log "!! NEW GAME !!"
    window.location.href = "#{url[0]}##{game_data.write_id()}"

  # Initialize our board
  board = new Board(document.getElementById("board"), game_data.board_size)

  for move in game_data.moves
    if move == "---" # We have a pass
      if game_states.length == 0 # First entry into game states
        game_states.push(board.dump_state())
      else
        game_states.push(game_states[game_states.length - 2]) # Copy last game state
    else
      state = play_stone(game_states.length % 2 + 1, move, board, game_states[game_states.length - 1])
      game_states.push(state)
  game_data.current = game_states.length
  board.update() # Update board visuals

  # Allow the player to place stones!
  board.register (pos)->
    if game_data.current == game_states.length # Only add moves to the end of the game
      current_state = if game_states.length == 0 then board.dump_state() else game_states[game_states.length - 1]
      try
        current_state = play_stone(game_data.current % 2 + 1, pos, board, game_states[game_states.length - 2])
        game_states.push(current_state)
        game_data.current = game_states.length
        game_data.add_move(pos)
        window.location.href = "#{url[0]}##{game_data.write_id()}" # Let hash-hook update for us
      catch error
        alert error
      finally
        board.load_state(current_state) # This kinda doubles up. Ah well...
    else
      alert "Cannot add move. The game has progressed past this point."

  # Register dynamic changing of the board.
  window.onhashchange = ()->
    new_hash = window.location.href.split("#")
    if new_hash.length == 2 and new_hash[1].length > 3 and new_hash[1].length % 3 == 0 # Check we have a hash
      game_data.current = new_hash[1].length // 3 - 1
      view_state = game_states[game_data.current - 1]
      board.load_state(view_state)
      board.update()



main()

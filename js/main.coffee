# Game Code

# TEST LAYOUT
#05001002005008007012011
#05---001002005008007012011---004006

# TODO: add gnugpg signing option to url for authenticity "https://openpgpjs.org/"

# Small player indicator
indicate = (player)->
  element = [
    document.getElementById("player-black"),
    document.getElementById("player-white")]
  for e in element
    e.setAttribute("style", "")
  element[player].setAttribute("style", "box-shadow: 0px 0px 3px 3px yellow;")

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
    history.replaceState(0, "start", "#{url[0]}##{game_data.write_id()}")

  # Initialize our board
  board = new Board(document.getElementById("board"), game_data.board_size)

  # Load up any moves
  for move in game_data.moves
    if move == "---" # We have a pass
      if game_states.length == 0 # First entry into game states
        state = board.dump_state()
      else
        state = game_states[game_states.length - 2] # Copy last gamestate
    else
      state = play_stone(game_states.length % 2 + 1, move, board, game_states[game_states.length - 1])
    game_states.push(state) # Add state to list of states

    # Initialize browser history following game
    window.document.title = "Move #{game_states.length}"
    game_data.current = game_states.length
    state_url = "#{url[0]}##{game_data.write_id()}"
    if game_data.current == 0
      history.replaceState(game_states.length, "Start", state_url)
    else
      history.pushState(game_states.length, "Move #{game_data.current}", state_url)

  # Update visuals
  board.update(game_states.length % 2 + 1)
  indicate(game_states.length % 2)

  # Allow the player to place stones!
  board.register (pos)->
    if game_data.current == game_states.length # Only add moves to the end of the game
      current_state = if game_states.length == 0 then board.dump_state() else game_states[game_states.length - 1]
      try
        current_state = play_stone(game_data.current % 2 + 1, pos, board, game_states[game_states.length - 2])
        game_states.push(current_state)
        game_data.current = game_states.length
        game_data.add_move(pos)
        history.pushState(game_states.length, "Move #{game_states.length}", "#{url[0]}##{game_data.write_id()}")
        board.load_state(current_state)
        player = game_data.current % 2
        board.update(player + 1) # Draw board changes
        indicate(player)
      catch error
        board.load_state(current_state) # Undo
        alert error
    else
      alert "Cannot add move. The game has progressed past this point."

  # Update board to requested state
  window.addEventListener "popstate", (event)->
    move = parseInt(event.state)
    if isNaN(move)
      throw "Invalid game state!"
    console.log "Loaded game state #{move}."
    game_data.current = move
    board.load_state(game_states[move - 1])
    board.update(move % 2 + 1)
    indicate(move % 2)


main()

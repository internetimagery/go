# Game Code

# TEST LAYOUT
#05001002005008007012011
#05---001002005008007012011---004006

# TODO: errors as alert popups
# TODO: alternate turns
# TODO: add game mode bit to front of protocol
# TODO: add default "009" to url if no board is specified
# TODO: keep game state separate to board state, and sync the two with a "draw" function
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

# Play a stone!
play_stone = (player, pos, board, ko_check_move)->
  # Validate Placement
  if board.get_player(pos) != 0 # There is a stone already there
    throw "Illegal Move: Space occupied."

  # Place the stone on board
  state_backup = board.dump_state()
  board.place(pos, player)

  # Check if we can capture anything
  check_ko = false
  for dir, stone of board.get_surroundings(pos)
    if board.is_surrounded(stone) # Found one!
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
      board.load_state(state_backup)
      throw "Illegal Move: Ko."

  # Check if a suicide placement
  if board.is_surrounded(pos)
    board.load_state(state_backup) # last_move cannot be undefined as you cannot be surrounded on first move
    throw "Illegal Move: Suicide."

  # Update our board with the new move and return the new state
  board.update()
  return new_state

# Lets go!
main = ()->

  # Start by getting some game data
  # TODO: Add warning popup if gamedata throws error, and try/catch block here
  # TODO: Could always use alerts, probably best
  game_data = get_game_data() # URL parsed information
  game_states = [] # Record the state of the board
  current_turn = 0 # Where we are currently
  board = new Board(document.getElementById("board"), game_data.board_size)

  if game_data.board_size == 0
    console.log "!! NEW GAME !!"
    # TODO: add board size creation window
    # TODO: In hindsight this isn't required. we can link to a sized board

  else
    console.log "!! LOADING GAME !!"
    # TODO: Add the ability to traverse game states
    for move in game_data.moves
      if move == "---" # Move is a pass
        game_states.push(game_states[game_states.length - 2]) # Copy the last game state
      else
        state = play_stone(game_states.length % 2 + 1, move, board, game_states[game_states.length - 1])
        game_states.push(state)
    current_turn = game_states.length

  # Allow the player to place stones!
  board.register (pos)->
    play_stone(current_turn % 2 + 1, pos, board, game_states[game_states.length - 2])




main()

# Game Code

# TEST LAYOUT
#05001002005008007012011
#05---001002005008007012011---004006

# TODO: ko check
# TODO: errors as alert popups
# TODO: alternate turns
# TODO: add game mode bit to front of protocol
# TODO: change hard limit of 650 turns to warnings
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
    console.log "Capturing group"

# Play a stone!
play_stone = (player, pos, board, last_move)->
  # Validate Placement
  if board.get_player(pos) != 0 # There is a stone already there
    throw "Placement Failed: Stone is already there."

  # Place the stone on board
  board.place(pos, player)

  # Check if we can capture anything
  check_ko = false
  for dir, stone of board.get_surroundings(pos)
    if board.is_surrounded(stone) # Found one!
      capture(stone, board) # Take it!
      check_ko = true

  # Check for an illegal ko
  if check_ko
    console.log "checking ko"

  # TODO: Check if capturing created a KO

  # Check if a suicide placement
  if board.is_surrounded(pos)
    board.place(pos, 0) # Undo placement
    throw "Placement Failed: Position is Suicide."

  # console.log "Placed stone at position #{pos}.", board.get_surroundings(pos)
  return board.dump_state()


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
        game_states.push(game_states[game_states.length - 1]) # Copy the last game state
      else
        state = play_stone(game_states.length % 2 + 1, move, board, game_states[game_states.length - 1])
        game_states.push(state)
    current_turn = game_states.length

  # Allow the player to place stones!
  board.register (pos)->
    play_stone(current_turn % 2 + 1, pos, board)




main()

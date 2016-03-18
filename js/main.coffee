# Game Code


# Play a stone!
play_stone = (player, pos, board)->
  # VALIDATE MOVE
  if board.get_player(pos) != 0 # There is a stone already there
    throw "Placement Failed: Stone is already there."

    # TODO: check for suicide placement
    # TODO: check for Ko


  # TODO: Do some validation to see if this stone can be played!

  board.place(pos, player)
  console.log "Placed stone at position #{pos}."

  return board.dump_state()



# Lets go!
main = ()->

  # Start by getting some game data
  # TODO: Add warning popup if gamedata throws error, and try/catch block here
  game_data = get_game_data() # URL parsed information
  game_states = [] # Record the state of the board
  board_element = document.getElementById("board") # Where to place the board
  current_turn = 0 # Where we are currently

  if game_data.board_size == 0
    console.log "!! NEW GAME !!"
    # TODO: add board size creation window

  else
    console.log "!! LOADING GAME !!"
    # TODO: Add the ability to traverse game states
    # TODO: Add game rule verification
    board = new Board(board_element, game_data.board_size)
    board.register (pos)->
      play_stone(1, pos, board)

    for move in game_data.moves
      state = play_stone(game_states.length % 2 + 1, move, board)
      game_states.push(state)
    current_turn = game_states.length



  console.log game_data


main()

# Game Code

# Convert position to coordinates
positon_to_coords = (pos, size)->
  coords =
    x: pos % size
    y: pos // size

# Convert coordinates to position
coords_to_position = (x, y, size)->
  console.log "debug", x, y, size
  pos = size * y + x

# Lets go!
main = ()->

  # Start by getting some game data
  # TODO: Add warning popup if gamedata throws error, and try/catch block here
  game_data = get_game_data() # URL parsed information
  board_element = document.getElementById("board") # Where to place the board
  current_turn = 0 # Where we are currently

  if game_data.board_size == 0
    console.log "!! NEW GAME !!"
    # TODO: add board size creation window

  else
    console.log "!! LOADING GAME !!"
    # TODO: Add the ability to traverse game states
    # TODO: Add game rule verification
    board = new Board(board_element, game_data.board_size, game_data.board_size)

    console.log "pos", game_data.moves[0]
    console.log "coords", positon_to_coords(game_data.moves[0], game_data.board_size)
    console.log "pos again", coords_to_position(2, 1, game_data.board_size)


  console.log game_data


main()

# Game Code

# UTILIY

# Convert position to coordinates
positon_to_coords = (pos, size)->
  coords =
    x: pos % size
    y: pos // size

# Convert coordinates to position
coords_to_position = (x, y, size)->
  console.log "debug", x, y, size
  pos = size * y + x

# Get surrounding locations
get_surrounding = (pos, size)->

  # POSITION GRID 6X
  #  0  1  2  3  4  5
  #  6  7 [8] 9 10 11
  # 12 13 14 15 16 17
  # 18 19 20 21 22 23
  # 24 25 26 27 28 29
  # 30 31 32 33 34 35

  surroundings = {}
  # LEFT
  dir = pos - 1
  dir_check = dir % size
  if dir_check == size - 1 or dir_check < 0
    surroundings.left = null
  else
    surroundings.left = dir
  # RIGHT
  dir = pos + 1
  dir_check = dir % size
  if dir_check == 0 or dir_check > size
    surroundings.right = null
  else
    surroundings.right = dir
  # UP
  dir = pos - size
  if dir < 0
    surroundings.up = null
  else
    surroundings.up = dir
  # DOWN
  dir = pos + size
  if dir > size ** 2
    surroundings.down = null
  else
    surroundings.down = dir
  return surroundings



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

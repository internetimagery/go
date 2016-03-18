# Some Utility functionality

# Using Eample Grid
# POSITION GRID 6X
#  0  1  2  3  4  5
#  6  7 [8] 9 10 11
# 12 13 14 15 16 17
# 18 19 20 21 22 23
# 24 25 26 27 28 29
# 30 31 32 33 34 35

# Get surrounding locations
get_surroundings = (pos, size)->
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

# Walk through all stones connected together and put into an array.
get_connected_stones = (pos, board, size)->
  group = [pos]
  player = board.get_player(pos) # Get the player we're tracking
  stack = [pos]

  while stack.length > 0
    pos = stack.pop()
    surroundings = get_surroundings(pos, size)
    for dir, dir_pos of surroundings # Loop our options
      if dir_pos != null and board.get_player(dir_pos) == player and dir_pos not in group
        group.push(dir_pos)
        stack.push(dir_pos)
  return group



# TODO: walk connected STONES
# TODO: get liberties of a group
# TODO: check for ko

# TESTING

b = new Board(document.getElementById("board"), 6)
b.register (pos)->
  console.log "Clicked! ->", pos
b.place(9, 1)
b.place(15, 1)
b.place(18, 1)
b.place(19, 1)
b.place(20, 1)
b.place(21, 1)

console.log get_connected_stones(9, b, 6)

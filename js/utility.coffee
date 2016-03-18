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
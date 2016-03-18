# Game board

# Size element
Resize = (x, y, w, h, style)->
  this.setAttribute("style", "left:#{x}%;top:#{y}%;width:#{w}%;height:#{h}%;" + style)

# Create an Element
Create = (name, parent)->
  elem = document.createElement("div")
  elem.setAttribute("class", name)
  elem.resize = Resize
  parent.appendChild(elem)
  return elem

class Board
  constructor: (element, @size) ->
    @callbacks = Array()
    @stone_class = Array(
      "empty",
      "stone set white",
      "stone set black"
      )
    if @size < 2
      throw "Board size not big enough."

    # Size some things proportionate to the board size
    grid_chunk = 100 / (@size - 1) # Space between grids
    stone_size = grid_chunk * 1

    # Create an inner frame, smaller than the board, so our stones don't fall off the sides
    inner = Create("grid", element)
    inner_frame_pos = stone_size * 0.6
    inner_frame_span = 100 - inner_frame_pos * 2
    inner.resize(inner_frame_pos, inner_frame_pos, inner_frame_span, inner_frame_span, "position:relative;")
    element.appendChild(inner)

    for row in [0 ... @size]
      Create("line-horiz", inner).setAttribute("style", "top:#{row * grid_chunk}%;")

    for col in [0 ... @size]
      Create("line-vert", inner).setAttribute("style", "left:#{col * grid_chunk}%;")

    # Add placeholder positions to place stones
    @sockets = Array()
    for col in [0 ... @size]
      for row in [0 ... @size]
        socket = Create("empty", inner)
        socket.player = 0
        socket.resize(row * grid_chunk - stone_size * 0.5, col * grid_chunk - stone_size * 0.5, stone_size, stone_size, "position:absolute;")
        do ()=>
          pos = @sockets.length
          socket.onclick = (event)=>
            @placement_event(pos)
        @sockets.push(socket)

  # Register callback for placement events
  register: (func)->
    @callbacks.push(func)

  # Trigger events on board click
  placement_event: (pos)->
    for func in @callbacks
      func(pos)

  # Place a stone on the requested spot
  place: (pos, stone)->
    if pos > @size ** 2
      throw "Requested position not within board size."
    @sockets[pos].setAttribute("class", @stone_class[stone])
    @sockets[pos].player = stone

  # UTILITY

  # Get the current player at position
  get_player: (pos)->
    if pos > @size ** 2
      throw "Requested position not within board size."
    return @sockets[pos].player

  # Get surrounding locations of a stone
  get_surroundings: (pos)->
    surroundings = {}
    # LEFT
    dir = pos - 1
    dir_check = dir % @size
    if dir_check == @size - 1 or dir_check < 0
      surroundings.left = null
    else
      surroundings.left = dir
    # RIGHT
    dir = pos + 1
    dir_check = dir % @size
    if dir_check == 0 or dir_check > @size
      surroundings.right = null
    else
      surroundings.right = dir
    # UP
    dir = pos - @size
    if dir < 0
      surroundings.up = null
    else
      surroundings.up = dir
    # DOWN
    dir = pos + @size
    if dir > @size ** 2
      surroundings.down = null
    else
      surroundings.down = dir
    return surroundings

  # Walk through all stones connected together and put into an array.
  get_connected_stones: (pos)->
    group = [pos]
    player = @get_player(pos) # Get the player we're tracking
    stack = [pos]

    while stack.length > 0
      pos = stack.pop()
      surroundings = @get_surroundings(pos)
      for dir, dir_pos of surroundings # Loop our options
        if dir_pos != null and @get_player(dir_pos) == player and dir_pos not in group
          group.push(dir_pos)
          stack.push(dir_pos)
    return group


# Export Class
this.Board = Board

# TESTING
# Using Eample Grid
# POSITION GRID 6X
#  0  1  2  3  4  5
#  6  7 [8] 9 10 11
# 12 13 14 15 16 17
# 18 19 20 21 22 23
# 24 25 26 27 28 29
# 30 31 32 33 34 35

b = new Board(document.getElementById("board"), 6)
player = 1
b.register (pos)->
  console.log "Clicked! ->", pos
  if player == 1
    player = 2
  else
    player = 1
  b.place(pos, player)
  console.log "Group", b.get_connected_stones(pos)
b.place(9, 1)
b.place(15, 1)
b.place(18, 1)
b.place(19, 1)
b.place(20, 1)
b.place(21, 1)

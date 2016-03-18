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
      Create("line horiz", inner).setAttribute("style", "top:#{row * grid_chunk}%;")

    for col in [0 ... @size]
      Create("line vert", inner).setAttribute("style", "left:#{col * grid_chunk}%;")

    # Add placeholder positions to place stones
    @sockets = Array()
    for row in [0 ... @size]
      for col in [0 ... @size]
        socket = Create("empty", inner)
        socket.resize(row * grid_chunk - stone_size * 0.5, col * grid_chunk - stone_size * 0.5, stone_size, stone_size, "position:absolute;")
        do ()=>
          pos = @sockets.length
          socket.onclick = (event)=>
            @placement_event(pos)
        @sockets.push(socket)

  # Place a stone on the requested spot
  place: (pos, stone)->
    if pos > @size ** 2
      throw "Requested position not within board size."
    @sockets[pos].setAttribute("class", @stone_class[stone])

  # Register callback for placement events
  register: (func)->
    @callbacks.push(func)

  # Trigger events on board click
  placement_event: (pos)->
    for func in @callbacks
      func(pos)

# Export Class
this.Board = Board

# Usage example

b = new Board(document.getElementById("board"), 8)
player = 1
b.register (pos)->
  console.log "Clicked! ->", pos
  if player == 1
    player = 2
  else
    player = 1
  b.place(pos, player)

b.place(2, 1)
b.place(15, 2)
b.place(8, 1)
b.place(5, 2)

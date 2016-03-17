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
  constructor: (element, @rows, @cols) ->
    @callbacks = Array()
    if @rows < 2 or @cols < 2
      throw "Board size not big enough."

    # Size some things proportionate to the board size
    stone_size = 200 / (@rows + @cols)

    # Create an inner frame, smaller than the board, so our stones don't fall off the sides
    inner = Create("grid", element)
    inner_frame_pos = stone_size * 0.6
    inner_frame_span = 100 - inner_frame_pos * 2
    inner.resize(inner_frame_pos, inner_frame_pos, inner_frame_span, inner_frame_span, "position:relative;")
    element.appendChild(inner)

    # Set up our rows and columns
    row_chunk = 100 / (@rows - 1)
    col_chunk = 100 / (@cols - 1)

    for row in [0 ... @rows]
      Create("line horiz", inner).setAttribute("style", "top:#{row * row_chunk}%;")

    for col in [0 ... @cols]
      Create("line vert", inner).setAttribute("style", "left:#{col * col_chunk}%;")

    # Add placeholder positions to place stones
    @sockets = Array()
    for row in [0 ... @rows]
      socket_row = Array() # Create a row to place sockets
      for col in [0 ... @cols]
        socket = Create("empty", inner)
        socket.resize(row * row_chunk - stone_size * 0.5, col * col_chunk - stone_size * 0.5, stone_size, stone_size, "position:absolute;")
        do (row, col)=>
          socket.onclick = (event)=>
            @placement_event(row, col, event)
        socket_row.push(socket)
      @sockets.push(socket_row)

  # Place a stone on the requested spot
  place: (row, col, stone)->
    if @rows <= row or @cols <= col
      throw "Requested position not within board size."
    @sockets[row][col].setAttribute("class", stone)

  # Register callback for placement events
  register: (func)->
    @callbacks.push(func)

  # Trigger events on board click
  placement_event: (row, col, event)->
    for func in @callbacks
      func(row, col, event)





b = new Board(document.getElementById("board"), 8, 8)
player = "black"
b.register (row, col, event)->
  console.log "Clicked! ->", row, col, event
  if player == "white"
    player = "black"
  else
    player = "white"
  b.place(row, col, "stone set #{player}")

b.place(2, 2, "stone set white")
b.place(5, 4, "stone set black")
b.place(7, 1, "stone set black")
b.place(5, 3, "stone set white")

# Gui related things

# # Make board scale to the size of the screen
# container = document.getElementById("container")
# size_board = ()->
#   width = window.innerWidth or document.body.clientWidth
#   height = window.innerHeight or document.body.clientHeight
#   scale = Math.min(width, height)
#   container.setAttribute("style", "width:#{scale * 0.8}px;")
#   console.log height
# window.onresize = size_board
# size_board()

# Make slider... well... slide!
class Slider
  constructor: (@handle) ->
    wrapper = @handle.parentNode
    @set_segments(1)
    # Track our state
    active_seg = 0
    dragging = false
    offsetX = 0 # Track how far our mouse has moved
    width = null # Test the boundaries of our slider
    handle_pos = 0 # Where are we in the slider?
    curr_pos = 0
    # Set our functionality
    @handle.onmousedown = (e)=>
      if e.buttons == 1 # Left mouse button
        offsetX = e.clientX
        dragging = true
        # Initialize our positions
        width = wrapper.getBoundingClientRect().width - @handle.getBoundingClientRect().width
    # Start dragging
    document.onmouseup = (e)->
      dragging = false
      handle_pos = curr_pos
    # Drag
    document.onmousemove = (e)=>
      if dragging and e.buttons == 1
        move = e.clientX - offsetX
        curr_pos = handle_pos + move
        curr_pos = 0 if curr_pos <= 0
        curr_pos = width if curr_pos >= width
        scale = 1 / width
        percent = curr_pos * scale
        @handle.setAttribute("style", "margin-left:#{percent * 100}%;") # Move slider
        if @segments
          seg_offset = (Math.abs(seg - percent) for seg in @seg_range)
          seg_nearest = seg_offset.reduce (a, b)-> Math.min a, b
          curr_seg = seg_offset.indexOf(seg_nearest)
          if active_seg != curr_seg
            active_seg = curr_seg
            @callback?(active_seg)

  # Set the number of segments in the slider
  set_segments: (@segments)->
    chunk = if 1 < @segments then 1 / (@segments - 1) else 0
    @seg_range = (chunk * seg for seg in [0 ... @segments])


this.slider = new Slider(document.getElementById("slider"))
this.slider.set_segments(5)
this.slider.callback = (p)-> console.log "moved", p, new Date()

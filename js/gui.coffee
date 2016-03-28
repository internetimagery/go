# Gui related things

# Make board scale to the size of the screen
container = document.getElementById("container")
size_board = ()->
  width = window.innerWidth or document.body.clientWidth
  height = window.innerHeight or document.body.clientHeight
  scale = Math.min(width, height)
  container.setAttribute("style", "width:#{scale * 0.8}px;")
window.onresize = size_board
size_board()

# Helper for updating URL and keeping things in sync
class Window_URL
  constructor: (@base)->
    @tiny_url = document.getElementById("short-link")
  update: (hash)->
    url = "#{@base}##{hash}"
    window.location.replace url
    # Update tiny-url link
    @tiny_url.href = "https://tinyurl.com/api-create.php?url=#{encodeURIComponent(url)}"

class Corner_GUI
  constructor: () ->
    @pass_btn = document.getElementById("pass")
    @Player_indicators = [
      document.getElementById("player-black"),
      document.getElementById("player-white")]
    @pass_btn.onclick = (e)=>
      @pass_callback?(e)
  # Indicate which players turn it is
  indicate: (player)->
    for e in @Player_indicators
      e.setAttribute("style", "")
    @Player_indicators[player].setAttribute("style", "box-shadow: 0px 0px 3px 3px yellow;")

# Make slider... well... slide!
class Slider
  constructor: (@handle) ->
    @wrapper = @handle.parentNode
    @set_segment_count(1) # Default
    # Track our state
    active_seg = 0
    dragging = false
    offsetX = 0 # Track how far our mouse has moved
    scale = 0 # Test the boundaries of our slider
    @handle_pos = 0 # Where are we in the slider?
    @curr_pos = 0
    # Set our functionality
    @handle.onmousedown = (e)=>
      if e.buttons == 1 # Left mouse button
        e.preventDefault()
        offsetX = e.clientX
        dragging = true
        # Initialize our positions
        width = @wrapper.getBoundingClientRect().width
        scale = if width then 1 / width else 0
    # Start dragging
    document.onmouseup = (e)=>
      dragging = false
      @handle_pos = @curr_pos
    # Drag
    document.onmousemove = (e)=>
      if dragging and e.buttons == 1
        e.preventDefault()
        move = (e.clientX - offsetX) * scale
        @curr_pos = @handle_pos + move
        @curr_pos = 0 if @curr_pos <= 0
        @curr_pos = 1 if @curr_pos >= 1
        @handle.setAttribute("style", "left:#{@curr_pos * 100}%;") # Move slider
        if @segments
          seg_offset = (Math.abs(seg - @curr_pos) for seg in @seg_range)
          seg_nearest = seg_offset.reduce (a, b)-> Math.min a, b
          curr_seg = seg_offset.indexOf(seg_nearest)
          if active_seg != curr_seg
            active_seg = curr_seg
            @callback?(active_seg)

  # Set the number of segments in the slider
  set_segment_count: (@segments)->
    chunk = if 1 < @segments then 1 / (@segments - 1) else 0
    @seg_range = (chunk * seg for seg in [0 ... @segments])

  # Set position of handle
  set_pos: (pos)->
    if @seg_range?
      @handle.setAttribute("style", "left:#{@seg_range[pos] * 100}%;")
      @handle_pos = @seg_range[pos]
      @curr_pos = @handle_pos



this.Window_URL = Window_URL
this.Slider = Slider
this.Corner_GUI = Corner_GUI

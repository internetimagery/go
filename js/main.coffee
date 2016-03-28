# Game Code

# TODO: add gnugpg signing option to url for authenticity "https://openpgpjs.org/"

# Record the current state of the game
class Game_Snapshot
  constructor: (@player, @state, @id) ->

# Capture a group
capture = (stone, board)->
  if board.get_player(stone) != 0 # Check in case another loop already captured this group
    group = board.get_connected_stones(stone)
    for stone in group
      board.place(stone, 0)

# Play a stone without checking for issues
play_stone_no_check = (player, pos, board)->
  state = board.dump_state()
  if pos == null
    return state
  board.place(pos, player)
  for dir, stone of board.get_surroundings(pos)
    if board.get_player(stone) != player and board.is_surrounded(stone)
      capture(stone, board)
  if board.is_surrounded(pos)
    board.place(pos, 0)
  return board.dump_state()

# Play a stone! Validate game rules!
play_stone = (player, pos, board, ko_check_move)->
  # Check for pass
  if pos == null
    return board.dump_state()

  # Validate Placement
  if board.get_player(pos) != 0 # There is a stone already there
    throw "Illegal Move: Space occupied."

  # Place the stone on board
  board.place(pos, player)

  # Check if we can capture anything
  check_ko = false
  for dir, stone of board.get_surroundings(pos)
    if board.get_player(stone) != player and board.is_surrounded(stone) # Found one!
      capture(stone, board) # Take it!
      check_ko = true

  # Record board state
  new_state = board.dump_state()

  # Check for an illegal ko
  if check_ko and ko_check_move
    ko = true # Asume Ko unless we can prove otherwise
    for i in [0 ... new_state.length]
      if new_state[i] != ko_check_move.state[i] # Only one cell needs to not match to break out of Ko
        ko = false
        break
    if ko
      throw "Illegal Move: Ko."

  # Check if a suicide placement
  if board.is_surrounded(pos)
    throw "Illegal Move: Suicide."
  return new_state

# Lets go!
main = ()->

  # Start by getting some game data
  game_data = new Game_Data() # Track raw data for game
  game_states = [] # Record the state of the game as we progress

  # Parse ID from url
  href = window.location.href.split("#")
  URL = new Window_URL(href[0])
  if href.length == 2 and href[1] # If there is a hash we might have an ID
    console.log "!! LOADING GAME !!"
    game_data.read_id(decodeURIComponent(href[1])) # Load game data
  else # No data to load? Set us up at default
    console.log "!! NEW GAME !!"
    URL.update game_data.write_id()

  # Initialize our board and controls
  slider = new Slider(document.getElementById("slider-handle"))
  corner_gui = new Corner_GUI()
  board = new Board(document.getElementById("board"), game_data.board_size)

  # Load up any moves
  for move in game_data.moves
    if move == null # We have a pass
      if game_states.length == 0 # First entry into game states
        state = board.dump_state()
      else
        state = game_states[game_states.length - 2].state # Repeat last gamestate
    else if Array.isArray(move) # Board setup
      board.place(m, 1) for m in (move[0] or []) # Black
      board.place(m, 2) for m in (move[1] or []) # White
      board.place(m, 0) for m in (move[2] or []) # Empty
      state = board.dump_state()
    else
      state = play_stone_no_check(game_states.length % 2 + 1, move, board)
    game_data.current = game_states.length + 1
    game_states.push new Game_Snapshot game_states.length % 2, state, game_data.write_id()

  # Update visuals
  URL.update href[1] # Force update to the same URL to get everything in sync
  board.update(game_states.length % 2 + 1)
  corner_gui.indicate(game_states.length % 2)
  slider.set_segment_count game_states.length
  slider.set_pos game_states.length - 1

  # Load the board state at a certain point in time
  load_board_snapshot = (move)->
    if 0 <= move < game_states.length
      vis_state = game_states[move] # Get the requested board state
      game_data.current = move + 1 # Keep our data in sync
      URL.update vis_state.id # Update our URL to match what we see
      window.document.title = "Move #{move + 1}" # Tell us where we are
      board.load_state vis_state.state # Load in our board data
      board.update(vis_state.player + 1)
      corner_gui.indicate(vis_state.player) # Highlight the current players turn.
      console.log "Viewing move #{move + 1}."
      return true

  # Allow the player to place stones!
  board.register (pos)->
    if game_data.current == game_states.length # Only add moves to the end of the game
      current_state = if game_states.length == 0 then board.dump_state() else game_states[game_states.length - 1].state
      try
        current_state = play_stone(game_data.current % 2 + 1, pos, board, game_states[game_states.length - 2])
        game_data.current = game_states.length + 1
        game_data.add_move(pos)
        game_states.push new Game_Snapshot game_data.current % 2, current_state, game_data.write_id()
        slider.set_segment_count game_states.length # Increase slider size
        load_board_snapshot game_states.length - 1
      catch error
        board.load_state(current_state) # Undo
        alert error
        console.error error
    else
      alert "Cannot add move. The game has progressed past this point."

  # Play a passing move
  corner_gui.pass_callback = (e)->
    board.placement_event(null)

  # Hotkeys
  document.onkeydown = (e)->
    e = window.event if not e
    code = e.keyCode
    if e.charCode and code == 0
      code = e.charCode
    switch code
      when 80 then board.placement_event null # Pass, (letter "P")
      when 37 then step = -1 # Left button
      when 39 then step = 1 # Right button

    if step? # Move through the game one move at a time
      e.preventDefault()
      new_step = game_data.current - 1 + step
      if load_board_snapshot new_step
        slider.set_pos new_step

  # Update board to requested state
  slider.callback = (pos)->
    load_board_snapshot pos, true

  # Load SGF files
  dropzone = document.getElementById("dropzone") # Drop element
  dropzone.addEventListener 'dragover', (e)-> # Change mouse to show area is droppable
    e.stopPropagation()
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  dropzone.addEventListener "drop", (e)->
    e.stopPropagation()
    e.preventDefault()
    files = e.dataTransfer.files
    if files[0]
      reader = new FileReader()
      reader.onload = (e2)->
        data = e2.target.result # File data
        try
          game_data.load_sgf(data)
          URL.update game_data.write_id()
          location.reload(true)
        catch error
          alert "There was a problem loading the SGF."
          console.error error
      reader.readAsText(files[0])

this.main = main

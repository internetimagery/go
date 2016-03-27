# Game Code

# TEST LAYOUT
#05001002005008007012011
#05---001002005008007012011---004006

# TODO: add gnugpg signing option to url for authenticity "https://openpgpjs.org/"
# TODO: add forced removal

# Update short url link
update_tinyurl = ()->
  elem = document.getElementById("short-link")
  elem.href = "https://tinyurl.com/api-create.php?url=#{encodeURIComponent(window.location.href)}"

# Small player indicator
indicate = (player)->
  element = [
    document.getElementById("player-black"),
    document.getElementById("player-white")]
  for e in element
    e.setAttribute("style", "")
  element[player].setAttribute("style", "box-shadow: 0px 0px 3px 3px yellow;")

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
      if new_state[i] != ko_check_move[i] # Only one cell needs to not match to break out of Ko
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
  game_data = new Game_Data()
  game_states = [] # Record the state of the game as we progress

  # Parse ID from url
  url = window.location.href.split("#")
  if url.length == 2 and url[1] # If there is a hash we might have an ID
    console.log "!! LOADING GAME !!"
    game_data.read_id(decodeURIComponent(url[1])) # Load game data
  else # No data to load? Set us up at default
    console.log "!! NEW GAME !!"
    history.replaceState(0, "start", "#{url[0]}##{game_data.write_id()}")
    update_tinyurl()

  # Initialize our board and controls
  slider = new Slider(document.getElementById("slider-handle"))
  board = new Board(document.getElementById("board"), game_data.board_size)
  pass_btn = document.getElementById("pass")

  # Load up any moves
  for move in game_data.moves
    if move == null # We have a pass
      if game_states.length == 0 # First entry into game states
        state = board.dump_state()
      else
        state = game_states[game_states.length - 2] # Repeat last gamestate
    else if Array.isArray(move) # Board setup
      board.place(m, 1) for m in (move[0] or []) # Black
      board.place(m, 2) for m in (move[1] or []) # White
      board.place(m, 0) for m in (move[2] or []) # Empty
      state = board.dump_state()
    else
      state = play_stone_no_check(game_states.length % 2 + 1, move, board)
    game_states.push(state) # Add state to list of states

    # Initialize browser history following game
    window.document.title = "Move #{game_states.length}"
    game_data.current = game_states.length
    state_url = "#{url[0]}##{game_data.write_id()}"
    if game_data.current == 0
      history.replaceState(game_states.length, "Start", state_url)
    else
      history.pushState(game_states.length, "Move #{game_data.current}", state_url)
    update_tinyurl()

  # Update visuals
  board.update(game_states.length % 2 + 1)
  indicate(game_states.length % 2)
  slider.set_segment_count game_states.length
  slider.set_pos game_states.length - 1

  # Allow the player to place stones!
  board.register (pos)->
    if game_data.current == game_states.length # Only add moves to the end of the game
      current_state = if game_states.length == 0 then board.dump_state() else game_states[game_states.length - 1]
      try
        current_state = play_stone(game_data.current % 2 + 1, pos, board, game_states[game_states.length - 2])
        game_states.push(current_state)
        game_data.current = game_states.length
        slider.set_segment_count game_states.length
        slider.set_pos game_states.length - 1
        game_data.add_move(pos)
        history.pushState(game_states.length, "Move #{game_states.length}", "#{url[0]}##{game_data.write_id()}")
        board.load_state(current_state)
        player = game_data.current % 2
        board.update(player + 1) # Draw board changes
        window.document.title = "Move #{game_states.length}"
        indicate(player)
        update_tinyurl()
      catch error
        board.load_state(current_state) # Undo
        alert error
    else
      alert "Cannot add move. The game has progressed past this point."

  # Play a passing move
  pass_btn.onclick = (e)->
    board.placement_event(null)
  document.addEventListener "keypress", (e)->
    if e.key == "p"
      board.placement_event(null)

  # Update board to requested state
  slider.callback = (pos)->
    move = pos + 1
    console.log "Loaded game state #{move}."
    game_data.current = move
    board.load_state(game_states[pos])
    board.update(move % 2 + 1)
    window.document.title = "Move #{move}"
    indicate(move % 2)
    update_tinyurl()

  # Update board to requested state
  window.addEventListener "popstate", (event)->
    move = parseInt(event.state)
    if isNaN(move)
      throw "Invalid game state!"
    console.log "Loaded game state #{move}."
    game_data.current = move
    board.load_state(game_states[move - 1])
    board.update(move % 2 + 1)
    window.document.title = "Move #{move}"
    indicate(move % 2)
    update_tinyurl()

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
          window.location.assign("#{url[0]}##{game_data.write_id()}")
          location.reload(true)
        catch error
          alert "There was a problem loading the SGF."
          console.error error
      reader.readAsText(files[0])

this.main = main

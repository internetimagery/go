# Game Code



# Lets go!
main = ()->

  # Start by getting some game data
  game_data = get_game_data()

  if game_data.board_size == 0
    console.log "!! NEW GAME !!"
    
  else
    console.log "!! LOADING GAME !!"
    # LOADING EXISTING GAME

  console.log game_data


main()

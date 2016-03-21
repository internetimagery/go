# Convert to and from URL and SGF format


example = "(;GM[1]FF[4]CA[UTF-8]SZ[19];B[pd];W[dp];B[pp](;W[dd])(;W[dc];B[ce];W[ed](;B[ch];W[jc])(;B[ci])))"

numbers = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

parser = (file)->
  game = smartgamer(sgf_parse(file))

  info = game.getGameInfo()
  if game.GM != 1
    throw "Game file is not the game of Go."
  size = info.SZ



gamer = smartgamer(sgf_parse(example))

console.log gamer

gamer.first() # Start

console.log "info", gamer.getGameInfo()

console.log "total", gamer.totalMoves()
for i in [0 ... gamer.totalMoves()]
  gamer.next()
  console.log gamer.node()

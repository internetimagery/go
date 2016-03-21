# Convert to and from URL and SGF format


example = "(;GM[1]FF[4]CA[UTF-8]SZ[19];B[pd];W[dp];B[pp](;W[dd])(;W[dc];B[ce];W[ed](;B[ch];W[jc])(;B[ci])))"


gamer = smartgamer(parse(example))

console.log gamer

gamer.first() # Start

console.log "info", gamer.getGameInfo()

console.log "total", gamer.totalMoves()
for i in [0 ... gamer.totalMoves()]
  gamer.next()
  console.log gamer.node()

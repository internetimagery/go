# Convert to and from URL and SGF format

example = "(;GM[1]FF[4]CA[UTF-8]SZ[19];B[pd];W[dp];B[pp](;W[dd])(;W[dc];B[ce];W[ed](;B[ch];W[jc])(;B[ci])))"

move_chars = ["a","b","c","d","e","f","g","h","i","j","k","l","m",
"n","o","p","q","r","s","t","u","v","w","x","y","z",
"A","B","C","D","E","F","G","H","I","J","K","L","M",
"N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

colour = ["B", "W"]


uploader = document.getElementById("uploader")
upload_btn = document.getElementById("upload-btn")



parser = (file)->
  game = smartgamer(sgf_parse(file))

  info = game.getGameInfo()
  if info.GM != "1"
    throw "Game file is not the game of Go."
  mode = "0"
  size = "00#{info.SZ}"[-2 ..]
  turns = []
  for i in [0 ... game.totalMoves()]
    game.next()
    turns.push(game.node()[colour[i % 2]])
  return "##{mode}#{size}#{turns.join("")}"


uploader.addEventListener 'dragover', (e)-> # Change mouse to show area is droppable
  e.stopPropagation()
  e.preventDefault()
  e.dataTransfer.dropEffect = "copy"
uploader.addEventListener "drop", (e)->
  e.stopPropagation()
  e.preventDefault()

  files = e.dataTransfer.files
  if files
    reader = new FileReader()
    reader.onload = (e2)->
      data = e2.target.result
      try
        ID = parser(data)
      catch error
        alert "There was a problem loading the SGF."
        console.error error
    reader.readAsText(files[0])

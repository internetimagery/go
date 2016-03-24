# Gui related things

# Make board scale to the size of the screen
container = document.getElementById("container")
size_board = ()->
  width = window.innerWidth or document.body.clientWidth
  height = window.innerHeight or document.body.clientHeight
  scale = Math.min(width, height)
  container.setAttribute("style", "width:#{scale * 0.8}px;")
  console.log height
window.onresize = size_board
size_board()

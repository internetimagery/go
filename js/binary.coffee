# Convert large numbers to binary

class Node
  constructor: (@base, depth) ->
    @depth = depth || 0
    @prev = null # Our place in the stack
    @next = null
    @value = 0 # Our value
  insert: (string)->
    @value = parseInt(string.substring(string.length - 1))
    if string.length > 1
      @next = new Node(@base, @depth + 1)
      @next.prev = @
      @next.insert(string.substring(0, string.length - 1))
  add: ()->
    @value += 1
    if @value >= @base
      @value = 0
      if @next == null
        @next = new Node(@base, @depth + 1)
        @next.prev = @
      @next.add()
  sub: ()->
    @value -= 1
    if @value < 0
      if @next == null
        if @prev == null
          console.log "WARNING: Already at Zero!"
        else
          @prev.next = null
      else
        @next.sub()
        @value = @base - 1
  get: ()->
    string = @value.toString()
    if @next != null
      string = @next.get() + string
    return string



test = "3342344"
test_num = parseInt(test)
test_bin = test_num.toString(2)

num = new Node(10)
num.insert(test)
console.log num.get()

# num = new Node(10)
# for i in [0 ... 20]
#   num.add()
#   console.log num.get()
for i in [0 ... 20]
  num.sub()
  console.log num.get()

# Convert large numbers to binary

class Counter
  # Single Number
  constructor: (@base) ->
    @value = 0
    @next = null
  add: ()->
    @value += 1
    if @value >= @base
      @value = 0
      if @next == null
        @next = new Counter(@base)
        @next.add()
      else
        @next.add()

  concat: ()->
    num = @value.toString()
    if @next != null
      num = @next.concat() + num
    return num




test = "3342344"
test_num = parseInt(test)
test_bin = test_num.toString(2)

num = new Counter(2)
for i in [1 ... 40]
  num.add()
  console.log i, num.concat(), parseInt(num.concat(), 2)

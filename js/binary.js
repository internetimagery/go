(function() {
  var Node, num, test, test_bin, test_num;

  Node = (function() {
    function Node(base, depth) {
      this.base = base;
      this.depth = depth || 0;
      this.prev = null;
      this.next = null;
      this.value = 0;
    }

    Node.prototype.insert = function(string) {
      this.value = parseInt(string.substring(string.length - 1));
      if (string.length > 1) {
        this.next = new Node(this.base, this.depth + 1);
        this.next.prev = this;
        return this.next.insert(string.substring(0, string.length - 1));
      }
    };

    Node.prototype.add = function() {
      this.value += 1;
      if (this.value >= this.base) {
        this.value = 0;
        if (this.next === null) {
          this.next = new Node(this.base, this.depth + 1);
          this.next.prev = this;
        }
        return this.next.add();
      }
    };

    Node.prototype.sub = function() {
      this.value -= 1;
      if (this.value < 0) {
        if (this.next === null) {
          if (this.prev === null) {
            return console.log("WARNING: Already at Zero!");
          } else {
            return this.prev.next = null;
          }
        } else {
          this.next.sub();
          return this.value = this.base - 1;
        }
      }
    };

    Node.prototype.get = function() {
      var string;
      string = this.value.toString();
      if (this.next !== null) {
        string = this.next.get() + string;
      }
      return string;
    };

    return Node;

  })();

  test = "3342344";

  test_num = parseInt(test);

  test_bin = test_num.toString(2);

  num = new Node(10);

  num.insert(test);

  console.log(num.get());

  while (num.get !== "0") {
    num.sub();
    console.log(num.get());
  }

}).call(this);

(function() {
  var Counter, i, num, test, test_bin, test_num, _i;

  Counter = (function() {
    function Counter(base) {
      this.base = base;
      this.value = 0;
      this.next = null;
    }

    Counter.prototype.add = function() {
      this.value += 1;
      if (this.value >= this.base) {
        this.value = 0;
        if (this.next === null) {
          this.next = new Counter(this.base);
          return this.next.add();
        } else {
          return this.next.add();
        }
      }
    };

    Counter.prototype.concat = function() {
      var num;
      num = this.value.toString();
      if (this.next !== null) {
        num = this.next.concat() + num;
      }
      return num;
    };

    return Counter;

  })();

  test = "3342344";

  test_num = parseInt(test);

  test_bin = test_num.toString(2);

  num = new Counter(2);

  for (i = _i = 1; _i < 40; i = ++_i) {
    num.add();
    console.log(i, num.concat(), parseInt(num.concat(), 2));
  }

}).call(this);


/**
 * Interact with smartgame objects.
 * @param {object} smartgame A JS Object representing a smartgame
 * @see http://www.red-bean.com/sgf/sgf4.html
 * @return {object} An object with methods for navigating and manipulating a
 * smartgame
 */

(function() {
  this.smartgamer = function(smartgame) {
    'use strict';
    var Smartgamer, node, sequence;
    sequence = void 0;
    node = void 0;
    Smartgamer = function() {
      this.init();
    };
    Smartgamer.prototype = {
      init: function() {
        if (smartgame) {
          this.game = smartgame.gameTrees[0];
          this.reset();
        }
      },
      load: function(newSmartgame) {
        smartgame = newSmartgame;
        this.init();
      },
      games: function() {
        return smartgame.gameTrees;
      },
      selectGame: function(i) {
        if (i < smartgame.gameTrees.length) {
          this.game = smartgame.gameTrees[i];
          this.reset();
        } else {
          throw new Error('the collection doesn\'t contain that many games');
        }
        return this;
      },
      reset: function() {
        sequence = this.game;
        node = sequence.nodes[0];
        this.path = {
          m: 0
        };
        return this;
      },
      getSmartgame: function() {
        return smartgame;
      },
      variations: function() {
        var localIndex, localNodes;
        if (sequence) {
          localNodes = sequence.nodes;
          localIndex = localNodes ? localNodes.indexOf(node) : null;
          if (localNodes) {
            if (localIndex === localNodes.length - 1) {
              return sequence.sequences || [];
            } else {
              return [];
            }
          }
        }
      },
      next: function(variation) {
        var localIndex, localNodes;
        variation = variation || 0;
        localNodes = sequence.nodes;
        localIndex = localNodes ? localNodes.indexOf(node) : null;
        if (localIndex === null || localIndex >= localNodes.length - 1) {
          if (sequence.sequences) {
            if (sequence.sequences[variation]) {
              sequence = sequence.sequences[variation];
            } else {
              sequence = sequence.sequences[0];
            }
            node = sequence.nodes[0];
            this.path[this.path.m] = variation;
            this.path.m += 1;
          } else {
            return this;
          }
        } else {
          node = localNodes[localIndex + 1];
          this.path.m += 1;
        }
        return this;
      },
      previous: function() {
        var localIndex, localNodes;
        localNodes = sequence.nodes;
        localIndex = localNodes ? localNodes.indexOf(node) : null;
        delete this.path[this.path.m];
        if (!localIndex || localIndex === 0) {
          if (sequence.parent && !sequence.parent.gameTrees) {
            sequence = sequence.parent;
            if (sequence.nodes) {
              node = sequence.nodes[sequence.nodes.length - 1];
              this.path.m -= 1;
            } else {
              node = null;
            }
          } else {
            return this;
          }
        } else {
          node = localNodes[localIndex - 1];
          this.path.m -= 1;
        }
        return this;
      },
      last: function() {
        var totalMoves;
        totalMoves = this.totalMoves();
        while (this.path.m < totalMoves) {
          this.next();
        }
        return this;
      },
      first: function() {
        this.reset();
        return this;
      },
      goTo: function(path) {
        var i, n, variation;
        if (typeof path === 'string') {
          path = this.pathTransform(path, 'object');
        } else if (typeof path === 'number') {
          path = {
            m: path
          };
        }
        this.reset();
        n = node;
        i = 0;
        while (i < path.m && n) {
          variation = path[i] || 0;
          n = this.next(variation);
          i += 1;
        }
        return this;
      },
      getGameInfo: function() {
        return this.game.nodes[0];
      },
      node: function() {
        return node;
      },
      totalMoves: function() {
        var localSequence, moves;
        localSequence = this.game;
        moves = 0;
        while (localSequence) {
          moves += localSequence.nodes.length;
          if (localSequence.sequences) {
            localSequence = localSequence.sequences[0];
          } else {
            localSequence = null;
          }
        }
        return moves - 1;
      },
      comment: function(text) {
        if (typeof text === 'undefined') {
          if (node.C) {
            return node.C.replace(/\\([\\:\]])/g, '$1');
          } else {
            return '';
          }
        } else {
          node.C = text.replace(/[\\:\]]/g, '\\$&');
        }
      },
      translateCoordinates: function(alphaCoordinates) {
        var coordinateLabels, intersection;
        coordinateLabels = 'abcdefghijklmnopqrst';
        intersection = [];
        intersection[0] = coordinateLabels.indexOf(alphaCoordinates.substring(0, 1));
        intersection[1] = coordinateLabels.indexOf(alphaCoordinates.substring(1, 2));
        return intersection;
      },
      pathTransform: function(input, outputType, verbose) {
        var output, parse, stringify;
        output = void 0;

        /**
         * Turn a path object into a string.
         */
        stringify = function(input) {
          var key, variations;
          if (typeof input === 'string') {
            return input;
          }
          if (!input) {
            return '';
          }
          output = input.m;
          variations = [];
          for (key in input) {
            if (input.hasOwnProperty(key) && key !== 'm') {
              if (input[key] > 0) {
                if (verbose) {
                  variations.push(', variation ' + input[key] + ' at move ' + key);
                } else {
                  variations.push('-' + key + ':' + input[key]);
                }
              }
            }
          }
          output += variations.join('');
          return output;
        };

        /**
         * Turn a path string into an object.
         */
        parse = function(input) {
          var path;
          if (typeof input === 'object') {
            input = stringify(input);
          }
          if (!input) {
            return {
              m: 0
            };
          }
          path = input.split('-');
          output = {
            m: Number(path.shift())
          };
          if (path.length) {
            path.forEach(function(variation, i) {
              variation = variation.split(':');
              output[Number(variation[0])] = variation[1];
            });
          }
          return output;
        };
        if (typeof outputType === 'undefined') {
          outputType = typeof input === 'string' ? 'object' : 'string';
        }
        if (outputType === 'string') {
          output = stringify(input);
        } else if (outputType === 'object') {
          output = parse(input);
        } else {
          output = void 0;
        }
        return output;
      }
    };
    return new Smartgamer;
  };

}).call(this);

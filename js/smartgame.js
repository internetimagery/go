
/**
 * Convert SGF files to a JS object
 * @param {string} sgf A valid SGF file.
 * @see http://www.red-bean.com/sgf/sgf4.html
 * @return {object} The SGF file represented as a JS object
 */

(function() {
  this.sgf_parse = function(sgf) {
    'use strict';
    var collection, lastPropIdent, node, parse, parser, sequence;
    parse = void 0;
    parser = void 0;
    collection = {};
    sequence = void 0;
    node = void 0;
    lastPropIdent = void 0;
    parser = {
      beginSequence: function(sgf) {
        var key, newSequence;
        key = 'sequences';
        if (!sequence) {
          sequence = collection;
          key = 'gameTrees';
        }
        if (sequence.gameTrees) {
          key = 'gameTrees';
        }
        newSequence = {
          parent: sequence
        };
        sequence[key] = sequence[key] || [];
        sequence[key].push(newSequence);
        sequence = newSequence;
        return parse(sgf.substring(1));
      },
      endSequence: function(sgf) {
        if (sequence.parent) {
          sequence = sequence.parent;
        } else {
          sequence = null;
        }
        return parse(sgf.substring(1));
      },
      node: function(sgf) {
        node = {};
        sequence.nodes = sequence.nodes || [];
        sequence.nodes.push(node);
        return parse(sgf.substring(1));
      },
      property: function(sgf) {
        var firstPropEnd, propIdent, propValue, propValueBegin, property;
        propValue = void 0;
        firstPropEnd = sgf.match(/([^\\\]]|\\(.|\n|\r))*\]/);
        if (!firstPropEnd.length) {
          throw new Error('malformed sgf');
        }
        firstPropEnd = firstPropEnd[0].length;
        property = sgf.substring(0, firstPropEnd);
        propValueBegin = property.indexOf('[');
        propIdent = property.substring(0, propValueBegin);
        if (!propIdent) {
          propIdent = lastPropIdent;
          if (!Array.isArray(node[propIdent])) {
            node[propIdent] = [node[propIdent]];
          }
        }
        lastPropIdent = propIdent;
        propValue = property.substring(propValueBegin + 1, property.length - 1);
        if (propIdent.length > 2) {
          console.warn('SGF PropIdents should be no longer than two characters:', propIdent);
        }
        if (Array.isArray(node[propIdent])) {
          node[propIdent].push(propValue);
        } else {
          node[propIdent] = propValue;
        }
        return parse(sgf.substring(firstPropEnd));
      },
      unrecognized: function(sgf) {
        return parse(sgf.substring(1));
      }
    };
    parse = function(sgf) {
      var initial, type;
      initial = sgf.substring(0, 1);
      type = void 0;
      if (!initial) {
        return collection;
      } else if (initial === '(') {
        type = 'beginSequence';
      } else if (initial === ')') {
        type = 'endSequence';
      } else if (initial === ';') {
        type = 'node';
      } else if (initial.search(/[A-Z\[]/) !== -1) {
        type = 'property';
      } else {
        type = 'unrecognized';
      }
      return parser[type](sgf);
    };
    return parse(sgf);
  };


  /**
   * Generate an SGF file from a SmartGame Record JavaScript Object
   * @param {object} record A record object.
   * @return {string} The record as a string suitable for saving as an SGF file
   */

  this.generate = function(record) {
    var stringifySequences;
    stringifySequences = function(sequences) {
      var contents;
      contents = '';
      sequences.forEach(function(sequence) {
        contents += '(';
        if (sequence.nodes) {
          sequence.nodes.forEach(function(node) {
            var nodeString, prop, property;
            nodeString = ';';
            for (property in node) {
              if (node.hasOwnProperty(property)) {
                prop = node[property];
                if (Array.isArray(prop)) {
                  prop = prop.join('][');
                }
                nodeString += property + '[' + prop + ']';
              }
            }
            contents += nodeString;
          });
        }
        if (sequence.sequences) {
          contents += stringifySequences(sequence.sequences);
        }
        contents += ')';
      });
      return contents;
    };
    'use strict';
    return stringifySequences(record.gameTrees);
  };

}).call(this);

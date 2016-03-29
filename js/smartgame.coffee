# Converted from https://github.com/neagle/smartgame

###*
# Convert SGF files to a JS object
# @param {string} sgf A valid SGF file.
# @see http://www.red-bean.com/sgf/sgf4.html
# @return {object} The SGF file represented as a JS object
###

this.sgf_parse = (sgf) ->
  'use strict'
  parse = undefined
  parser = undefined
  collection = {}
  # tracks the current sequence
  sequence = undefined
  # tracks the current node
  node = undefined
  # tracks the last PropIdent
  lastPropIdent = undefined
  # A map of functions to parse the different components of an SGF file
  parser =
    beginSequence: (sgf) ->
      key = 'sequences'
      # Top-level sequences are gameTrees
      if !sequence
        sequence = collection
        key = 'gameTrees'
      if sequence.gameTrees
        key = 'gameTrees'
      newSequence = parent: sequence
      sequence[key] = sequence[key] or []
      sequence[key].push newSequence
      sequence = newSequence
      parse sgf.substring(1)
    endSequence: (sgf) ->
      if sequence.parent
        sequence = sequence.parent
      else
        sequence = null
      parse sgf.substring(1)
    node: (sgf) ->
      node = {}
      sequence.nodes = sequence.nodes or []
      sequence.nodes.push node
      parse sgf.substring(1)
    property: (sgf) ->
      propValue = undefined
      # Search for the first unescaped ]
      firstPropEnd = sgf.match(/([^\\\]]|\\(.|\n|\r))*\]/)
      if !firstPropEnd.length
        throw new Error('malformed sgf')
      firstPropEnd = firstPropEnd[0].length
      property = sgf.substring(0, firstPropEnd)
      propValueBegin = property.indexOf('[')
      propIdent = property.substring(0, propValueBegin)
      # Point lists don't declare a PropIdent for each PropValue
      # Instead, they should use the last declared property
      # See: http://www.red-bean.com/sgf/sgf4.html#move/pos
      if !propIdent
        propIdent = lastPropIdent
        # If this is the first property in a list of multiple
        # properties, we need to wrap the PropValue in an array
        if !Array.isArray(node[propIdent])
          node[propIdent] = [ node[propIdent] ]
      lastPropIdent = propIdent
      propValue = property.substring(propValueBegin + 1, property.length - 1)
      # We have no problem parsing PropIdents of any length, but the spec
      # says they should be no longer than two characters.
      #
      # http://www.red-bean.com/sgf/sgf4.html#2.2
      if propIdent.length > 2
        # TODO: What's the best way to issue a warning?
        console.warn 'SGF PropIdents should be no longer than two characters:', propIdent
      if Array.isArray(node[propIdent])
        node[propIdent].push propValue
      else
        node[propIdent] = propValue
      parse sgf.substring(firstPropEnd)
    unrecognized: (sgf) ->
      # March ahead to the next character
      parse sgf.substring(1)
  # Processes an SGF file character by character

  parse = (sgf) ->
    initial = sgf.substring(0, 1)
    type = undefined
    # Use the initial (the first character in the remaining sgf file) to
    # decide which parser function to use
    if !initial
      return collection
    else if initial == '('
      type = 'beginSequence'
    else if initial == ')'
      type = 'endSequence'
    else if initial == ';'
      type = 'node'
    else if initial.search(/[A-Z\[]/) != -1
      type = 'property'
    else
      type = 'unrecognized'
    parser[type] sgf

  # Begin parsing the SGF file
  parse sgf

###*
# Generate an SGF file from a SmartGame Record JavaScript Object
# @param {object} record A record object.
# @return {string} The record as a string suitable for saving as an SGF file
###

this.generate = (record) ->

  stringifySequences = (sequences) ->
    contents = ''
    sequences.forEach (sequence) ->
      contents += '('
      # Parse all nodes in this sequence
      if sequence.nodes
        sequence.nodes.forEach (node) ->
          nodeString = ';'
          for property of node
            if node.hasOwnProperty(property)
              prop = node[property]
              if Array.isArray(prop)
                prop = prop.join('][')
              nodeString += property + '[' + prop + ']'
          contents += nodeString
          return
      # Call the function we're in recursively for any child sequences
      if sequence.sequences
        contents += stringifySequences(sequence.sequences)
      contents += ')'
      return
    contents

  'use strict'
  stringifySequences record.gameTrees

# ---
# generated by js2coffee 2.1.0
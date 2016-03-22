# Converted from https://github.com/neagle/smartgamer

###*
# Interact with smartgame objects.
# @param {object} smartgame A JS Object representing a smartgame
# @see http://www.red-bean.com/sgf/sgf4.html
# @return {object} An object with methods for navigating and manipulating a
# smartgame
###

this.smartgamer = (smartgame) ->
  'use strict'
  sequence = undefined
  node = undefined

  Smartgamer = ->
    @init()
    return

  Smartgamer.prototype =
    init: ->
      if smartgame
        @game = smartgame.gameTrees[0]
        @reset()
      return
    load: (newSmartgame) ->
      smartgame = newSmartgame
      @init()
      return
    games: ->
      smartgame.gameTrees
    selectGame: (i) ->
      if i < smartgame.gameTrees.length
        @game = smartgame.gameTrees[i]
        @reset()
      else
        throw new Error('the collection doesn\'t contain that many games')
      this
    reset: ->
      sequence = @game
      node = sequence.nodes[0]
      @path = m: 0
      this
    getSmartgame: ->
      smartgame
    variations: ->
      if sequence
        localNodes = sequence.nodes
        localIndex = if localNodes then localNodes.indexOf(node) else null
        if localNodes
          if localIndex == localNodes.length - 1
            return sequence.sequences or []
          else
            return []
      return
    next: (variation) ->
      variation = variation or 0
      localNodes = sequence.nodes
      localIndex = if localNodes then localNodes.indexOf(node) else null
      # If there are no additional nodes in this sequence,
      # advance to the next one
      if localIndex == null or localIndex >= localNodes.length - 1
        if sequence.sequences
          if sequence.sequences[variation]
            sequence = sequence.sequences[variation]
          else
            sequence = sequence.sequences[0]
          node = sequence.nodes[0]
          # Note the fork chosen for this variation in the path
          @path[@path.m] = variation
          @path.m += 1
        else
          # End of sequence / game
          return this
      else
        node = localNodes[localIndex + 1]
        @path.m += 1
      this
    previous: ->
      localNodes = sequence.nodes
      localIndex = if localNodes then localNodes.indexOf(node) else null
      # Delete any variation forks at this point
      # TODO: Make this configurable... we should keep this if we're
      # remembering chosen paths
      delete @path[@path.m]
      if !localIndex or localIndex == 0
        if sequence.parent and !sequence.parent.gameTrees
          sequence = sequence.parent
          if sequence.nodes
            node = sequence.nodes[sequence.nodes.length - 1]
            @path.m -= 1
          else
            node = null
        else
          # Already at the beginning
          return this
      else
        node = localNodes[localIndex - 1]
        @path.m -= 1
      this
    last: ->
      totalMoves = @totalMoves()
      while @path.m < totalMoves
        @next()
      this
    first: ->
      @reset()
      this
    goTo: (path) ->
      if typeof path == 'string'
        path = @pathTransform(path, 'object')
      else if typeof path == 'number'
        path = m: path
      @reset()
      n = node
      i = 0
      while i < path.m and n
        variation = path[i] or 0
        n = @next(variation)
        i += 1
      this
    getGameInfo: ->
      @game.nodes[0]
    node: ->
      node
    totalMoves: ->
      localSequence = @game
      moves = 0
      while localSequence
        moves += localSequence.nodes.length
        if localSequence.sequences
          localSequence = localSequence.sequences[0]
        else
          localSequence = null
      # TODO: Right now we're *assuming* that the root node doesn't have a
      # move in it, which is *recommended* but not required practice.
      # @see http://www.red-bean.com/sgf/sgf4.html
      # "Note: it's bad style to have move properties in root nodes.
      # (it isn't forbidden though)"
      moves - 1
    comment: (text) ->
      if typeof text == 'undefined'
        # Unescape characters
        if node.C
          return node.C.replace(/\\([\\:\]])/g, '$1')
        else
          return ''
      else
        # Escape characters
        node.C = text.replace(/[\\:\]]/g, '\\$&')
      return
    translateCoordinates: (alphaCoordinates) ->
      coordinateLabels = 'abcdefghijklmnopqrst'
      intersection = []
      intersection[0] = coordinateLabels.indexOf(alphaCoordinates.substring(0, 1))
      intersection[1] = coordinateLabels.indexOf(alphaCoordinates.substring(1, 2))
      intersection
    pathTransform: (input, outputType, verbose) ->
      output = undefined
      # If no output type has been specified, try to set it to the
      # opposite of the input

      ###*
      # Turn a path object into a string.
      ###

      stringify = (input) ->
        if typeof input == 'string'
          return input
        if !input
          return ''
        output = input.m
        variations = []
        for key of input
          if input.hasOwnProperty(key) and key != 'm'
            # Only show variations that are not the primary one, since
            # primary variations are chosen by default
            if input[key] > 0
              if verbose
                variations.push ', variation ' + input[key] + ' at move ' + key
              else
                variations.push '-' + key + ':' + input[key]
        output += variations.join('')
        output

      ###*
      # Turn a path string into an object.
      ###

      parse = (input) ->
        if typeof input == 'object'
          input = stringify(input)
        if !input
          return { m: 0 }
        path = input.split('-')
        output = m: Number(path.shift())
        if path.length
          path.forEach (variation, i) ->
            variation = variation.split(':')
            output[Number(variation[0])] = variation[1]
            return
        output

      if typeof outputType == 'undefined'
        outputType = if typeof input == 'string' then 'object' else 'string'
      if outputType == 'string'
        output = stringify(input)
      else if outputType == 'object'
        output = parse(input)
      else
        output = undefined
      output
  new Smartgamer

# ---
# generated by js2coffee 2.1.0

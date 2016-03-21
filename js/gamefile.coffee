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

console.log parser(example)


<div id="drop_zone">Drop files here</div>
<output id="list"></output>

<script>
  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  // Setup the dnd listeners.
  var dropZone = document.getElementById('drop_zone');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);
</script>


Reading files

Now comes the fun part!

After you've obtained a File reference, instantiate a FileReader object to read its contents into memory. When the load finishes, the reader's onload event is fired and its result attribute can be used to access the file data.

FileReader includes four options for reading a file, asynchronously:

    FileReader.readAsBinaryString(Blob|File) - The result property will contain the file/blob's data as a binary string. Every byte is represented by an integer in the range [0..255].
    FileReader.readAsText(Blob|File, opt_encoding) - The result property will contain the file/blob's data as a text string. By default the string is decoded as 'UTF-8'. Use the optional encoding parameter can specify a different format.
    FileReader.readAsDataURL(Blob|File) - The result property will contain the file/blob's data encoded as a data URL.
    FileReader.readAsArrayBuffer(Blob|File) - The result property will contain the file/blob's data as an ArrayBuffer object.

Once one of these read methods is called on your FileReader object, the onloadstart, onprogress, onload, onabort, onerror, and onloadend can be used to track its progress.

The example below filters out images from the user's selection, calls reader.readAsDataURL() on the file, and renders a thumbnail by setting the 'src' attribute to a data URL.

<style>
  .thumb {
    height: 75px;
    border: 1px solid #000;
    margin: 10px 5px 0 0;
  }
</style>

<input type="file" id="files" name="files[]" multiple />
<output id="list"></output>

<script>
  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          var span = document.createElement('span');
          span.innerHTML = ['<img class="thumb" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
          document.getElementById('list').insertBefore(span, null);
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);
</script>

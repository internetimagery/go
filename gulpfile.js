// Distribution Tasks

var gulp = require("gulp");
var coffee = require("gulp-coffee");
var uglify = require("gulp-uglify");
var htmlmin = require("gulp-htmlmin");
var csso = require("gulp-csso");

gulp.task("html", function(){
  gulp.src("./*.html")
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(gulp.dest("./dist"))
});

gulp.task("js", function(){
  // Prep Coffeescript files
  gulp.src("./js/*.coffee")
  .pipe(coffee({bare:false}).on("error", function(err){console.log(err);}))
  .pipe(gulp.dest("./dist"))

  // Shrink javascript
  gulp.src("./dist/*.js")
  .pipe(uglify())
  .pipe(gulp.dest("./dist/js"))
});

gulp.task("css", function(){
  gulp.src("./css/*.css")
  .pipe(csso())
  .pipe(gulp.dest("./dist/css"))
});

// Watcher
gulp.task("watch", function(){
  gulp.watch("./js/*.coffee", ["js"])
  gulp.watch("./css/*.css", ["css"])
  gulp.watch("./*.html", ["html"])
});

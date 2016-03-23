// Distribution Tasks

var gulp = require("gulp");
var coffee = require("gulp-coffee");
var uglify = require("gulp-uglify");
var htmlmin = require("gulp-htmlmin");
var csso = require("gulp-csso");
var pages = require("gulp-gh-pages");
var concat = require("gulp-concat");
var htmlreplace = require("gulp-html-replace");

// Watcher
gulp.task("watch", function(){
  gulp.watch("./js/*.coffee", ["js"])
  gulp.watch("./css/*.css", ["css"])
  gulp.watch("./*.html", ["html"])
  gulp.watch("./img/*", ["img"])
});

gulp.task("default", ["html", "js", "css", "img"]);

gulp.task("deploy", function(){
  gulp.src("./dist/*")
  .pipe(pages({force: true, push: true}))
});

gulp.task("html", function(){
  gulp.src("./*.html")
  .pipe(htmlreplace({scripts: "js/game.js"}))
  .pipe(htmlmin({
    collapseWhitespace: true,
    removeComments: true
  }))
  .pipe(gulp.dest("./dist"))
});

gulp.task("js", function(){
  // Prep Coffeescript files
  gulp.src("./js/*.coffee")
  .pipe(coffee({bare:false}).on("error", function(err){console.log(err);}))
  .pipe(gulp.dest("./js"))
  // Combine all together
  .pipe(concat("game.js"))
  // Shrink
  .pipe(uglify())
  .pipe(gulp.dest("./dist/js"))
});

gulp.task("css", function(){
  gulp.src("./css/*.css")
  .pipe(csso())
  .pipe(gulp.dest("./dist/css"))
});

gulp.task("img", function(){
  gulp.src("./img/*")
  .pipe(gulp.dest("./dist/img"))
});

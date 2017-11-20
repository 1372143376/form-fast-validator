const 
  gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename')


gulp.task('default', function () {
  return gulp.src('./src/validator.js')
        .pipe(uglify())
        .pipe(rename({
          suffix: '.min'
        }))
        .pipe(gulp.dest('./src'))
})


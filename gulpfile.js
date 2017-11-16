const gulp        = require('gulp');
const gutil       = require('gulp-util');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const child       = require('child_process');
const browserSync = require('browser-sync').create();
const sass        = require('gulp-sass');

const siteRoot = '_site';
const cssFiles = 'src/style.scss';
const tailwindConfig = 'tailwind-config.js';

var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify('Running: $ jekyll build');
    return child.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

function compileSassFile(src, destinationFolder, options)
{
  return gulp.src(src)
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(siteRoot + '/assets/' + destinationFolder))
    .pipe(gulp.dest('assets/' + destinationFolder))
    .pipe(browserSync.reload({stream:true}))
    .pipe(cleancss())
    .pipe(browserSync.reload({stream:true}));
}

/**
 * Compile styles
 */
gulp.task('css', function () {
  return compileSassFile(
    'src/style.scss',
    'css'
  );
});

/**
 * Serve site with browserSync
 */
gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

  gulp.watch(['./src/**/*.scss'], ['css']);
  gulp.watch([
      '**/*.html', 
      '**/*.yml', 
      '!' + siteRoot + '/**/*'
    ], 
    ['jekyll-rebuild']
  );
});

gulp.task('default', ['css', 'serve']);

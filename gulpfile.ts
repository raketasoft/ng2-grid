'use strict';

const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const tsProject = ts.createProject('tsconfig.json');

/**
 * Remove build directory.
 */
gulp.task('clean', (cb) => {
  return del(['build'], cb);
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('tslint', () => {
  return gulp.src([
      '**/*.ts',
      '!node_modules/**/*'
    ])
    .pipe(tslint())
    .pipe(tslint.report('prose'));
});

/**
 * Compile TypeScript sources and create sourcemaps in build directory.
 */
gulp.task('compile', ['tslint'], () => {
  let tsResult = tsProject.src([
      '**/*.ts',
      '!node_modules/**/*.ts'
    ])
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject));

  return tsResult.js
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'));
});

/**
 * Copy all resources from src that are not TypeScript files into build directory.
 */
gulp.task('resources:src', () => {
  return gulp.src([
      'src/**/*.html',
      'src/**/*.css'
    ])
    .pipe(gulp.dest('build/src'));
});

/**
 * Copy all resources from demo that are not TypeScript files into build directory.
 */
gulp.task('resources:demo', () => {
  return gulp.src([
      'demo/**/*.html',
      'demo/**/*.css'
    ])
    .pipe(gulp.dest('build'));
});

/**
 * Copy all resources into build directory.
 */
gulp.task('resources', ['resources:src', 'resources:demo']);

/**
 * Copy all required libraries into build directory.
 */
gulp.task('libs', () => {
  return gulp.src([
      'es6-shim/es6-shim.min.js',
      'systemjs/dist/system-polyfills.js',
      'systemjs/dist/system.src.js',
      'angular2/bundles/angular2-polyfills.js',
      'angular2/es6/dev/src/testing/shims_for_IE.js',
      'angular2/bundles/angular2.dev.js',
      'rxjs/bundles/Rx.js'
    ], {cwd: 'node_modules/**'}) /* Glob required here. */
    .pipe(gulp.dest('build/lib'));
});

/**
 * Watch for changes in TypeScript, HTML and CSS files.
 */
gulp.task('watch', function () {
  gulp.watch([
      '**/*.ts',
      '!node_modules/**/*'
    ], ['compile']).on('change', function (e) {
      console.log('TypeScript file ' + e.path + ' has been changed. Compiling.');
    });
  gulp.watch([
      'demo/**/*.html',
      'demo/**/*.css',
    ], ['resources:demo']).on('change', function (e) {
      console.log('Resource file ' + e.path + ' has been changed. Updating.');
    });
  gulp.watch([
      'src/**/*.html',
      'src/**/*.css',
    ], ['resources:src']).on('change', function (e) {
      console.log('Resource file ' + e.path + ' has been changed. Updating.');
    });
});

/**
 * Build the project.
 */
gulp.task('build', ['compile', 'resources', 'libs'], () => {
  console.log('Building...');
});

/**
 * Default task.
 */
gulp.task('default', () => {
  console.log('Default task running...');
});
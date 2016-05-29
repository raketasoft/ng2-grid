import * as gulp from 'gulp';
import tslint from 'gulp-tslint';
import * as del from 'del';

gulp.task('tslint', () => {
  return gulp.src([
      '**/*.ts',
      '!**/*.d.ts',
      '!node_modules/**/*.ts',
      '!typings/**/*.ts'
    ])
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

gulp.task('clean', () => {
  return del([
    '**/*.js',
    '**/*.js.map',
    '**/*.d.ts',
    '!node_modules/**/*.js',
    '!node_modules/**/*.js.map',
    '!node_modules/**/*.d.ts',
    '!typings/**/*.d.ts',
    '!systemjs.config.js'
  ]);
});

import * as gulp from 'gulp';
import * as del from 'del';

gulp.task('clean', () => {
  return del([
    '**/*.js',
    '**/*.js.map',
    '!node_modules/**/*',
    '!systemjs.config.extras.js',
    '!systemjs.config.js',
    '!karma-test-shim.js',
    '!karma.conf.js',
    '!protractor.config.js',
  ]);
});

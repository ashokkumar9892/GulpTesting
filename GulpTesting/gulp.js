var gulp = require('gulp');
var del = require('del');
var typescript = require('gulp-typescript');
var tscConfig = require('./tsconfig.json');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var tsconfig = require('tsconfig-glob');
// clean the contents of the distribution directory
gulp.task('clean', function () {
    return del('dist/**/*');
});
// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['clean'], function () {
    return gulp.src(['app/**/*', 'index.html', 'styles.css', '!app/**/*.ts'], { base: './' })
        .pipe(gulp.dest('dist'));
});
// copy dependencies
gulp.task('copy:libs', ['clean'], function () {
    return gulp.src([
        'node_modules/angular2/bundles/angular2-polyfills.js',
        'node_modules/systemjs/dist/system.src.js',
        'node_modules/rxjs/bundles/Rx.js',
        'node_modules/angular2/bundles/angular2.dev.js',
        'node_modules/angular2/bundles/router.dev.js',
        'node_modules/node-uuid/uuid.js',
        'node_modules/immutable/dist/immutable.js'
    ])
        .pipe(gulp.dest('dist/lib'));
});
// linting
gulp.task('tslint', function () {
    return gulp.src('app/**/*.ts')
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});
// TypeScript compile
gulp.task('compile', ['clean'], function () {
    return gulp
        .src(tscConfig.files)
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/app'));
});
// update the tsconfig files based on the glob pattern
gulp.task('tsconfig-glob', function () {
    return tsconfig({
        configPath: '.',
        indent: 2
    });
});
// Run browsersync for development
gulp.task('serve', ['build'], function () {
    browserSync({
        server: {
            baseDir: 'dist'
        }
    });
    gulp.watch(['app/**/*', 'index.html', 'styles.css'], ['buildAndReload']);
});
gulp.task('build', ['tslint', 'compile', 'copy:libs', 'copy:assets']);
gulp.task('buildAndReload', ['build'], reload);
gulp.task('default', ['build']);
//# sourceMappingURL=gulp.js.map
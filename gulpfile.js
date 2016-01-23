'use strict';
/* jshint node: true */

var baseDir = process.cwd();

module.exports = function (bundles) {
    var gulp = require('gulp');
    var liveReload = null;

    /**
     * Extract translation strings from project
     */
    gulp.task('i18n:extract', i18nExtract);
    function i18nExtract () {
        var gettext = require('gulp-angular-gettext');

        return gulp.src(['src/**/*.html', 'src/**/!(*spec).js'])
            .pipe(gettext.extract('en.pot', {
                markerName: '_'
            }))
            .pipe(gulp.dest('i18n/'));
    }

    /**
     * Run JSHint on all source files
     */
    gulp.task('jshint', lintProject);
    function lintProject () {
        var jshint = require('gulp-jshint');

        gulp.src('src/**/*.js')
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('jshint-stylish'));
    }

    /**
     * Watch project files for changes and rebuild on demand
     */
    gulp.task('watch', watchProject);
    function watchProject() {
        liveReload = require('gulp-livereload');
        liveReload.listen();

        makeBundle(bundles.app, true);

        gulp.watch(bundles.appCss.src, compileAppSass);
        gulp.watch(bundles.vendorFiles.src, ['copy:vendor']);
        gulp.watch(bundles.assets.src, ['copy:assets']);

        compileAppSass();
        copyVendor();
        copyAssets();
    }

    /**
     * Build the entire project
     */
    gulp.task('build', buildProject);
    function buildProject() {
        buildApp();
        compileAppSass();
        copyVendor();
        copyAssets();
    }

    /**
     * Minify JS files
     */
    gulp.task('compress', compressProject);
    function compressProject() {
        compressFile(bundles.app.outputPath, bundles.app.outputName);
        renameFilesOnIndex();
    }

    /**
     * Build only the main application file
     */
    gulp.task('build:app', buildApp);
    function buildApp() {
        return makeBundle(bundles.app, false);
    }

    function compileSass (bundle) {
        var sass = require('gulp-sass');
        var multipipe = require('multipipe');
        var concat = require('gulp-concat');
        var options = {};

        if (bundle.include) {
            options.includePaths = bundle.include;
        }

        return multipipe(
            gulp.src(bundle.src),
            sass(options),
            concat(bundle.outputName),
            gulp.dest(bundle.outputPath),
            done
        );

        function done (err) {
            if (err) return onError(err);
            console.log('Compiled SASS for %s', bundle.outputName);
            reload(bundle.outputName);
        }
    }

    /**
     * Compile SASS files
     */
    gulp.task('css', compileAppSass);
    function compileAppSass () {
        return compileSass(bundles.appCss);
    }

    /**
     * Copy static files to public folder
     */
    gulp.task('copy:vendor', copyVendor);
    function copyVendor() {
        var bundle = bundles.vendorFiles;
        var multipipe = require('multipipe');

        multipipe(
            gulp.src(bundle.src),
            gulp.dest(bundle.outputPath),
            onError
        );
    }

    /**
     * Copy app assets (images, fonts, etc) to public folder
     */
    gulp.task('copy:assets', copyAssets);
    function copyAssets() {
        var bundle = bundles.assets;
        var multipipe = require('multipipe');

        multipipe(
            gulp.src(bundle.src),
            gulp.dest(bundle.outputPath),
            onError
        );
    }

    /**
     * Builds a javascript bundle with all the dependencies
     * Optionally, watch files for changes and rebuild
     */
    function makeBundle(bundle, watch) {
        var watchify = require('watchify');
        var browserify = require('browserify');
        var source = require('vinyl-source-stream');
        var bundler, rebundle;

        var bundlerOptions = {
            paths: ['src/lib', 'src/app'],
            basedir: baseDir,
            builtins: ['net', 'http', 'buffer', 'crypto', 'process', '_process', 'stream',
                'events', 'util', 'string_decoder', 'inherits', 'url', 'punycode',
                'querystring', 'zlib', '_stream_transform', 'assert'],
            debug: watch,
            cache: {}, // required for watchify
            packageCache: {}, // required for watchify
            fullPaths: watch, // required to be true only for watchify,
        };

        bundler = browserify(bundle.entry, bundlerOptions);

        if (watch) {
            bundler = watchify(bundler);
        }

        var babelOptions = {
            sourceMapRelative: baseDir,
            sourceMap: 'inline'
        };

        var stringifyOptions = {
            extensions: ['.html'],
            minify: true
        };

        bundler.transform('stringify', stringifyOptions);
        bundler.transform('babelify', babelOptions);

        if (bundle.ignore) {
            bundle.ignore.forEach(bundler.ignore.bind(bundler));
        }

        rebundle = function() {
            console.log('>> Updating bundle ' + bundle.outputName);
            var stream = bundler.bundle();
            stream.once('error', onError);
            stream = stream.pipe(source(bundle.outputName));
            stream = stream.pipe(gulp.dest(bundle.outputPath));

            stream.once('end', onEnd);
            stream.once('end', reload);
        };

        bundler.on('update', rebundle);

        return rebundle();
    }

    /**
     * Compress the scripts with UglifyJS
     */
    function compressFile (path, file) {
        var join = require('path').join,
            fullPath = join(path, file),
            uglify = require('gulp-uglify'),
            multipipe = require('multipipe'),
            rename = require('gulp-rename');

        return multipipe(
            gulp.src(fullPath),
            uglify(),
            rename({
                suffix: '.min'
            }),
            gulp.dest(path),
            onError
        );
    }

    function renameFilesOnIndex() {
        var fs = require('fs');
        var file = 'public/index.html';

        var content = fs.readFileSync(file, 'utf8');
        content = content.replace(/\.js/g, '.min.js');

        fs.writeFileSync(file, content);
    }

    /**
     * Fire up an HTTP server to test the app
     */
    gulp.task('serve', serveFiles);
    function serveFiles() {
        return require('./server');
    }

    function onEnd() {
        console.log('Done.');
    }

    function onError(error) {
        if (error) {
            console.error(error.message);
        }
    }

    function reload(item) {
        if (liveReload) {
            liveReload.changed(item || '*');
        }
    }

    var tools = require('./tools/commands');
    gulp.task('add:component', tools.createComponent);
    gulp.task('add:service', tools.createService);
    gulp.task('add:module', tools.createModule);
    gulp.task('add:class', tools.createClass);

};

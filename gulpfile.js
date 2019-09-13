'use strict';

const dirs = {
	source: 'static',
	build: 'public'
};

const images = [dirs.source + '/img/**/*.{gif,png,jpg,jpeg,svg,ico}'];
const icons = [dirs.source + '/i/**/*.{gif,png,jpg,jpeg,svg,ico}'];

const jsList = [
	dirs.source + '/js/ext/choices.js',
	dirs.source + '/js/ext/swiper.js',
	dirs.source + '/js/ext/ofi.js',
	dirs.source + '/js/ext/lightgallery.js',
	dirs.source + '/js/ext/modernizr-custom.js'
	// dirs.source + '/js/ext/imask.js',
	// dirs.source + '/js/ext/perfect-scrollbar.min.js',
	// dirs.source + '/js/ext/moment.min.js',
];

const folder = process.env.folder;

const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const objectFitImages = require('postcss-object-fit-images');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const cleanCSS = require('gulp-cleancss');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const uglify = require('gulp-uglify');
const wait = require('gulp-wait');
const sorting = require('postcss-sorting');
const focus = require('postcss-focus');
const short = require('postcss-short');
const assets = require('postcss-assets');
const babel = require('gulp-babel');
const sortCSSmq = require('sort-css-media-queries');
const willChange = require('postcss-will-change');
const pxtoviewport = require('postcss-px-to-viewport');

gulp.task('clean', function() {
	return del(dirs.build);
})

gulp.task('sass', function () {
	var processors = [
		willChange,
		short,
		// focus,
		autoprefixer(['last 2 version'], {
			cascade: true
		}),
		mqpacker({
			sort: sortCSSmq
		}),
		assets({
			basePath: 'static/',
			loadPaths: ['i/', 'img/']
		}),
		sorting({
			"sort-order": "yandex"
		})
	];
	return gulp.src(dirs.source + '/sass/styles.sass').
		pipe(plumber({
			errorHandler: function (err) {
				notify.onError({
					title: 'Styles compilation error',
					message: err.messagegulp
				})(err);
				this.emit('end');
			}
		})).pipe(wait(100)).pipe(sourcemaps.init()).
		pipe(sass()).
		pipe(postcss(processors)).
		pipe(sourcemaps.write('/')).
		pipe(gulp.dest(dirs.build + '/static/css/')).
		pipe(browserSync.stream({
			match: '**/*.css'
		})).
		pipe(rename('styles.min.css')).
		pipe(cleanCSS()).
		pipe(gulp.dest(dirs.build + '/static/css/'));
});

gulp.task("pug-concat", function() {
	gulp.src(dirs.source + '/pug/*.pug').pipe(plumber({
		errorHandler: notify.onError(function(error) {
			return {
				title: "PUG compilation error",
				message: error.message
			}
		})
	})).pipe(pug({
		pretty: true,
		compileDebug: true
	})).pipe(gulp.dest(dirs.build + '/')).pipe(browserSync.reload({
		stream: true
	}));
});

gulp.task('img', function() {
	return gulp.src(dirs.source + "/img/**/*.*")
	// .pipe(imagemin([
	// 	imagemin.gifsicle({
	// 		interlaced: true
	// 	}),
	// 	imagemin.jpegtran({
	// 		progressive: true
	// 	}),
	// 	imagemin.optipng({
	// 		optimizationLevel: 5
	// 	}),
	// 	imagemin.svgo({
	// 		plugins: [{
	// 			removeViewBox: true
	// 		}, {
	// 			cleanupIDs: false
	// 		}]
	// 	})
	// ]))
	.pipe(gulp.dest(dirs.build + "/img/")).pipe(browserSync.stream());
});

gulp.task('img:opt', function(callback) {
	if (folder) {
		return gulp.src(folder + '/*.{jpg,jpeg,gif,png,svg}').pipe(imagemin({
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngquant()]
		})).pipe(gulp.dest(folder));
	} else {
		console.log('Не указана папка с картинками. Пример вызова команды: folder=src/blocks/test-block/img npm start img:opt');
		callback();
	}
});

gulp.task('icons', function () {
	return gulp.src(dirs.source + "/i/**/*.*").pipe(imagemin([
		// imagemin.gifsicle({
		// 	interlaced: true
		// }),
		// imagemin.jpegtran({
		// 	progressive: true
		// }),
		// imagemin.optipng({
		// 	optimizationLevel: 5
		// }),
		// imagemin.svgo({
		// 	plugins: [{
		// 		removeViewBox: true
		// 	}, {
		// 		cleanupIDs: false
		// 	}]
		// })
	])).pipe(gulp.dest(dirs.build + "/static/i/")).pipe(browserSync.stream());
});

gulp.task('fonts', function() {
	return gulp.src([dirs.source + '/fonts/**/*.{ttf,woff,woff2,eot,svg}']).pipe(gulp.dest(dirs.build + '/static/css/fonts/'));
});

gulp.task('polyfill', function () {
	return gulp.src('node_modules/babel-polyfill/dist/polyfill.js').pipe(gulp.dest(dirs.build + '/static/js'));
});

gulp.task('data', function () {
	return gulp.src([dirs.source + '/data/*.json']).pipe(gulp.dest(dirs.build));
});

gulp.task('js-ext', function() {
	if (jsList.length) {
		return gulp.src(jsList).pipe(plumber({
			errorHandler: notify.onError(function(error) {
				return {
					title: "JS libs compilation error",
					message: error.message
				}
			})
		})).
		pipe(concat('vendor.min.js')).
		pipe(uglify()).
		pipe(gulp.dest(dirs.build + '/static/js'));
	} else {
		console.log('Javascript не обрабатывается');
		callback();
	}
});

gulp.task('js', function() {
	return gulp.src(dirs.source + "/js/script.js")
		.pipe(plumber({
			errorHandler: notify.onError(function(error) {
				return {
					title: "JS compilation error",
					message: error.message
				}
			})
		}))
		.pipe(babel({
			presets: ["env"],
			minified: true
		}))
		.pipe(uglify())
		.pipe(rename('script.min.js'))
		.pipe(gulp.dest(dirs.build + "/static/js/"))
		.pipe(browserSync.stream());
});

gulp.task('build', function(callback) {
	gulpSequence('clean', 'sass', 'fonts', 'js', 'js-ext', 'polyfill', 'pug-concat', 'icons', 'img', 'data', callback);
});

gulp.task('serve', ['build'], function() {

	browserSync.init({
		server: {
			baseDir: dirs.build,
			directory: true
		},
		open: false,
		port: 8080
	});

	if (images.length) {
		gulp.watch(images, ['img']);
	}
	if (icons.length) {
		gulp.watch(icons, ['icons']);
	}
	gulp.watch(dirs.source + "/sass/ext/*.css", ['sass']);
	gulp.watch(dirs.source + "/sass/**/**/*.sass", ['sass']);
	gulp.watch(dirs.source + "/pug/**/*.pug", ['pug-concat']);
	gulp.watch(dirs.source + '/fonts/*.{ttf,woff,woff2,eot,svg}', ['fonts']);
	gulp.watch(dirs.source + "/js/**/*.js", ['js']);
});

gulp.task('default', ['serve']);

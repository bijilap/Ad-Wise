var gulp = require('gulp');

var concat = require('gulp-concat');
var del = require('del');
var ejs = require('gulp-ejs');
var ngAnnotate = require('gulp-ng-annotate');
var pkg = require('./package.json');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var serve = require('gulp-serve');
var sourcemaps = require('gulp-sourcemaps');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var util = require('gulp-util');

gulp.task('default', ['build', 'watch', 'serve']);

gulp.task('build', ['styles', 'pages', 'static', 'project']);

gulp.task('dist', ['styles:dist', 'pages:dist', 'static:dist', 'project:dist']);

gulp.task('watch', function() {
	gulp.watch('src/styles/**/*', ['styles']);
	gulp.watch('src/pages/**/*', ['pages']);
	gulp.watch('src/static/**/*', ['static']);
	gulp.watch('src/modules/**/*', ['project']);
	gulp.watch('src/templates/**/*', ['project']);
});

gulp.task('serve', serve({
	root: ['build'],
	port: getConfig()['port'] || 3000
}));

gulp.task('clean', function(done) {
	del(['build', 'dist'], done);
});

gulp.task('styles', function() {
	return styles();
});
gulp.task('styles:dist', function() {
	return styles('dist');
});

gulp.task('pages', function(done) {
	pages();
	done();
});

gulp.task('pages:dist', function(done) {
	pages('dist');
	done();
});

gulp.task('static', function() {
	return staticFiles();
});

gulp.task('static:dist', function() {
	return staticFiles('dist');
});

gulp.task('modules', function() {
	return modules();
});

gulp.task('templates', function() {
	return templates();
});

gulp.task('project', ['modules', 'templates'], function(){
	return project();
});

gulp.task('project:dist', ['project'], function(){
	return project('dist');
});

function styles(target) {
	var destDir = (target === 'dist') ? target : 'build';
    return gulp.src('src/styles/*.scss')
    	.pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest(destDir));
}

function staticFiles(target) {
	var destDir = (target === 'dist') ? target : 'build';
	return gulp.src('src/static/**/*')
    	.pipe(plumber())
		.pipe(gulp.dest(destDir));
}

function pages(target){
	var config = getConfig(target);
	var destDir = (target === 'dist') ? target : 'build';

	gulp.src('src/pages/index.ejs')
		.pipe(plumber())
		.pipe(ejs({
			target: target,
			config: config
		}))
		.pipe(gulp.dest(destDir));

	if (config.pages) {
		config.pages.forEach(function (page) {
			var template = page.template || config.pageTemplate;
			gulp.src(template)
				.pipe(plumber())
				.pipe(ejs({
					target: target,
					config: config,
					page: page
				}))
				.pipe(rename({basename: page.name}))
				.pipe(gulp.dest(destDir));
		});
	}
}

function project(target){
	var destDir = (target === 'dist') ? target : 'build';
	return gulp.src([
		'build/modules.js',
		'build/templates.js'])
		.pipe(plumber())
		.pipe(concat(pkg.name + '.js'))
		.pipe(gulp.dest(destDir));
}

function modules() {
	return gulp.src([
			'src/modules/' + pkg.name + '.js',
			'src/modules/**/*-module.js',
			'src/modules/**/*.js',
			'!src/**/*_test.js'])
		.pipe(plumber())
        .pipe(ngAnnotate())
        .pipe(concat('modules.js'))
        .pipe(gulp.dest('build'));
}

function templates() {
	return gulp.src('src/templates/**/*.html')
		.pipe(plumber())
        .pipe(templateCache('templates.js', { module: 'watchwith.templates',}))
        .pipe(gulp.dest('build'));
}

function getConfig(target) {
	var config = {};
	if (pkg.ww && pkg.ww.config) {
		var defaultConfig = pkg.ww.config.default;
		if (defaultConfig) copyFields(defaultConfig, config);
		if (target && pkg.ww.config[target]) copyFields(pkg.ww.config[target], config);
	} else {
		util.log(util.colors.magenta('No Watchwith config in package.json'));
	}
	return config;
}

function copyFields(srcObj, destObj) {
	for (var field in srcObj) { destObj[field] = srcObj[field];}
}


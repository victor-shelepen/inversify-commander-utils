const gulp = require('gulp');
const tsc = require('gulp-typescript');
const fs = require('fs-extra');

const tsLibProject = tsc.createProject('tsconfig.json', {
    module: 'commonjs'
});

const tsDtsProject = tsc.createProject('tsconfig.json', {
    declaration: true,
    noResolve: false
});

gulp.task('build-clean', (done) => {
    fs.removeSync('./lib');
    fs.removeSync('./dts');
    done();
});

gulp.task('build-lib', () => {
    return gulp.src([
        'src/**/*.ts'
    ])
        .pipe(tsLibProject())
        .on('error', function (err) {
            console.log(err);
            process.exit(1);
        })
        .js.pipe(gulp.dest('lib/'));
});

gulp.task('build-dts', () => {
    return gulp.src([
        'src/**/*.ts'
    ])
        .pipe(tsDtsProject())
        .on('error', (err) => {
            console.log(err);
            process.exit(1);
        })
        .dts.pipe(gulp.dest('dts'));
});

//gulp.task('default', ['build-clean', 'build-dts', 'build-lib']);

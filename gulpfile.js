const gulp = require('gulp');
const tsc = require("gulp-typescript");

const tsLibProject = tsc.createProject("tsconfig.json", {
    module: "commonjs"
});

const tsDtsProject = tsc.createProject("tsconfig.json", {
    declaration: true,
    noResolve: false
});

gulp.task("build-lib", function () {
    return gulp.src([
        "src/**/*.ts"
    ])
        .pipe(tsLibProject())
        .on("error", function (err) {
            console.log(err);
            process.exit(1);
        })
        .js.pipe(gulp.dest("lib/"));
});

gulp.task("build-dts", function () {
    return gulp.src([
        "src/**/*.ts"
    ])
        .pipe(tsDtsProject())
        .on("error", function (err) {
            console.log(err);
            process.exit(1);
        })
        .dts.pipe(gulp.dest("dts"));

});

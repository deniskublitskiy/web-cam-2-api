import gulp from 'gulp';
import sourceMaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';

gulp.task('default', () =>
    gulp.src('./src/**/*.js')
        .pipe(sourceMaps.init())
        .pipe(babel())
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest('dist'))
);
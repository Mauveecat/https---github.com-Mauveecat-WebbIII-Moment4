//Definiera variabler
const { src, dest, series, parallel, watch } = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

//Sökvägar
const files = {
    htmlPath: "src/**/*.html",
    cssPath: "src/css/*css",
    jsPath: "src/js/*.js",
    imagePath: "src/images/*",
    sassPath: "src/sass/*.scss"

}

//HTML-task
function copyHTML() {
    return src(files.htmlPath)
        //Kopiera till och uppdatera filer i pub
        .pipe(dest("pub"));
}

//JS-task
function copyJS() {
    return src(files.jsPath)
        //Transpilera med Babel
        .pipe(babel())
        //komprimera flera filer till en
        .pipe(concat('main.js'))
        //Minimera kod och ta bort kommentarer
        .pipe(terser())
        //Kopiera till och uppdatera filer i pub
        .pipe(dest('pub/js'));
}

//Image-task
function copyImage() {
    return src(files.imagePath)
        //Minimera bilder
        .pipe(imagemin())
        //Kopiera till och uppdatera filer i pub
        .pipe(dest('pub/images'));
}

//Sass-task
function copySass() {
    return src(files.sassPath)
        .pipe(sourcemaps.init())
        //Logga felmeddelanden och komprimera sass(css):en
        .pipe(sass({ outputStyle: "compressed" }).on('error', sass.logError))
        //Kopiera till och uppdatera filer i pub
        .pipe(dest('pub/css'))
        //Sourcemaps
        .pipe(sourcemaps.write('./maps'))
        //liveupdate-reload i browsern
        .pipe(browserSync.stream());
}

//Watch-task
function watchTask() {

    //Initiera browsersync
    browserSync.init({
        server: "./pub"
    });

    watch([files.htmlPath, files.jsPath, files.imagePath, files.sassPath], parallel(copyHTML, copyJS, copyImage, copySass)).on('change', browserSync.reload);
}

//Export tasks
exports.default = series(
    parallel(copyHTML, copyJS, copyImage, copySass),
    watchTask
);
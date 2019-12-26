const mix = require('laravel-mix');

mix.js('src/js/scene.js', 'build/js/scene.js')
   .sass('src/scss/style.scss', 'build/css/style.css').options({ processCssUrls: false });
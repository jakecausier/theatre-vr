const mix = require('laravel-mix');

mix.js('src/js/scene.js', 'build/js')
   .sass('src/scss/style.scss', 'build/css')
   .version();
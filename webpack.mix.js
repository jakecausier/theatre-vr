const mix = require('laravel-mix');

mix.js('src/js/scene-a.js', 'build/js/scene.js')
   .js('src/js/video.js', 'build/js/video.js')
   .copy('src/img/', 'build/img/')
   .sass('src/scss/style.scss', 'build/css/style.css').options({ processCssUrls: false });
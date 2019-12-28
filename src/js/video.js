import videojs from 'video.js'

var video, player
videojs.log.level('off')

video = document.getElementById('player')
document.player = videojs('player')


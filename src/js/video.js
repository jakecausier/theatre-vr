import videojs from 'video.js'

var video, player

video = document.getElementById('player')
player = videojs('player')
player.play()
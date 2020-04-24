
import videojs from 'video.js'

var video, player, startButton
// videojs.log.level('off')

startButton = document.getElementById('enter')
startButton.addEventListener('click', function () {
  load()
}, false )


function load() {
  document.getElementById('dummy').load();
  document.getElementById('overlay').remove();

  document.player = videojs('player')
}

require('aframe')
require('aframe-gui')
require('aframe-event-set-component')
require('super-hands');


// To-Add
// https://www.npmjs.com/package/aframe-particle-system-component


window.THREE.TextureLoader.prototype.crossOrigin = 'anonymous';
window.THREE.ImageLoader.prototype.crossOrigin = 'anonymous';
window.THREE.ImageUtils.crossOrigin = 'anonymous';

window.THREE.gammaOutput = true;
window.THREE.gammaFactor = 2.2;


var playerSlider, defaultVolume, newVolume;


window.startVideo = function () {
  playerSlider = document.querySelector('#player-volume');
  defaultVolume = playerSlider.getAttribute('percent');
  console.log('Getting default volume from element...', defaultVolume)
  document.player.volume(defaultVolume);

  document.player.setAttribute('crossorigin', 'anonymous');
  document.player.src({
    type: 'application/x-mpegurl',
    src: '//comfytheatre.co.uk:8080/hls/cal.m3u8'
  });
  document.player.play();
}

window.changeVolume = function (event, data) {
  newVolume = data.toFixed(2);
  console.log('Setting new volume...', newVolume)
  playerSlider = document.querySelector('#player-volume');
  playerSlider.setAttribute('percent', newVolume);
  document.player.volume(newVolume);
}


// THREE.WebGLState: DOMException: Failed to execute 'texImage2D' on 'WebGLRenderingContext': The video element contains cross-origin data, and may not be loaded.
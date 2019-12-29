
require('aframe')
require('aframe-gui')
require('aframe-event-set-component')


// To-Add
// https://www.npmjs.com/package/aframe-particle-system-component


window.THREE.TextureLoader.prototype.crossOrigin = '';
window.THREE.ImageLoader.prototype.crossOrigin = '';
window.THREE.ImageUtils.crossOrigin = '';

window.THREE.gammaOutput = true;
window.THREE.gammaFactor = 2.2;


var playerSlider, defaultVolume, newVolume;


window.startVideo = function () {
  playerSlider = document.querySelector('#player-volume');
  defaultVolume = playerSlider.getAttribute('percent');
  console.log('Getting default volume from element...', defaultVolume)
  document.player.volume(defaultVolume);
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
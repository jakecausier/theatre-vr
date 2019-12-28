
require('aframe')
require('aframe-event-set-component')

window.THREE.TextureLoader.prototype.crossOrigin = '';
window.THREE.ImageLoader.prototype.crossOrigin = '';
window.THREE.ImageUtils.crossOrigin = '';

window.THREE.gammaOutput = true;
window.THREE.gammaFactor = 2.2;

AFRAME.registerComponent('ui-playbutton', {
  init: function () {
    var el = this.el;
    el.addEventListener('mouseenter', function () {
      document.player.play()
    });
  }
});

// AFRAME.registerComponent('ui-fade-hide', function() {

// });

// THREE.WebGLState: DOMException: Failed to execute 'texImage2D' on 'WebGLRenderingContext': The video element contains cross-origin data, and may not be loaded.
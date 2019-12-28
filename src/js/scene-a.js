
require('aframe')
require('aframe-event-set-component')

window.THREE.TextureLoader.prototype.crossOrigin = '';
window.THREE.ImageLoader.prototype.crossOrigin = '';
window.THREE.ImageUtils.crossOrigin = '';


AFRAME.registerComponent('ui-playbutton', {
  init: function () {
    var el = this.el;
    el.addEventListener('mouseenter', function () {
      document.player.play()
    });
  }
});

// THREE.WebGLState: DOMException: Failed to execute 'texImage2D' on 'WebGLRenderingContext': The video element contains cross-origin data, and may not be loaded.
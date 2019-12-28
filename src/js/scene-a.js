
require('aframe')
require('aframe-event-set-component')

window.THREE.TextureLoader.prototype.crossOrigin = '';

AFRAME.registerComponent('ui-playbutton', {
  init: function () {
    var el = this.el;
    el.addEventListener('mouseenter', function () {
      document.player.play()
    });
  }
});

console.log(window.THREE)
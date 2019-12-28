
require('aframe')
require('aframe-event-set-component')


AFRAME.registerComponent('ui-playbutton', {
  init: function () {
    var el = this.el;
    el.addEventListener('mouseenter', function () {
      document.player.play()
    });
  }
});
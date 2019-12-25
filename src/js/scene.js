
const THREE = require('three')

import videojs from 'video.js'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

var loader = new GLTFLoader();
var renderer, controls, camera, scene;
var video, player, videoImage, videoImageContext, videoTexture;

videojs.log.level('off')

init();
animate();


function init() {

  video = document.getElementById('player');
  player = videojs('player');
  // player.play();

  scene = new THREE.Scene();
  window.scene = scene;


  var screenWidth = 6500
  var screenHeight = 3375


  videoImage = document.createElement('canvas');
  videoImage.width = 1280;
  videoImage.height = 720;
  videoImageContext = videoImage.getContext('2d');
  videoImageContext.fillStyle = '#000000';
  videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );
  videoTexture = new THREE.Texture( videoImage );
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;

  var screenMat = new THREE.MeshBasicMaterial({ map: videoTexture });
  var screenGeo = new THREE.PlaneBufferGeometry(screenWidth, screenHeight, 1, 1)
  var screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, 2400, 7800);
  screen.lookAt(0, 2400, 0);
  scene.add(screen);


  var spotLight = new THREE.SpotLight( 0xffffff, 5 );
  spotLight.position.set( 0, 2800, 8000 );
  spotLight.angle = 1.3;
  spotLight.penumbra = 0.2;
  spotLight.decay = 2;
  spotLight.distance = 15000;
  scene.add(spotLight);

  // var lightHelper = new THREE.SpotLightHelper( spotLight );
  // scene.add( lightHelper )


  var light = new THREE.AmbientLight( 0xFFDD80, 0.1 )
  scene.add( light )

  loader.load('../../models/TheatreEmpty/TheatreEmpty.gltf',
    function (gltf) {
      scene.add(gltf.scene)
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function ( error ) {
      console.log('An error happened while loading the model');
    }
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.xr.enabled = true;

  document.body.appendChild(renderer.domElement)
  document.body.appendChild(VRButton.createButton(renderer));


  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 50000)
  camera.position.set( -4000, 4000, 4000 )
  camera.layers.enable( 1 )
  camera.lookAt(screen.position)


  // controls = new OrbitControls( camera, renderer.domElement );
  // controls.update();


  // Listen for if the window is resized
  window.addEventListener( 'resize', onWindowResize, false );

}

function animate() {
  // Render everything in a loop
  renderer.setAnimationLoop( render )
}

function render() {

  videoImageContext.drawImage( video, 0, 0 );
  renderer.render( scene, camera );
  controls.update();

  if ( videoTexture ) {
    videoTexture.needsUpdate = true;
  }

  // if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
  //   videoImageContext.drawImage( video, 0, 0 );
  //   if ( videoTexture ) {
  //     videoTexture.needsUpdate = true;
  //   }
  //   renderer.render( scene, camera );
  //   controls.update();
  // }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}
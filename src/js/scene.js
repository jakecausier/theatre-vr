
const THREE = require('three')

import videojs from 'video.js'
import FastAverageColor from 'fast-average-color';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

var loader = new GLTFLoader();
var renderer, controls, camera, scene, targetMesh, targetBox, middleColour, lightScreen;
var video, player, videoImage, videoImageContext, videoTexture;
var fastColour = new FastAverageColor();

videojs.log.level('off')

init();
animate();


function load() {
  loader.load('../../models/TheatreEmpty/TheatreEmpty.gltf',
    function (gltf) {
      console.log('Object loaded!')
      scene.add(gltf.scene)
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function ( error ) {
      console.log('An error happened while loading the model');
    }
  );
}

function init() {

  scene = new THREE.Scene();
  window.scene = scene;

  load();

  video = document.getElementById('player');
  player = videojs('player');
  player.play();

  var screenWidth = 6500
  var screenHeight = 3375

  var invisiMat = new THREE.MeshBasicMaterial();
  invisiMat.transparent = true;
  invisiMat.opacity = 0.8;

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


  targetBox = new THREE.Object3D();
  targetBox.position.set(0, 0, 8000)
  scene.add(targetBox);

  lightScreen = new THREE.SpotLight(0x000000, 0.05)
  lightScreen.position.set(0, 8000, 8000)
  lightScreen.target = targetBox
  lightScreen.angle = 1.3
  lightScreen.penumbra = 0.2
  lightScreen.decay = 2
  lightScreen.distance = 15000
  scene.add(lightScreen)


  setupRoofLight(6000, 10000, 0xFFDD80, 0.5)
  setupRoofLight(-2000, 10000, 0xFFDD80, 0.5)
  setupRoofLight(-8000, 10000, 0xFFDD80, 0.5)


  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement)
  document.body.appendChild(VRButton.createButton(renderer));


  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 40000);
  camera.position.set( 0, 1600, 2000 );
  camera.lookAt(screen.position);
  camera.layers.enable( 1 )


  // controls = new OrbitControls( camera, renderer.domElement );
  // controls.update();


  // Listen for if the window is resized
  window.addEventListener( 'resize', onWindowResize, false );


  function setupRoofLight(position, height, colour, brightness) {
    var lightRoof = new THREE.SpotLight(colour, brightness)
    targetBox = new THREE.Object3D();
    targetBox.position.set(0, 0, position)
    scene.add(targetBox);
    lightRoof.position.set(0, height, position)
    lightRoof.target = targetBox
    lightScreen.angle = 1.3
    lightRoof.penumbra = 1
    lightRoof.decay = 1
    lightRoof.distance = 20000
    scene.add(lightRoof)
  } 

}

function animate() {
  // Render everything in a loop
  renderer.setAnimationLoop(render)
}

function render() {
  videoImageContext.drawImage(video, 0, 0)
  renderer.render(scene, camera)

  // controls.update()

  middleColour = fastColour.getColor(videoImageContext.canvas)
  lightScreen.color = new THREE.Color(middleColour.value[0], middleColour.value[1], middleColour.value[2], 1)

  if (videoTexture) {
    videoTexture.needsUpdate = true
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}
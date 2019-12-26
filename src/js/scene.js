
const THREE = require('three')

import videojs from 'video.js'
import FastAverageColor from 'fast-average-color'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

var loader = new GLTFLoader()
var container
var renderer, controls, camera, scene, targetMesh, targetBox, middleColour, lightScreen
var video, player, videoImage, videoImageContext, videoTexture
var fastColour = new FastAverageColor()

var enableControls = false

videojs.log.level('off')


var startButton = document.getElementById('startButton')
startButton.addEventListener('click', function () {
  init()
  animate()
}, false )


function init() {

  var overlay = document.getElementById('overlay')
  overlay.remove()

  scene = new THREE.Scene()
  window.scene = scene

  load()

  video = document.getElementById('player')
  player = videojs('player')
  player.play()

  var screenWidth = (1280 / 2) // 6500
  var screenHeight = (720 / 2) // 3375

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


  var screenMat = new THREE.MeshBasicMaterial({ map: videoTexture })
  screenMat.encoding = THREE.sRGBEncoding
  var screenGeo = new THREE.PlaneBufferGeometry(screenWidth, screenHeight, 1, 1)
  var screen = new THREE.Mesh(screenGeo, screenMat)
  screen.position.set(0, 240, 780)
  screen.lookAt(0, 240, 0)
  scene.add(screen)


  targetBox = new THREE.Object3D();
  targetBox.position.set(0, 0, 800)
  scene.add(targetBox);

  lightScreen = new THREE.SpotLight(0x000000, 0.05)
  lightScreen.position.set(0, 800, 800)
  lightScreen.target = targetBox
  lightScreen.angle = 1.3
  lightScreen.penumbra = 0.2
  lightScreen.decay = 2
  lightScreen.distance = 1500
  scene.add(lightScreen)


  setupRoofLight(600, 1000, 0xFFDD80, 0.5)
  setupRoofLight(-200, 1000, 0xFFDD80, 0.5)
  setupRoofLight(-800, 1000, 0xFFDD80, 0.5)


  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement)
  document.body.appendChild(VRButton.createButton(renderer));


  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 4000);
  camera.position.set( 0, 160, 200 );
  camera.lookAt(screen.position);
  camera.layers.enable( 1 )


  if ( enableControls ) {
    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 100
    controls.maxDistance = 600
    controls.update();
  }


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
    lightRoof.distance = 2000
    scene.add(lightRoof)
  } 

}

function load() {
  var obj

  loader.load('../../models/TheatreEmpty/TheatreEmpty.gltf',
    function (gltf) {
      obj = gltf.scene
      obj.scale.set(0.1, 0.1, 0.1)
      scene.add(obj)
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.log('An error happened while loading the model');
    }
  )


}

function animate() {
  // Render everything in a loop
  renderer.setAnimationLoop(render)
}

function render() {
  videoImageContext.drawImage(video, 0, 0)
  renderer.render(scene, camera)

  middleColour = fastColour.getColor(videoImageContext.canvas)
  lightScreen.color = new THREE.Color(middleColour.value[0], middleColour.value[1], middleColour.value[2], 1)

  if (videoTexture) {
    videoTexture.needsUpdate = true
  }

  if ( enableControls ) {
    controls.update()
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}
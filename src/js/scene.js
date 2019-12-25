
const THREE = require('three')

import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

var loader = new GLTFLoader();
var renderer, camera, scene;

init();
animate();


function init() {

  scene = new THREE.Scene();
  window.scene = scene;


  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 50000)
  camera.position.set( 0, 1000, 1000 )


  var screenWidth = 6500
  var screenHeight = 4000


  var screenGeo = new THREE.PlaneBufferGeometry(screenWidth, screenHeight, 1, 1)
  var screenMat = new THREE.MeshBasicMaterial({ color: 0x111111 })
  var screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, 2400, 7800);
  screen.lookAt(0, 2400, 0);
  scene.add(screen);


  var spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 0, 2800, 7800 );
  spotLight.castShadow = true;
  spotLight.angle = 1.3;
  spotLight.penumbra = 0.2;
  spotLight.decay = 2;
  spotLight.distance = 15000;
  scene.add(spotLight);

  var lightHelper = new THREE.SpotLightHelper( spotLight );
  scene.add( lightHelper )


  var light = new THREE.AmbientLight( 0xFFDD80, 0.25 )
  scene.add( light )


  loader.load('../../models/TheatreEmpty/TheatreEmpty.gltf',
    function (gltf) {
      gltf.scene.castShadow = true
      gltf.scene.receiveShadow = true
      scene.add(gltf.scene)
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function ( error ) {
      console.log('An error happened while loading the model');
    }
  );

  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement)
  document.body.appendChild(VRButton.createButton(renderer));

  // Listen for if the window is resized
  window.addEventListener( 'resize', onWindowResize, false );

}

function animate() {
  // Render everything in a loop
  renderer.setAnimationLoop( render() )
}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
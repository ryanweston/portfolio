import * as THREE from './three/build/three.module.js';
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './three/examples/jsm/loaders/DRACOLoader.js';
import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from './three/examples/jsm/postprocessing/GlitchPass.js';

// Instantiate a loader
var loader = new GLTFLoader();
// Optional: Provide a DRACOLoader instance to decode compressed mesh data
var dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('../decoder/');
// dracoLoader.setDecoderConfig( { type: 'js' } );
loader.setDRACOLoader(dracoLoader);



const loadingScreen = document.getElementById("loading");
const domWrapper = document.getElementById("wrapper");

var model;
var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 2, 1000);
camera.position.y = 8;
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer();


renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var composer = new EffectComposer( renderer );

//LIGHTS
var light = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(light);

var light2 = new THREE.PointLight(0xffffff, 1.5);
scene.add(light2);

var renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

var glitchPass = new GlitchPass();
composer.addPass( glitchPass );



// Load a glTF resource
loader.load(
    // resource URL
    '../models/compressed.glb',

    // called when the resource is loaded
    function (gltf) {
        model = gltf.scene;
        var material1 = new THREE.MeshStandardMaterial({ wireframe: true });
        model.traverse((o) => {
            if (o.isMesh) {
                console.log("there is a mesh");
                // note: for a multi-material mesh, `o.material` may be an array,
                // in which case you'd need to set `.map` on each value.
                o.material = material1;
            }
        })
        scene.add(model);
        animate();
        // dracoLoader.dispose();
    },
    // called while loading is progressing
    function (xhr) {
        var currentLoad = (xhr.loaded / xhr.total * 100);

        if (currentLoad !== 100) {
            console.log(currentLoad);
            domWrapper.style.display = 'none';
            loadingScreen.style.display = 'flex';
        } else if (currentLoad === 100) {
            console.log("Load successful!");
            domWrapper.style.display = 'block';
            loadingScreen.style.display = 'none';
        }
    },
    // called when loading has errors
    function (error) {
        console.log(error);
        console.log('An error happened');

    }
);



window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {

	requestAnimationFrame( animate );
    model.rotation.y += 0.01;
    model.position.x = 2;
	composer.render();

}

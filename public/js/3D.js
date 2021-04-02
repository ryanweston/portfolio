import * as THREE from './three/build/three.module.js';
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './three/examples/jsm/loaders/DRACOLoader.js';

// Instantiate a loader
var loader = new GLTFLoader();
// Optional: Provide a DRACOLoader instance to decode compressed mesh data
var dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('../decoder/');
// dracoLoader.setDecoderConfig( { type: 'js' } );
loader.setDRACOLoader(dracoLoader);
var renderer,
scene,
camera,
myCanvas = document.getElementById('c');

//RENDERER
renderer = new THREE.WebGLRenderer({
    canvas: myCanvas, 
    alpha: true,
    antialias: true
});
renderer.setClearColor( 0x000000, 0 );
// renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//CAMERA
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.y = 8;
camera.position.z = 35;
// camera.position

//SCENE
scene = new THREE.Scene();

//LIGHTS
var light = new THREE.AmbientLight(0xffffff, 10);
    scene.add(light);
    var light2 = new THREE.PointLight(0xFFFFFF, 15);
    scene.add(light2);



var material1 = new THREE.MeshStandardMaterial({ wireframe: true, color: 0x000000});
var model;

loader.load(
    // resource URL
    '../models/compressed.glb',

    // called when the resource is loaded
    function (gltf) {
        model = gltf.scene;
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
        dracoLoader.dispose();
    },
    // called while loading is progressing
    function (xhr) {
        var currentLoad = (xhr.loaded / xhr.total * 100);

        if (currentLoad !== 100) {
            console.log(currentLoad);
            // domWrapper.style.display = 'none';
            // loadingScreen.style.display = 'flex';
        } else if (currentLoad === 100) {
            console.log("Load successful!");
            // domWrapper.style.display = 'block';
            // loadingScreen.style.display = 'none';
        }
    },
    // called when loading has errors
    function (error) {
        console.log(error);
        console.log('An error happened');

    }
);


//RENDER LOOP
render();


function render() {
if (model) {
    model.rotation.y +=0.01;
    // mesh.rotation.z += 0.01;
}
renderer.render(scene, camera);
requestAnimationFrame(render);
}



window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize( window.innerWidth, window.innerHeight );
}

// window.addEventListener("scroll", updateCamera);
// function updateCamera(ev) {
//     let div1 = document.getElementById("div1");
//     camera.position.z =  35 + window.scrollY / 10;
//     camera.updateProjectionMatrix();
//     console.log(camera.position.z);
// }


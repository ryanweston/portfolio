

// Instantiate a loader
var loader = new THREE.GLTFLoader();
var model;
camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 7, 3000);
camera.position.y = 8;
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer();


renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();
// Optional: Provide a DRACOLoader instance to decode compressed mesh data
// var dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath('/examples/js/libs/draco/');
// loader.setDRACOLoader(dracoLoader);;

//LIGHTS
var light = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(light);

var light2 = new THREE.PointLight(0xffffff, 1.5);
scene.add(light2);

// Load a glTF resource
loader.load(
    // resource URL
    '../models/doinky.glb',
    // called when the resource is loaded
    function (gltf) {
        model = gltf.scene;
        scene.add(gltf.scene);
        gltf.scene; // THREE.Group
        render();



    },
    // called while loading is progressing
    function (xhr) {

        console.log((xhr.loaded / xhr.total * 100) + '% loaded');

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

// camera.position.z = 5;

var render = function () {
    requestAnimationFrame(render);
    model.rotation.y = Date.now() * .0002;
    model.position.x = -9;
    renderer.render(scene, camera);

};

render();
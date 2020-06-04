

// Instantiate a loader
var loader = new THREE.GLTFLoader();
const loadingScreen = document.getElementById("loading");
const domWrapper = document.getElementById("wrapper");
var model;
camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 100, 000);
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
        var material1 = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
        model.traverse((o) => {
            if (o.isMesh) {
                console.log("there is a mesh");
                // note: for a multi-material mesh, `o.material` may be an array,
                // in which case you'd need to set `.map` on each value.
                o.material = material1;
            }
        })
        scene.add(gltf.scene);
    },
    // called while loading is progressing
    function (xhr) {
        var currentLoad = (xhr.loaded / xhr.total * 100);

        if (currentLoad !== 100) {
            console.log(currentLoad);
            domWrapper.style.display = 'none';
            loadingScreen.style.display = 'block';
        } else if (currentLoad === 100) {
            console.log("Load successful!");
            domWrapper.style.display = 'block';
            loadingScreen.style.display = 'none';
            render();
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
    // if (window.innerWidth < 1200) {
    //     model.position.x = 0;
    //     console.log(window.innerWidth);
    //     camera.updateProjectionMatrix();
    // }
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// camera.position.z = 5;

var render = function () {
    requestAnimationFrame(render);
    model.rotation.y = Date.now() * .0002;
    model.position.x = 2;
    renderer.render(scene, camera);
};

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

var links = document.getElementsByClassName("project-link");
console.log(links);

const scenes = [];
let canvas, renderer;

init();
animate();

function init() {
    canvas = document.getElementById("c");
    loadScene1();
    loadScene2();

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
}

function loadScene1() {
    var model;

    const scene = new THREE.Scene();

    scene.userData.name = 'faces';

    const element = document.getElementById('model1');

    const sceneElement = document.createElement('div');
    element.appendChild(sceneElement);

    scene.userData.element = sceneElement;

    //CAMERA
    var camera = new THREE.PerspectiveCamera(70, 1, 1, 100);
    camera.position.y = 8;
    camera.position.z = 18;
    scene.userData.camera = camera;

    // scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444 ) );

    // var light = new THREE.AmbientLight(0xffffff, 0.5);
    // scene.add( light );

    // LIGHTS
    var light = new THREE.AmbientLight(0xffffff, 3);
    scene.add(light);
    var light2 = new THREE.PointLight(0xffffff, 9);
    scene.add(light2);

    //MATERIALS
    var material1 = new THREE.MeshStandardMaterial({ wireframe: true, color: 0x000000 });

    // Load a glTF resource
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
            // animate();
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

    scenes.push(scene);
}

function loadScene2() {
    const scene = new THREE.Scene();

    scene.userData.name = 'circle';

    const element = document.getElementById('model2');

    const sceneElement = document.createElement('div');
    element.appendChild(sceneElement);

    scene.userData.element = sceneElement;

    const camera = new THREE.PerspectiveCamera(50, 1, 1, 10);
    camera.position.z = 2;
    scene.userData.camera = camera;


    const geometry = new THREE.SphereBufferGeometry(0.5, 32, 32);

    var defaultMat = new THREE.ShaderMaterial({
        uniforms: {
            color1: {
                value: new THREE.Color("black")
            },
            color2: {
                value: new THREE.Color("grey")
            }
        },
        vertexShader: `
          varying vec2 vUv;
      
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
        
          varying vec2 vUv;
          
          void main() {
            
            gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
          }
        `,
        wireframe: true
    });


    let material = defaultMat;


    for (var i = 0; i < links.length; i++) {
        var a = links[i];
        a.addEventListener("mouseover", (el) => {
            let url = el.target.getAttribute("data");
            var texture = new THREE.TextureLoader().load('../images/projects/' + url + '.jpg');
            const hoverMat = new THREE.MeshStandardMaterial({
                map: texture,
                wireframe: false
            });
            scene.children[0].material = hoverMat;
        })
        a.addEventListener("mouseout", () => {
            scene.children[0].material = defaultMat;
        })
    };

    scene.add(new THREE.Mesh(geometry, material));
    // var light = new THREE.AmbientLight(0xffffff, 0);
    // scene.add(light);
    // var light2 = new THREE.PointLight(0xffffff, 0.1);
    // scene.add(light2);



    scenes.push(scene);
}


function animate() {
    render();
    requestAnimationFrame(animate);
}

function render() {
    updateSize();

    canvas.style.transform = `translateY(${window.scrollY}px)`;

    // renderer.setClearColor( 0xffffff );
    renderer.setScissorTest(false);
    renderer.clear();

    // renderer.setClearColor( 0xe0e0e0 );
    renderer.setScissorTest(true);

    scenes.forEach(function (scene) {
        // so something moves
        if (scene.children[2]) {
            if (scene.userData.name === 'faces') {
                scene.children[2].children[0].rotation.y = Date.now() * 0.0005;
            } else if (scene.userData.name === 'circle') {
                scene.children[0].rotation.y = Date.now() * 0.0005;
                scene.children[0].rotation.x = Date.now() * 0.0005;
            }
        }



        // get the element that is a place holder for where we want to
        // draw the scene
        const element = scene.userData.element;

        // get its position relative to the page's viewport
        const rect = element.getBoundingClientRect();

        // check if it's offscreen. If so skip it
        if (rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
            rect.right < 0 || rect.left > renderer.domElement.clientWidth) {

            return; // it's off screen

        }

        // set the viewport
        const width = rect.right - rect.left;
        const height = rect.bottom - rect.top;
        const left = rect.left;
        const bottom = renderer.domElement.clientHeight - rect.bottom;

        renderer.setViewport(left, bottom, width, height);
        renderer.setScissor(left, bottom, width, height);

        const camera = scene.userData.camera;

        renderer.render(scene, camera);

    });
}

function updateSize() {

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width || canvas.height !== height) {

        renderer.setSize(width, height, false);

    }
}



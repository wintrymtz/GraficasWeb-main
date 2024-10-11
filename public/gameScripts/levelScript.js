import * as THREE from "../three.module.js";
import { OrbitControls } from "../OrbitControls.js";
import { FirstPersonControls } from "../gameScripts/FirstPersonControls.js";
import { CharacterController } from "./CharacterController.js";

// const width = 1200;
// const height = 675;

const width = window.innerWidth;
const height = window.innerHeight;

let scene;
let loader;
let camera;
let clock;
let renderer;
let player;

function Init() {
    scene = new THREE.Scene();
    clock = new THREE.Clock(true);
    camera = new THREE.PerspectiveCamera
        (
            75,
            width / height,
            0.1,
            1000
        );
    //x, y, z0
    camera.position.set(0, 0, 20);
    scene.add(camera);

    loader = new THREE.TextureLoader();
    loader.load('img/2k_stars.jpg', function (texture) {
        scene.background = texture;
        console.log(texture);
    });

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    // let fps = new FirstPersonControls(camera, renderer.domElement)
    // fps.movementSpeed = 150;
    // fps.lookSpeed = 150;


    const geometry = new THREE.CapsuleGeometry(6, 7, 3, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const capsule = new THREE.Mesh(geometry, material); scene.add(capsule);

    const size = 100;
    const divisions = 10;
    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    const cameraControl = new OrbitControls(camera, renderer.domElement);

    player = new CharacterController(capsule, camera);

    // let x = prompt('x');
    // let z = prompt('z');
    // capsule.position.set(x, 0, z);

    // const geometry2 = new THREE.CapsuleGeometry(10, 15, 3, 10);
    // const material2 = new THREE.MeshBasicMaterial({
    //     color: '#fffb00'
    // });
    // const capsule2 = new THREE.Mesh(geometry2, material2);

}




function Update() {
    const delta = clock.getDelta();
    scene.traverse(child => {
        if (typeof child.update === 'function') child.update(delta);
    })

    player.update();
}

function Render() {
    renderer.render(scene, camera);
}

Init();

renderer.setAnimationLoop(() => {
    Render();
    Update();
})


export { scene };

//------------------------------------------------------------------------



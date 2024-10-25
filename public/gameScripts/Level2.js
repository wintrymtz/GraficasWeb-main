import * as THREE from "../three.module.js";
import { OrbitControls } from "../OrbitControls.js";
import { FirstPersonControls } from "../gameScripts/FirstPersonControls.js";
import { CharacterController } from "./CharacterController.js";
import { Collider } from "./Colliders.js";

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
let col;
let col2;
let ColArray = [];
let orbitControls;
let planeCol;

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
    camera.position.set(0, 80, -20);
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
    // scene.add(gridHelper);

    player = new CharacterController(capsule, camera);
    col = new Collider(player.Object3d, 1, 13, 20, 13);
    const helper2 = new THREE.Box3Helper(col.boxBB, 0xffff00);
    scene.add(helper2);
    player.setCollider(col);

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.maxDistance = 100;
    orbitControls.enablePan = false;
    // cameraControl.maxPolarAngle
    orbitControls.minDistance = 10;
    orbitControls.target = player.Object3d.position;
    const g = new THREE.BoxGeometry(7, 4, 4);
    const m = new THREE.MeshBasicMaterial({ color: '#8e8e8e' });
    const cube = new THREE.Mesh(g, m);
    cube.position.set(0, 5, 5);
    capsule.add(cube);
    // capsule.add(camera);



    const origin = new THREE.Vector3(capsule.position.x, capsule.position.y, capsule.position.z);
    const length = 30;
    const hex = 0xffff00;

    const arrowHelper = new THREE.ArrowHelper(player.forward, origin, length, hex);
    capsule.add(arrowHelper);

    const Gobs1 = new THREE.BoxGeometry(10, 10, 10);
    const Mobs1 = new THREE.MeshBasicMaterial({ color: '#8e8e8e' });
    const obs1 = new THREE.Mesh(Gobs1, Mobs1);
    col2 = new Collider(obs1, 1, 1, 1, 1);
    ColArray.push(col2);
    const helper = new THREE.Box3Helper(col2.boxBB, 0xffff00);
    scene.add(helper);

    obs1.position.set(0, 0, 20);
    scene.add(obs1);

    const planegeometry = new THREE.BoxGeometry(100, 100);
    const planematerial = new THREE.MeshBasicMaterial({ color: '#5b1c1b' });
    const plane = new THREE.Mesh(planegeometry, planematerial);
    plane.position.set(0, -20, 0);
    plane.rotation.x = (90 * 3.1416 / 180);
    planeCol = new Collider(plane, 1, 1, 1, 1);
    ColArray.push(planeCol);
    const helper3 = new THREE.Box3Helper(planeCol.boxBB, 0xffff00);
    scene.add(helper3);
    scene.add(plane);


}




function Update() {
    const delta = clock.getDelta();
    scene.traverse(child => {
        if (typeof child.update === 'function') child.update(delta);
    })

    player.update(delta, 1, ColArray);
    col.update();
    col2.update();
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


